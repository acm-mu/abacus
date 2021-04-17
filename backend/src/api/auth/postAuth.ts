import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'
import jwt from 'jsonwebtoken';
import { sha256 } from '../../utils';

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
    res.status(400).json({ message: errors[0].msg })
    return
  }
  try {
    const { username, password } = matchedData(req)

    const user: Record<string, unknown> | undefined = await contest.get_user({ username: username.toLowerCase(), password: sha256(password) })
    if (!user) {
      res.status(400).send({ message: "mmm... We can't find a user with that username and password!" })
      return
    }

    const accessToken = jwt.sign({
      username: user.username,
      password: user.password
    }, process.env.ACCESS_TOKEN_SECRET || '')

    delete user.password

    res.send({ accessToken, ...user })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}