import { Request, Response } from "express";
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from "../../abacus/contest";
import { v4 as uuidv4 } from 'uuid'

export const schema: Record<string, ParamSchema> = {
  type: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'type is not provided!'
  },
  title: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  body: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'body is not provided!'
  },
  division: {
    in: 'body',
    isString: true,
    optional: true
  },
  uid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'uid is not provided'
  },
  parent: {
    in: 'body',
    optional: true
  }
}

export const postClarifications = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  try {
    const { type, title, body, division, uid, parent } = matchedData(req)

    const clarification = {
      cid: uuidv4().replace(/-/g, ''),
      uid,
      type,
      title,
      body,
      date: Date.now() / 1000,
      division,
      parent
    }

    await contest.putItem('clarification', clarification)
    res.send(clarification)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}