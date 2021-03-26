import { Problem, User } from 'abacus';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import { v4 as uuidv4 } from 'uuid';

import contest from '../../abacus/contest';

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  },
  tid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'tid is not supplied'
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

  try {
    const { pid, tid, language } = matchedData(req)

    const user = await contest.getItem('user', { uid: tid }) as unknown as User
    if (!user) {
      res.status(400).send('Team does not exist!')
      return
    }

    const problem = await contest.getItem('problem', { pid: pid }) as unknown as Problem
    if (!problem) {
      res.status(400).send('Problem does not exist!')
      return
    }
    if (user?.division != problem.division) {
      res.status(400).send('Wrong division!')
      return
    }

    const settings = await contest.get_settings()
    const now = Date.now()
    if (now < settings.start_date * 1000) {
      res.status(400).send('Competition has not started yet!')
      return
    } else if (now > settings.end_date * 1000) {
      res.status(400).send('Competition has ended!')
      return
    }

    const submissions = await contest.scanItems('submission', { tid, pid })

    if (submissions) {
      for (const submission of submissions) {
        if (submission.status === 'accepted') {
          res.status(400).send("Team has already solved problem")
          return
        }
        if (submission.status === 'pending') {
          res.status(400).send("Cannot submit while there are submissions for this problem in the pending state")
          return
        }
      }
    }

    const { name: filename, size: filesize, md5, data } = req.files!.source as UploadedFile

    const submission = {
      sid: uuidv4().replace(/-/g, ''),
      pid,
      tid,
      division: problem.division,
      language,
      filename,
      filesize,
      md5,
      claimed: undefined,
      released: false,
      sub_no: submissions?.length,
      status: 'pending',
      score: 0,
      date: Date.now() / 1000,
      tests: problem.tests,
      runtime: 0,
      source: data.toString('utf-8')
    }

    await contest.putItem('submission', submission)
    res.send(submission)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
