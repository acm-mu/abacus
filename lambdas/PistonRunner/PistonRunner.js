const AWS = require("aws-sdk");
const axios = require("axios");

const db = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName != "INSERT") continue

    const submission = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
    const { submission_id } = submission

    const problem = await getItem('problem', { problem_id: submission.problem_id })

    const settings = Object.assign({}, ...(await scanItems('setting')).map(((x) => ({ [x.key]: x.value }))))

    await updateItem('submission', { submission_id }, { status: 'pending' })

    const { language, source, date: submission_date } = submission

    let status = "accepted"
    let runtime = -1
    for (const test of submission.tests) {
      const res = await axios.post("https://piston.codeabac.us/execute", {
        language,
        source,
        stdin: test.in
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      runtime = Math.max(runtime, res.data.runtime)
      test.stdout = res.data.output

      if (res.data.output != test.out) {
        console.log("Result: REJECTED")
        status = "rejected"
        test['result'] = "rejected"
        break
      } else {
        console.log("Result: ACCEPTED")
        test['result'] = "accepted"
      }
    }

    // Calculate Score
    if (status == "accepted") {
      const { start_date, points_per_no, points_per_yes, points_per_minute } = settings
      const minutes = (submission_date - start_date) / 60
      console.log(`Minutes: ${minutes}`)

      submission.score = Math.floor((minutes * points_per_minute) + (points_per_no * submission.sub_no) + points_per_yes)
    } else {
      submission.score = 0
    }

    await updateItem('submission', { submission_id }, { ...submission, status, runtime })
  }

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};

function scanItems(tableName) {
  return new Promise((resolve, reject) => {
    db.scan({
      TableName: tableName
    }, (err, data) => {
      if (err) reject(err)
      else resolve(data.Items)
    })
  })
}

function getItem(tableName, key) {
  return new Promise((resolve, reject) => {
    db.get({
      TableName: tableName,
      Key: key
    }, (err, data) => {
      if (err) reject(err)
      else resolve(data.Item)
    })
  })
}

function updateItem(tableName, key, args) {
  return new Promise((resolve, reject) => {
    const entries = Object.entries(args).filter(entry => !Object.keys(key).includes(entry[0]))
    db.update({
      TableName: tableName,
      Key: key,
      UpdateExpression: "SET " + (entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(", ")),
      ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
      ExpressionAttributeValues: Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
    }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
