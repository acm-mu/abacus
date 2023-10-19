import { Problem, Settings, User } from 'abacus'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'
import { transpose } from '../../utils'
import { authenticate, userHasRole } from '../../abacus/authlib'

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: ['body', 'query'],
    isString: true,
    optional: true
  },
  cpu_time_limit: {
    in: ['body', 'query'],
    isNumeric: true,
    optional: true
  },
  division: {
    in: ['body', 'query'],
    isString: true,
    optional: true
  },
  id: {
    in: ['body', 'query'],
    isString: true,
    optional: true
  },
  memory_limit: {
    in: ['body', 'query'],
    isNumeric: true,
    optional: true
  },
  name: {
    in: ['body', 'query'],
    isString: true,
    optional: true
  },
  columns: {
    in: ['body', 'query'],
    optional: true,
    isString: true
  },
  practice: {
    in: 'body',
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
 * /problems:
 *   get:
 *     summary: Search for problems with provided queries.
 *     description: >-
 *       Returns list of problems that match provided query. Hides problems before competition starts from users.
 *     tags: [Problems]
 *     parameters:
 *       - name: pid
 *         in: query
 *         schema:
 *           type: string
 *       - name: cpu_time_limit
 *         in: query
 *         schema:
 *           type: integer
 *       - name: division
 *         in: query
 *         schema:
 *           type: string
 *       - name: id
 *         in: query
 *         schema:
 *           type: string
 *       - name: memory_limit
 *         in: query
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: columns
 *         in: query
 *         schema:
 *           type: string
 *       - name: practice
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of problems matching provided query.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Problem'
 *       400:
 *         description: Bad Request. Provided query does not match request schema.
 *       500:
 *         description: A server error occured while trying to complete request.
 */
export const getProblems = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const query = matchedData(req)
  let user: User | undefined = undefined
  try {
    user = await authenticate(req)
  } catch (err) {
    user = undefined
  }

  let columns = ['pid', 'division', 'id', 'name', 'practice', 'max_points', 'capped_points'] // Default columns
  /// IF OTHER COLUMNS AUTHENTICATE FOR JUDGE / ADMIN
  if (query.columns) {
    columns = columns.concat(query.columns.split(','))
    if (columns.includes('solutions')) {
      try {
        if (!userHasRole(user, 'proctor')) {
          columns = columns.filter((e) => e != 'solutions')
        }
      } catch (err) {
        columns = columns.filter((e) => e != 'solutions')
      }
    }
    delete query.columns
  }

  try {
    const settings = await contest.get_settings()
    const page = req.body.page ? req.body.page : null
    let problems = await contest.get_problems(query, columns, page)
    problems = problems?.filter((problem) => showToUser(user, problem, settings))
    res.send(transpose(problems, 'pid'))
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
