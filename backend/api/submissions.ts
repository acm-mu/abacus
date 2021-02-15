import { Router, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from 'uuid'
import { checkSchema, matchedData, validationResult } from "express-validator";
import { contest, makeJSON, transpose } from "../contest";

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
    const problems = transpose(await contest.scanItems('problem'), 'problem_id')
    const teams = transpose(await contest.scanItems('user', { role: 'team' }), 'user_id')

    const query = matchedData(req)
    contest.scanItems('submission', query)
      .then(response => {
        response?.map((submission: any) => {
          submission.problem = problems[submission.problem_id]
          const team = teams[submission.team_id]
          submission.team = {
            user_id: team.user_id,
            username: team.username,
            display_name: team.display_name,
            division: team.division
          }
        })

        res.send(transpose(response, 'submission_id'))
      })
      .catch(err => res.status(400).send(err))
  }
)

submissions.put(
  '/submissions',
  checkSchema({
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
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
      res.status(400).json({ message: errors[0].msg })
      return
    }
    const item = matchedData(req)
    contest.updateItem('submission', { submission_id: req.body.submission_id }, item)
      .then(_ => res.send(item))
      .catch(err => res.status(500).send(err))
  }
)

submissions.delete(
  '/submissions',
  checkSchema({
    submission_id: {
      in: 'body',
      notEmpty: true,
      errorMessage: 'No submission_id supplied'
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
    if (req.body.submission_id instanceof Array) {
      let success = 0
      let failed = 0
      for (const submission_id of req.body.submission_id) {
        contest.deleteItem('submission', { submission_id })
          .then(_ => { success++ })
          .catch(_ => { failed++ })
      }
      res.json({ message: `${success} submission(s) successfully deleted. ${failed} failed to delete.` })
    } else {
      contest.deleteItem('submission', { submission_id: req.body.submission_id })
        .then(_ => res.json({ message: "Submission successfully deleted!" }))
        .catch(err => res.status(500).send(err))
    }
  }
)

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
    }
  }),
  async (req: Request, res: Response) => {
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
      sub_no: 0,
      status: 'pending',
      score: 0,
      date: Date.now() / 1000,
      runtime: 0,
      tests: [],
      source: data.toString('utf-8')
    }

    contest.s3.upload({
      Bucket: 'abacus-submissions',
      Key: `${submission_id}/${filename}`,
      Body: (req as any).files.source.data
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

submissions.get('/submissions.json', (_req, res) => {
  contest.scanItems('submission')
    .then(response => {
      if (response == undefined) {
        res.status(500).send({ message: "Internal Server Error" })
      } else {
        const columns = ['submission_id', 'date', 'division', 'filename', 'filesize', 'language', 'md5', 'problem_id', 'runtime', 'score', 'source', 'status', 'sub_no', 'team_id', 'tests']
        res.attachment('submissions.json').send(makeJSON(response, columns))
      }
    })
    .catch(err => res.status(500).send(err))
})

export default submissions;
