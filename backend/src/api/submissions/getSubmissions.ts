import { Problem, Settings, Test, User } from 'abacus'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { transpose } from '../../utils'
import contest from '../../abacus/contest'
import { userHasRole } from '../../abacus/authlib'

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sid is invalid'
  },
  division: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'division is invalid'
  },
  language: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'language is invalid'
  },
  pid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'pid is invalid'
  },
  status: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'status is invalid'
  },
  sub_no: {
    in: ['query', 'body'],
    isNumeric: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sub_no is invalid'
  },
  tid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'tid is invalid'
  },
  released: {
    in: ['query', 'body'],
    isBoolean: true,
    notEmpty: true,
    optional: true
  },
  flagged: {
    in: ['query', 'body'],
    isString: true,
    optional: true
  },
  claimed: {
    in: ['query', 'body'],
    isString: true,
    optional: true
  },
  viewed: {
    in: ['query', 'body'],
    isBoolean: true,
    optional: true
  }
}

const showToUser = (user: User | undefined, problem: Problem, settings: Settings): boolean => {
  const now = Date.now() / 1000

  if (userHasRole(user, 'admin')) return true
  if (user !== undefined) {
    if (problem.practice) return now > settings.practice_start_date && now < settings.practice_end_date
    else return now > settings.start_date && now < settings.end_date
  }
  if (now > settings.end_date) return true
  return false
}

/**
 * @swagger
 *   get:
 *     summary: Search for submissions with provided queries.
 *     description: Returns list of submissions that match provided query.
 *     tags: [submissions]
 *     security:
 *       - bearerAuth: [""]
 *     parameters:
 *       - name: sid
 *         in: query
 *         schema:
 *           type: string
 *       - name: division
 *         in: query
 *         schema:
 *           type: string
 *       - name: language
 *         in: query
 *         schema:
 *           type: string
 *       - name: pid
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: sub_no
 *         in: query
 *         schema:
 *           type: integer
 *       - name: tid
 *         in: query
 *         schema:
 *           type: string
 *       - name: released
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: flagged
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: claimed
 *         in: query
 *         schema:
 *           type: string
 *       - name: viewed
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: List of submissions matching provided queries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *       '400':
 *         description: Could not complete request because request does not match required schema.
 *       '401':
 *         description: Could not authenticate user.
 *       '500':
 *         description: A server error occurred while trying to complete request.
 */
export const getSubmissions = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const problems = transpose(
    await contest.get_problems({}, ['pid', 'division', 'id', 'name', 'max_points', 'capped_points', 'practice']),
    'pid'
  )
  const users = transpose(await contest.get_users(), 'uid') as unknown as User[]

  const settings = await contest.get_settings()

  try {
    const item = matchedData(req)

    if (req?.user?.role == 'judge') {
      item.division = req.user.division
    } else if (req?.user?.role == 'team') {
      item.tid = req.user.uid
    }

    let submissions = (await contest.get_submissions(item)) as any[]

    submissions = submissions?.map((submission: any) => {
      submission.problem = problems[submission.pid]
      const team = users[submission.tid]
      submission.team = {
        uid: team?.uid,
        username: team?.username,
        disabled: team.disabled,
        display_name: team?.display_name,
        division: team?.division
      }
      if (submission.claimed !== undefined) {
        const claimee = users[submission.claimed]
        submission.claimed = {
          uid: claimee?.uid,
          username: claimee?.username,
          display_name: claimee?.display_name,
          division: claimee?.division
        }
      }
      if (submission.flagged !== undefined) {
        const flagger = users[submission.flagged]
        submission.flagged = {
          uid: flagger?.uid,
          username: flagger?.username,
          display_name: flagger?.display_name
        }
      }
      if (req.user?.role == 'team' && !submission.released) {
        submission.status = 'pending'
        submission.score = 0
        submission.tests = submission.tests?.map((test: Test) => ({ ...test, result: '' }))
      }
      return submission
    })

    submissions = submissions?.filter((submission) => showToUser(req.user, submission.problem, settings))

    res.send(transpose(submissions, 'sid'))
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
