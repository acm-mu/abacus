import { Router, Request, Response } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { v4 as uuidv4 } from 'uuid'
import { contest, transpose, makeJSON } from "../contest";

const users = Router();

users.get(
  '/users',
  checkSchema({
    user_id: {
      in: ['body', 'query'],
      isString: true,
      optional: true,
      errorMessage: 'String user_id is invalid'
    },
    display_name: {
      in: ['body', 'query'],
      isString: true,
      optional: true,
      errorMessage: 'String display_name is not supplied'
    },
    division: {
      in: ['body', 'query'],
      isString: true,
      optional: true,
      errorMessage: 'String division is not supplied',
    },
    password: {
      in: ['body', 'query'],
      isString: true,
      optional: true,
      errorMessage: 'String password is not supplied'
    },
    role: {
      in: ['body', 'query'],
      isString: true,
      optional: true,
      errorMessage: 'String role is not supplied'
    },
    username: {
      in: ['body', 'query'],
      isString: true,
      optional: true,
      errorMessage: 'String username is not supplied'
    },
    scratch_username: {
      in: ['body', 'query'],
      isString: true,
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
    contest.scanItems('user', item)
      .then(response => res.send(transpose(response, 'user_id')))
      .catch(err => res.status(500).send(err))
  }
);

users.put(
  '/users',
  checkSchema({
    user_id: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'String user_id is not supplied'
    },
    display_name: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true
    },
    division: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true
    },
    password: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true
    },
    role: {
      in: 'body',
      isString: true,
      optional: true
    },
    scratch_username: {
      in: 'body',
      isString: true,
      optional: true
    },
    session_token: {
      in: 'body',
      isString: true,
      optional: true
    },
    username: {
      in: 'body',
      isString: true,
      optional: true
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(res).array()
    if (errors.length > 0) {
      res.status(400).json({ message: errors[0].msg })
      return
    }
    const item = matchedData(req)

    const users = Object.values(await contest.scanItems('user', { username: item.username }) || {})
    if (users.length > 1) {
      res.status(400).json({
        message: "Username is alreay used"
      })
      return
    }

    contest.updateItem('user', { user_id: req.body.user_id }, item)
      .then(_ => res.send(item))
      .catch(err => res.status(500).send(err))
  }
)

users.delete(
  '/users',
  checkSchema({
    user_id: {
      in: 'body',
      notEmpty: true,
      errorMessage: 'No user_id supplied',
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
    if (req.body.user_id instanceof Array) {
      let success = 0
      let failed = 0
      for (const user_id of req.body.user_id) {
        deleteSubmissionsForUser(user_id)
        contest.deleteItem('user', { user_id })
          .then(_ => { success++ })
          .catch(_ => { failed++ })
      }
      res.json({ message: `${success} user(s) succesfully deleted. ${failed} failed to delete.` })
    } else {
      deleteSubmissionsForUser(req.body.user_id)
      contest.deleteItem('user', { user_id: req.body.user_id })
        .then(_ => res.json({ message: "User successfully deleted!" }))
        .catch(err => res.status(500).send(err))
    }
  }
)

function deleteSubmissionsForUser(team_id: string) {
  contest.scanItems('submission', { team_id })
    .then(data => {
      data?.forEach((submission) => {
        contest.deleteItem('submission', { submission_id: submission.submission_id })
          .then(_ => console.log(`Deleted submission ${submission.submission_id}`))
          .catch(_ => console.log(`Error deleting submission ${submission.submission_id}`))
      })
    })
    .catch(_ => console.log(`Error finding submissions to delete for user ${team_id}`))
}

users.post(
  '/users',
  checkSchema({
    display_name: {
      in: 'body',
      notEmpty: true,
      isString: true,
      errorMessage: 'String display_name is not supplied'
    },
    division: {
      in: 'body',
      isString: true,
      errorMessage: 'String division is not supplied'
    },
    password: {
      in: 'body',
      notEmpty: true,
      isString: true,
      errorMessage: 'String password is not supplied'
    },
    role: {
      in: 'body',
      notEmpty: true,
      isString: true,
      errorMessage: 'String role is not supplied'
    },
    username: {
      in: 'body',
      notEmpty: true,
      isString: true,
      errorMessage: 'String username is not supplied'
    },
    scratch_username: {
      in: 'body',
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

    const item = matchedData(req)

    const users = Object.values(await contest.scanItems('user', { username: item.username }) || {})
    if (users.length) {
      res.status(400).json({
        message: "Username is alreay used"
      })
      return
    }

    if (item.role == 'team' && item.division == undefined) {
      res.status(400).json({
        message: "Teams need a division"
      })
      return
    }
    item.user_id = uuidv4().replace(/-/g, '')

    contest.putItem('user', item)
      .then(_ => res.send(item))
      .catch(err => res.status(500).send(err))
  }
)

users.get('/users.json', (_req, res) => {
  contest.scanItems('user')
    .then(response => {
      if (response == undefined) {
        res.status(500).send({ message: "Internal Server Error" })
      } else {
        const columns = ['user_id', 'division', 'role', 'username', 'display_name', 'password', 'scratch_username']
        res.attachment('users.json').send(makeJSON(response, columns))
      }
    })
    .catch(err => res.status(500).send({ message: err }))
})

export default users;
