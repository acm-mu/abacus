import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from "express-validator"
import contest, { transpose } from '../../contest'

export const schema: Record<string, ParamSchema> = {
  submission_id: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'submission_id is invalid'
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
  problem_id: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'problem_id is invalid'
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
  team_id: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'team_id is invalid'
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
    const submissions = await contest.scanItems('submission', matchedData(req))

    submissions?.map((submission: any) => {
      submission.problem = problems[submission.problem_id]
      const team = teams[submission.team_id]
      submission.team = {
        user_id: team.user_id,
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
