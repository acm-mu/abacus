import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'
import { transpose } from '../../utils'

export const schema: Record<string, ParamSchema> = {
  uid: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String uid is invalid'
  },
  display_name: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String display_name is not supplied'
  },
  school: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String school is invalid'
  },
  division: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String division is not supplied'
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
  }
}
/*
export const getUserCount = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const params = matchedData(req)
  if (req.user?.role == 'team') params.uid = req.user?.uid
  if (req.user?.role == 'judge') {
    params.role = 'team'
    params.division = req.user.division
  }
  try {
    const users = await contest.get_user_page_count(params)
    users?.map((user: any) => {
      const { password, ...returnUser } = user
      return returnUser
    })
    res.send(transpose(users, 'uid'))
  } catch (err) {
    res.sendStatus(500)
  }
}
*/

export const getUsers = async (req: Request, res: Response) => {
  
  const page = req.query.page
  console.log("page",page)
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const params = matchedData(req)

  //const newPage = page ? page  : null;
  if (req.user?.role == 'team') params.uid = req.user?.uid
  if (req.user?.role == 'judge') {
    params.role = 'team'
    params.division = req.user.division
  }

  try {
    const newPage = page ? parseInt(page as string) : undefined
    const users = await contest.get_users(params, newPage)
    users?.map((user: any) => {
      const { password, ...returnUser } = user
      return returnUser
    })
    res.send(transpose(users, 'uid'))
  } catch (err) {
    res.sendStatus(500)
  }
}
