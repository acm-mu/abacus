import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";

import contest from '../../contest';

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'problem_id is not supplied'
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
  problem_name: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'problem_name is not supplied'
  },
  tests: {
    in: 'body',
    optional: true,
    notEmpty: true,
    errorMessage: 'tests are invalid'
  },
  skeletons: {
    in: 'body',
    optional: true,
    notEmpty: true,
    errorMessage: 'skeletons are invalid'
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
  }
}

export const putProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)
  try {
    await contest.updateItem('problem', { problem_id: req.body.pid }, item)
    res.send(item)
  } catch (err) { res.sendStatus(500) }
}