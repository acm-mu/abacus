import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from "express-validator"
import contest, { transpose } from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sid is invalid'
  },
  division: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'division is invalid'
  },
  language: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'language is invalid'
  },
  pid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'pid is invalid'
  },
  status: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'status is invalid'
  },
  sub_no: {
    in: ['query', 'body'],
    isNumeric: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sub_no is invalid'
  },
  tid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'tid is invalid'
  }
}

export const getSubmissions = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const problems = transpose(await contest.scanItems('problem'), 'pid')
  const teams = transpose(await contest.scanItems('user', { role: 'team' }), 'uid')

  try {
    const item = matchedData(req)

    if (req.user.role == 'judge') {
      item.division = req.user.division
    } else if (req.user.role == 'team') {
      item.tid = req.user.uid
    }

    const submissions = await contest.scanItems('submission', item)

    submissions?.map((submission: any) => {
      submission.problem = problems[submission.pid]
      const team = teams[submission.tid]
      submission.team = {
        uid: team.uid,
        username: team.username,
        display_name: team.display_name,
        division: team.division
      }
    })

    res.send(transpose(submissions, 'sid'))
  } catch (err) {
    res.sendStatus(500)
  }
}
