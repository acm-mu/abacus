import { contest, transpose } from '../contest';
import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { checkSchema, matchedData, validationResult } from 'express-validator';

const problems = Router();

problems.get(
  '/problems',
  checkSchema({
    problem_id: {
      in: ['body', 'query'],
      isString: true,
      optional: true
    },
    cpu_time_limit: {
      in: ['body', 'query'],
      isNumeric: true,
      optional: true
    },
    description: {
      in: ['body', 'query'],
      isString: true,
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
    problem_name: {
      in: ['body', 'query'],
      isString: true,
      optional: true
    },
    tests: {
      in: ['body', 'query'],
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
      .then(response => res.send(transpose(response, 'problem_id')))
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
      isString: true,
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

    contest.deleteItem('problem', { problem_id: req.body.problem_id })
      .then(_ => res.json({ message: "Problem successfully deleted" }))
      .catch(err => res.status(500).send(err))
  }
)

export default problems