import { Problem, Settings, User } from 'abacus';
import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import { contest } from '../../abacus';
import { transpose } from '../../utils';
import { authenticate, userHasRole } from '../../abacus/authlib';

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

export const getProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const query = matchedData(req)
  let user: User | undefined = undefined
  try {
    user = await authenticate(req, res)
  } catch (err) { }

  let columns = ['pid', 'division', 'id', 'name', 'practice', 'max_points', 'capped_points'] // Default columns
  /// IF OTHER COLUMNS AUTHENTICATE FOR JUDGE / ADMIN
  if (query.columns) {
    columns = columns.concat(query.columns.split(','))
    if (columns.includes('solutions')) {
      try {
        if (!userHasRole(user, 'proctor')) {
          columns = columns.filter(e => e != 'solutions')
        }
      } catch (err) {
        columns = columns.filter(e => e != 'solutions')
      }
    }
    delete query.columns
  }

  try {
    const settings = await contest.get_settings()

    let problems = await contest.get_problems(query, columns)
    problems = problems?.filter(problem => showToUser(user, problem, settings))
    res.send(transpose(problems, 'pid'))
  } catch (err) {
    console.error(err);
    res.sendStatus(500)
  }
}