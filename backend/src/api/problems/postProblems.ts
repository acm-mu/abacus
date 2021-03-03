import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import { v4 as uuidv4 } from 'uuid';

import contest from '../../contest';

export const schema: Record<string, ParamSchema> = {
  description: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'description is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'division is not supplied'
  },
  id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'id is not supplied'
  },
  problem_name: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'problem_name is not supplied'
  },
  tests: {
    in: 'body',
    optional: true
  },
  skeletons: {
    in: 'body',
    optional: true
  },
  memory_limit: {
    in: 'body',
    isNumeric: true,
    optional: true
  },
  cpu_time_limit: {
    in: 'body',
    isNumeric: true,
    optional: true
  }
}

export const postProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)
  item.skeletons = [{ source: '# Python skeleton goes here', language: 'python' }, { source: '// Java skeleton goes here', language: 'java' }]
  item.pid = uuidv4().replace(/-/g, '')

  try {
    await contest.putItem('problem', item)
    res.send(item)
  }
  catch (err) {
    res.sendStatus(500);
  }
}