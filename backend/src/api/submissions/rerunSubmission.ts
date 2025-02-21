import axios from 'axios'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'

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
export const rerunSubmission = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const item = matchedData(req)
  try {
    const submission = await contest.get_submission(item.sid)
    const problem = await contest.get_problem(submission.pid)

    const { start_date, practice_start_date, points_per_yes, points_per_minute, points_per_no } =
      await contest.get_settings()
    if (submission) {
      submission.tests = problem.tests
      // Update status to 'pending'
      // await updateItem('', { submission.sid }, { status: 'pending' });
      // Extract details and set defaults
      let status = 'accepted'
      for (let test of problem.tests) {
        // Copy tests from problem
        submission.tests = problem.tests
        // Run tests
        const file = { name: submission.filename as string, content: submission['source'] as string }
        // Await response from piston execution
        /*try {
          const res = await axios.post(
            'https://piston.tabot.sh/api/v2/execute',
            {
              language: item.language as string,
              files: [file],
              version: '*',
              stdin: test.in
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          test['stdout'] = res.data.run.code == 0 ? res.data.run.stdout : res.data.run.stderr
          if ((res.data.run.output.trim() as string) == (test.out.trim() as string) && res.data.run.code === 0) {
            console.log('Result: ACCEPTED')
            test['result'] = 'accepted'
          } else {
            console.log('Result: REJECTED')
            status = 'rejected'
            test['result'] = 'rejected'
          }
        } catch (e) {
          console.log(e)
        }
      }

      submission.status = status
      // Calculate Score
      if (status == 'accepted') {
        let minutes = 0
        if (problem.practice) {
          minutes = ((submission.date as any) - practice_start_date) / 60
        } else {
          minutes = ((submission.date as any) - start_date) / 60
        }
        submission.score = Math.floor(
          minutes * points_per_minute + points_per_no * (submission.sub_no as any) + points_per_yes
        )
      } else {
        submission.score = 0
      }
      // update submission
      await contest.update_submission(submission.sid as string, { ...submission, sid: submission.sid })
      res.send(submission)*/
      try {
        const res = await axios.post(
          'https://piston.tabot.sh/api/v2/execute',
          {
            language: submission.language as string,
            version: '*',
            files: [file],
            stdin: test.in
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        test['stdout'] = res.data.run.code == 0 ? res.data.run.stdout : res.data.run.stderr
        if(((res.data.run.stdout.trim() as string) == (test.out.trim() as string)))
        {
          console.log('Result: ACCEPTED')
          test['result'] = 'accepted'
        }
        else
        {
          console.log('Result: REJECTED')
          status = 'rejected'
          test['result'] = 'rejected'
        }
      }
      catch (e) {
        console.log(e)
      }
    }
    submission.status
    //Calculate Score
    if(status == "accepted")
    {
      let minutes = 0
      if(problem.practice)
      {
        minutes = ((submission.date as any) - practice_start_date) / 60
      }
      else
      {
        minutes = ((submission.date as any) - start_date) / 60
      }
      submission.score = Math.floor(minutes * points_per_minute + points_per_no * (submission.sub_no as any) + points_per_yes)
    }
    else
    {
      submission.score = 0
    }
    //Save submission to database
    await contest.update_submission(submission.sid as string, {...submission, sid: submission.sid})
    res.send(submission)
  }
 } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
