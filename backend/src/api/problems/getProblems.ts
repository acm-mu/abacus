import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest, { transpose } from '../../contest';

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
  }
}

export const getProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  try {
    const problems = await contest.scanItems('problem', matchedData(req))
    res.send(transpose(problems, 'pid'))
  } catch (err) { res.sendStatus(500) }
}