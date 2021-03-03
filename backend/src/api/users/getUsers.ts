import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest, { transpose } from '../../contest';

export const schema: Record<string, ParamSchema> = {
  user_id: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String user_id is invalid'
  },
  display_name: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String display_name is not supplied'
  },
  school: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String school is invalid'
  },
  division: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String division is not supplied',
  },
  password: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String password is not supplied'
  },
  role: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String role is not supplied'
  },
  username: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String username is not supplied'
  },
  scratch_username: {
    in: ['body', 'query'],
    isString: true,
    optional: true
  }
}

export const getUsers = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  try {
    const users = await contest.scanItems('user', matchedData(req))
    res.send(transpose(users, 'uid'))
  } catch (err) {
    res.sendStatus(500)
  }
}