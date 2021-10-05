const axios = require('axios')
const { DynamoDB: { Converter: { unmarshall } } } = require('aws-sdk')

const API_URL = "http://localhost"

exports.handler = async(event) => {

  // Authenticate to get accessToken
  const res = await axios.post(`${API_URL}/auth`, {
    username: 'admin',
    password: 'goldeneagles'
  })

  const { accessToken } = res.data

  const submissions = {}

  for (const record of event.Records) {
    if (record.eventName != "INSERT") continue

    const submission = unmarshall(record.dynamodb.NewImage)
    const { sid, pid, division } = submission

    if (division !== 'blue') continue

    // Get problem and competition details
    let problem, settings
    try {
      const problemRes = await axios.get(`${API_URL}/problems?pid=${pid}&columns=tests`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      problem = problemRes.data[pid]

      const settingsRes = await axios.get(`${API_URL}/contest`)
      settings = settingsRes.data
    } catch (e) {
      console.log("Error occurred while trying to get submission info")
    }

    // Update status to pending
    try {
      await axios.put(`${API_URL}/submissions`, {
        sid: submission.sid,
        status: "pending"
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    } catch (e) {
      console.log("Error occurred while trying to update submission")
    }

    // Extract details and set defaults
    const { language, source, date: submission_date } = submission
    let status = "accepted"
    let runtime = -1

    // Copy tests from problem
    submission.tests = problem.tests

    // Run tests
    for (const test of submission.tests) {
      // Await response from piston execution
      const res = await axios.post(`${API_URL}:2000/api/v2/execute`, {
        language,
        version: "15.0.2",
        files: [{ content: source }],
        stdin: test.in
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      // runtime = Math.max(runtime, res.data.runtime)
      test.stdout = res.data.run.output

      if (res.data.output != test.out) {
        console.log("Result: REJECTED")
        status = "rejected"
        test['result'] = "rejected"
      } else {
        console.log("Result: ACCEPTED")
        test['result'] = "accepted"
      }
    }

    submission.status = status
    submission.runtime = runtime

    // Calculate score
    if (status == "accepted") {
      let { start_date, points_per_no, points_per_yes, points_per_minute } = settings
      if (problem.practice) {
        start_date = settings.practice_start_date
      }
      const minutes = (submission_date - start_date) / 60

      submission.score = Math.floor((minutes * points_per_minute) + (points_per_no * submission.sub_no) + points_per_yes)
    } else {
      submission.score = 0
    }

    // Save submission to database
    try {
      await axios.put(`${API_URL}/submissions`, submission, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    } catch (e) {
      console.log("Error occurred while trying to save submission")
    }
    submissions[sid] = submission
  }

  return { statusCode: 200, submissions }
}