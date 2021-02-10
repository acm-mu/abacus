import { Router, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from 'uuid'
import { checkSchema, matchedData, validationResult } from "express-validator";
import contest from "../contest";

const submissions = Router();

submissions.get(
  '/submissions',
  checkSchema({
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
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
      res.status(400).json({
        message: errors[0].msg
      })
      return
    }
    const query = matchedData(req)
    contest.scanItems('submission', query)
      .then(response => res.send(response))
      .catch(err => res.status(400).send(err))
  });

submissions.post(
  '/submissions',
  checkSchema({
    problem_id: {
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
    },
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
      res.status(400).json({ message: errors[0].msg })
      return
    }
    const { problem_id, team_id, division, language } = matchedData(req)

    const { name: filename, size: filesize, md5 } = req.files!.file as UploadedFile
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
      sub_no: 0,
      status: 'pending',
      score: 0,
      date: Date.now() / 1000,
      runtime: 0,
      tests: []
    }

    contest.s3.upload({
      Bucket: 'abacus-submissions',
      Key: `${submission_id}/${filename}`,
      Body: (req as any).files.file.data
    })

    contest.getItem('problem', { problem_id })
      .then((result: any) => {
        submission.tests = result.tests
        contest.putItem('submission', submission)
          .then(_ => res.send(submission))
          .catch(err => res.status(500).send(err))
      })
      .catch(err => res.status(500).send(err))
  }
)

export default submissions;
