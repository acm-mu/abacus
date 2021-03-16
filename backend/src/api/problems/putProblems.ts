import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from '../../contest';

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  },
  description: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'description is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'division is not supplied'
  },
  id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'id is not supplied'
  },
  name: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'name is not supplied'
  },
  memory_limit: {
    in: 'body',
    optional: true,
    errorMessage: 'memory_limit is invalid'
  },
  cpu_time_limit: {
    in: 'body',
    optional: true,
    errorMessage: 'cpu_time_limit is invalid'
  },
  tests: {
    in: 'body',
    optional: true
  },
  skeletons: {
    in: 'body',
    optional: true
  },
  solutions: {
    in: 'body',
    optional: true
  }
}

export const putProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)

  if (item.id) {
    const problems = Object.values(await contest.scanItems('problem', { id: item.id }) || {})
    if (problems.length > 0 && problems[0].pid != item.pid) {
      res.status(400).json({ message: "Problem id is taken!" })
      return
    }
  }

  try {
    await contest.updateItem('problem', { pid: req.body.pid }, item)
    res.send(item)
  } catch (err) { res.sendStatus(500) }
}