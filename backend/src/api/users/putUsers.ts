import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from "../../contest"

export const schema: Record<string, ParamSchema> = {
  user_id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'String user_id is not supplied'
  },
  display_name: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  school: {
    in: 'body',
    isString: true,
    optional: true
  },
  password: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  role: {
    in: 'body',
    isString: true,
    optional: true
  },
  scratch_username: {
    in: 'body',
    isString: true,
    optional: true
  },
  session_token: {
    in: 'body',
    isString: true,
    optional: true
  },
  username: {
    in: 'body',
    isString: true,
    optional: true
  }
}

export const putUsers = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)
  item.password = createHash('sha256').update(item.password).digest('hex')

  try {
    const users = await contest.scanItems('user', { username: item.username }) || {}
    if (Object.values(users).length > 1) {
      res.status(400).json({ message: "Username is taken!" })
      return
    }

    await contest.updateItem('user', { uid: item.uid }, item)
    res.send(item)
  } catch (err) {
    res.sendStatus(500)
  }
}