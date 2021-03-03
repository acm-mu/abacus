import { createHash } from 'crypto'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import contest from '../../contest'
import jwt from 'jsonwebtoken';

export const schema: Record<string, ParamSchema> = {
  username: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'username is not provided'
  },
  password: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'password is not provided'
  }
}

export const postAuth = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({
      message: errors[0].msg
    })
    return
  }

  const user = matchedData(req)
  user.password = createHash('sha256').update(user.password).digest('hex')

  try {
    const users = await contest.scanItems('user', user)
    if (!users?.length) {
      res.status(400).send({ message: "Invalid credentials!" })
      return
    }
    const { username, password } = users[0]
    const accessToken = jwt.sign({ username, password }, process.env.ACCESS_TOKEN_SECRET || '')
    res.send({ accessToken })

  } catch (err) {
    res.sendStatus(500)
  }

  /*
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  */

}