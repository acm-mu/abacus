import axios from 'axios'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'
import { io } from '../../server'

// Define the validation schema for the request body
export const schema: Record<string, ParamSchema> = {
  sid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'sid is invalid'
  }
}

/**
 * @swagger
 * /submissions/rerun:
 *   post:
 *     summary: Invoke piston runner to rerun submission
 *     security:
 *       - bearerAuth: [""]
 *     tags: [Submissions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               sid:
 *                 type: string
 *             required: [sid]
 *     responses:
 *       200:
 *         description: Returns payload from piston runner lambda (Subject to change).
 *       400:
 *         description: Could not complete request, request does not match schema.
 *       500:
 *         description: A server error occurred while trying to complete request.
 */

// Function to handle the POST request for rerunning a submission
export const rerunSubmission = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors in the request
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    // If validation fails, return a 400 Bad Request response
    res.status(400).json({ message: errors[0].msg })
    return
  }

  // Get matched data from the request
  const item = matchedData(req)

  try {
    // Get the submission data using the submission ID (sid)
    const submission = await contest.get_submission(item.sid)
    // Get the problem associated with the submission
    const problem = await contest.get_problem(submission.pid)

    // Get the contest settings such as start dates and points configuration
    const { start_date, practice_start_date, points_per_yes, points_per_minute, points_per_no } =
      await contest.get_settings()
    
    // Checks to see if submission exists
    if (submission) {
      submission.tests = problem.tests
      let num_testcases_wrong = 0
      
      // Iterate through each test case to run and evaluate the submission
      for (let test of problem.tests) {
        // Copy tests from problem
        submission.tests = problem.tests
        // Prepare the file and input for the test run
        const file = { name: submission.filename as string, content: submission['source'] as string }
      
      try {
        // Send the submission source code to the piston runner API to execute
        const res = await axios.post(
          'https://piston.tabot.sh/api/v2/execute', // API endpoint to execute the code
          {
            language: submission.language as string, // Programming language of the submission
            version: '*', // Use the latest version of the language
            files: [file], // File containing the source code
            stdin: test.in // Input data for the test case
          },
          {
            headers: {
              'Content-Type': 'application/json' // Set the content type for the request
            }
          }
        )

        // Capture the output from the piston runner response
        test['stdout'] = res.data.run.code == 0 ? res.data.run.stdout : res.data.run.stderr

        // Compare the output with the expected output
        if(((res.data.run.stdout.trim() as string) == (test.out.trim() as string)))
        {
          // If the output is correct, mark as 'accepted'
          test['result'] = 'accepted'
        }
        else
        {
          // If output is incorrect, increment the counter for wrong test cases and mark as 'rejected'
          num_testcases_wrong += 1
          test['result'] = 'rejected'
        }
      }
      catch (e) {
        // Handle any errors during the test run
        console.log(e)
      }
    }

    /* If there are wrong test cases, the submission status is makred as 'rejected', 
    otherwise the submission status is marked as 'accepted' */
    if(num_testcases_wrong > 0)
    {
      submission.status = "rejected"
    }
    else
    {
      submission.status = "accepted"
    }
    
    // Calculate the score for the submission
    if(submission.status == "accepted" || submission.status == "rejected")
    {
      console.log("/backend/src/api/submissions/rerunSubmission.ts submission.sub_no", submission.sub_no)
      
      let minutes = 0

      // Calculate the time spent on the problem based on whether it's a practice or competition problem
      if(problem.practice)
      {
        minutes = ((submission.date as any) - practice_start_date) / 60
      }
      else
      {
        minutes = ((submission.date as any) - start_date) / 60
      }

      // Calculate the final score based on time taken and the number of attempts
      submission.score = Math.floor((minutes * points_per_minute) + (points_per_no * submission.sub_no) + points_per_yes)
    }
    else
    {
      // If the submission is neither accepted or rejected, score is 0
      submission.score = 0
    }

    // Save the updated submission to the database
    await contest.update_submission(submission.sid as string, {...submission, sid: submission.sid})

    // Emit a socket event to notify other services or clients about the updated submission
    io.emit('update_submission', { sid: submission.sid })

    // Send the updated submission as a response
    res.send(submission)
  }
 } catch (err) {
    // Handle any errors that occur during the process and send a 500 Internal Server Error response
    console.error(err)
    res.sendStatus(500)
  }
}
