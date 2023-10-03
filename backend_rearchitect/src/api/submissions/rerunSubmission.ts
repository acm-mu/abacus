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
      let newSubmission = { ...submission }
      newSubmission.tests = problem.tests;
      // Update status to 'pending'
      // await updateItem('', { submission.sid }, { status: 'pending' });
      // Extract details and set defaults
      let status = 'accepted'
      for (let test of problem.tests) {
        // Copy tests from problem
        newSubmission.tests = problem.tests
        // Run tests
        const file = { name: newSubmission.filename as string, content: newSubmission['source'] as string }
        // Await response from piston execution
        try {
          const res = await axios.post(
            'https://piston.tabot.sh/api/v2/execute',
            {
              language: item.language,
              files: [file],
              version: item.language === 'python' ? '3.9.4' : '15.0.2',
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

      newSubmission.status = status
      // Calculate Score
      if (status == 'accepted') {
        let minutes = 0
        if (problem.practice) {
          minutes = ((newSubmission.date as any) - practice_start_date) / 60
        } else {
          minutes = ((newSubmission.date as any) - start_date) / 60
        }
        newSubmission.score = Math.floor(
          minutes * points_per_minute + points_per_no * (newSubmission.sub_no as any) + points_per_yes
        )
      } else {
        newSubmission.score = 0
      }
      // update submission
      await contest.update_submission(newSubmission.sid as string, { ...newSubmission, sid: newSubmission.sid })
      res.send(newSubmission)
    }
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
