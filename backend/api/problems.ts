import { Request, Response, Router } from 'express'
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { contest, makeJSON, transpose } from '../contest';

// import { Problem } from 'types';
// import archiver from 'archiver'
import { v4 as uuidv4 } from 'uuid'

const problems = Router();

problems.get(
  '/problems',
  checkSchema({
    pid: {
      in: ['body', 'query'],
      isString: true,
      optional: true
    },
    cpu_time_limit: {
      in: ['body', 'query'],
      isNumeric: true,
      optional: true
    },
    division: {
      in: ['body', 'query'],
      isString: true,
      optional: true
    },
    id: {
      in: ['body', 'query'],
      isString: true,
      optional: true
    },
    memory_limit: {
      in: ['body', 'query'],
      isNumeric: true,
      optional: true
    },
    name: {
      in: ['body', 'query'],
      isString: true,
      optional: true
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
    const data = matchedData(req)
    contest.scanItems('problem', data)
      .then(response => res.send(transpose(response, 'pid')))
      .catch(err => res.status(400).send(err))
  })

problems.post(
  '/problems',
  checkSchema({
    description: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'description is not supplied'
    },
    division: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'division is not supplied'
    },
    id: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'id is not supplied'
    },
    problem_name: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'problem_name is not supplied'
    },
    tests: {
      in: 'body',
      optional: true
    },
    skeletons: {
      in: 'body',
      optional: true
    },
    memory_limit: {
      in: 'body',
      isNumeric: true,
      optional: true
    },
    cpu_time_limit: {
      in: 'body',
      isNumeric: true,
      optional: true
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
      res.status(400).json({ message: errors[0].msg })
      return
    }
    const item = matchedData(req)
    item.skeletons = [{ source: '# Python skeleton goes here', language: 'python' }, { source: '// Java skeleton goes here', language: 'java' }]
    item.problem_id = uuidv4().replace(/-/g, '')

    contest.putItem('problem', item)
      .then(_ => res.send(item))
      .catch(err => res.status(500).send(err))
  }
)

problems.put(
  '/problems',
  checkSchema({
    problem_id: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'problem_id is not supplied'
    },
    description: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true,
      errorMessage: 'description is not supplied'
    },
    division: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true,
      errorMessage: 'division is not supplied'
    },
    id: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true,
      errorMessage: 'id is not supplied'
    },
    problem_name: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true,
      errorMessage: 'problem_name is not supplied'
    },
    tests: {
      in: 'body',
      optional: true,
      notEmpty: true,
      errorMessage: 'tests are invalid'
    },
    skeletons: {
      in: 'body',
      optional: true,
      notEmpty: true,
      errorMessage: 'skeletons are invalid'
    },
    memory_limit: {
      in: 'body',
      optional: true,
      errorMessage: 'memory_limit is invalid'
    },
    cpu_time_limit: {
      in: 'body',
      optional: true,
      errorMessage: 'cpu_time_limit is invalid'
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
      res.status(400).json({ message: errors[0].msg })
      return
    }
    const item = matchedData(req)
    contest.updateItem('problem', { problem_id: req.body.problem_id }, item)
      .then(_ => res.send(item))
      .catch(err => res.status(500).send(err))
  }
)

problems.delete(
  '/problems',
  checkSchema({
    problem_id: {
      in: 'body',
      notEmpty: true,
      errorMessage: 'problem_id is not supplied'
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
      res.status(400).json({ message: errors[0].msg })
      return
    }
    if (req.body.problem_id instanceof Array) {
      let success = 0
      let failed = 0
      for (const problem_id of req.body.problem_id) {
        deleteSubmissionsForProblem(problem_id)
        contest.deleteItem('problem', { problem_id })
          .then(_ => { success++ })
          .catch(_ => { failed++ })
      }
      res.json({ message: `${success} problem(s) successfully deleted. ${failed} failed to delete.` })
    } else {
      deleteSubmissionsForProblem(req.body.problem_id)
      contest.deleteItem('problem', { problem_id: req.body.problem_id })
        .then(_ => res.json({ message: "Problem successfully deleted" }))
        .catch(err => res.status(500).send(err))
    }
  }
)

function deleteSubmissionsForProblem(problem_id: string) {
  contest.scanItems('submission', { problem_id: problem_id })
    .then(data => {
      data?.forEach((submission) => {
        contest.deleteItem('submission', { submission_id: submission.submission_id })
          .then(_ => console.log(`Deleted submission ${submission.submission_id}`))
          .catch(_ => console.log(`Error deleting submission ${submission.submission_id}`))
      })
    })
    .catch(_ => console.log(`Error finding submissions to delete for problem ${problem_id}`))
}

// const stripFilename = (str: string) => str.replace(/ /g, '_').replace(/[!@#$%^&*\(\)]/g, '');
// const fileExtension = (lang: string) => {
//   switch (lang) {
//     case 'python':
//       return 'py';
//     default:
//       return lang
//   }
// }

// problems.get(
//   '/sample_files',
//   checkSchema({
//     problem_id: {
//       in: 'query',
//       notEmpty: true,
//       errorMessage: 'problem_id is not supplied'
//     }
//   }),
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req).array()
//     if (errors.length > 0) {
//       res.status(400).json({ message: errors[0].msg })
//       return
//     }
//     const data = matchedData(req)
//     const { problem_id } = data
//     console.log(problem_id)
//     contest.getItem('problem', { problem_id })
//       .then((response) => {
//         const problem = response as Problem
//         const archive = archiver('zip')
//         for (const skeleton of problem.skeletons)
//           archive.append(skeleton.source, { name: `${stripFilename(problem.problem_name)}.${fileExtension(skeleton.language)}` })

//         res.attachment(`${stripFilename(problem.problem_name)}.zip`)
//         archive.pipe(res)
//         archive.finalize()
//       })
//       .catch(err => res.status(500).send(err))
//   })

problems.get('/problems.json', (_req: Request, res: Response) => {
  contest.scanItems('problem')
    .then(response => {
      if (response == undefined) {
        res.status(500).send({ message: "Internal Server Error" })
      } else {
        const columns = ['problem_id', 'cpu_time_limit', 'description', 'division', 'id', 'max_points', 'memory_limit', 'problem_name', 'tests']
        res.attachment('problems.json').send(makeJSON(response, columns))
      }
    })
    .catch(err => res.status(500).send(err))
})

export default problems