import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from '../../abacus/contest';

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'sid is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'division is invalid'
  },
  language: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'language is invalid'
  },
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'pid is invalid'
  },
  status: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'status is invalid'
  },
  sub_no: {
    in: 'body',
    isNumeric: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sub_no is invalid'
  },
  tid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'tid is invalid'
  },
  released: {
    in: 'body',
    isBoolean: true,
    optional: true
  }
}

export const putSubmissions = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const item = matchedData(req)
  try {
    await contest.updateItem('submission', { sid: item.sid }, item)
    res.send(item)
  } catch (err) { res.sendStatus(500) }
}
