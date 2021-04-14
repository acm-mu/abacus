import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import { authenticate, userHasRole } from '../../abacus/authlib';
import contest, { transpose } from '../../abacus/contest';

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
  type: {
    in: ['body', 'query'],
    optional: true,
    isString: true
  }
}

export const getProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const { type, ...query } = matchedData(req)
  let columns = ['pid', 'division', 'id', 'name']
  /// IF OTHER COLUMNS AUTHENTICATE FOR JUDGE / ADMIN
  if (query.columns) {
    columns = columns.concat(query.columns.split(','))
    if (columns.includes('solutions')) {
      try {
        const user = await authenticate(req, res)
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
    let problems: any = await contest.scanItems('problem', { args: query, columns })
    if (!problems.length) {
      res.send([])
      return
    }
    if (type !== "list")
      problems = transpose(problems, 'pid')
    res.send(problems)
  } catch (err) {
    console.error(err);
    res.sendStatus(500)
  }
}