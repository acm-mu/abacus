import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import { v4 as uuidv4 } from 'uuid';
import contest from 'contest';

export const schema: Record<string, ParamSchema> = {
  id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'id is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'division is not supplied'
  },
  name: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'name is not supplied'
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
  },
  description: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'description is not supplied'
  },
  skeletons: {
    in: 'body',
    optional: true
  },
  solutions: {
    in: 'body',
    optional: true
  },
  tests: {
    in: 'body',
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
  item.pid = uuidv4().replace(/-/g, '')
  item.skeletons = [{ source: '# Python skeleton goes here', language: 'python' }, { source: '// Java skeleton goes here', language: 'java' }]
  item.solutions = [{ source: '# Python solution goes here', language: 'python' }, { source: '// Java solution goes here', language: 'java' }]

  const problems = await contest.scanItems('problem', { id: item.id }) || {}
  if (Object.values(problems).length > 0) {
    res.status(400).json({ message: "Problem id is taken!" })
    return
  }

  try {
    await contest.putItem('problem', item)
    res.send(item)
  }
  catch (err) {
    res.sendStatus(500);
  }
}