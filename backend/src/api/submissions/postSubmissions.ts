import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import { v4 as uuidv4 } from 'uuid';

import contest from '../../contest';

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'problem_id is not supplied'
  },
  team_id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'team_id is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'division is not supplied'
  },
  language: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'language is not supplied'
  }
}

export const postSubmissions = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  if (req.files?.source == undefined) {
    res.status(400).json({ message: "source file not supplied" })
    return
  }

  const { problem_id, team_id, division, language } = matchedData(req)

  const submissions = await contest.scanItems('submission', { team_id, problem_id })

  const { name: filename, size: filesize, md5, data } = req.files!.source as UploadedFile
  const submission_id = uuidv4().replace(/-/g, '')
  const submission = {
    submission_id,
    problem_id,
    team_id,
    division,
    language,
    filename,
    filesize,
    md5,
    sub_no: submissions?.length,
    status: 'pending',
    score: 0,
    date: Date.now() / 1000,
    runtime: 0,
    tests: [],
    source: data.toString('utf-8')
  }

  contest.getItem('problem', { problem_id })
    .then((result: any) => {
      submission.tests = result.tests
      contest.putItem('submission', submission)
        .then(_ => res.send(submission))
        .catch(err => res.status(500).send(err))
    })
    .catch(err => res.status(500).send(err))
}
