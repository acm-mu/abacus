import { Request, Response, Router } from "express";
import { checkSchema, matchedData } from 'express-validator';

import { contest } from "./contest";
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid'
import { Args, User } from "./types";

const authlib = Router();

authlib.post(
  '/auth',
  checkSchema({
    username: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'username is not supplied'
    },
    password: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true,
      errorMessage: 'String password is not supplied'
    },
    session_token: {
      in: 'body',
      isString: true,
      notEmpty: true,
      optional: true,
      errorMessage: 'String session_token is not supplied'
    }
  }),
  async (req: Request, res: Response) => {
    let { username, password, session_token } = matchedData(req, { includeOptionals: true })

    let args: Args = { username, session_token }
    if (password) {
      const hash = createHash('sha256').update(password).digest('hex')
      args = { username, password: hash }
    }

    contest.scanItems('user', args)
      .then(users => {
        if (users?.length == 1) {
          const user = users[0] as unknown as User
          if (!session_token) {
            session_token = uuidv4().replace(/-/g, '')
            contest.updateItem('user', { user_id: user.uid }, { session_token })
              .catch(err => res.status(400).send(err))
          }
          res.send(user)
        } else {
          res.status(400).send({
            message: "User not found"
          })
        }
      })
      .catch(err => res.status(400).send(err))
  })

export default authlib