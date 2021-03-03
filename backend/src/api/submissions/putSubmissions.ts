import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from '../../contest';

export const schema: Record<string, ParamSchema> = {
  submission_id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'submission_id is not supplied'
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
  problem_id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'problem_id is invalid'
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
  team_id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'team_id is invalid'
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
