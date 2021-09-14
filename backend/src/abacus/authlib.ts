import { User } from "abacus";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import contest from './contest'

export const authenticate = (req: Request, _: Response): Promise<User | undefined> =>
  new Promise<User | undefined>((resolve, reject) => {
    const { authorization } = req.headers
    const token = authorization && authorization.split(' ')[1]
    if (!token) return reject()

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '',
      async (err, data: any) => {
        if (err || !data) reject()

        try {
          const { username, password } = data
          const user = await contest.get_user({ username, password })
          if (user) {
            req.user = user
            resolve(user)
          }
        } catch (err) { }
        reject()
      })
  })


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authenticate(req, res)
    if (user) {
      next()
      return
    }
  } catch (err) { }
  res.sendStatus(403)
}

export const userHasRole = (user: User | undefined, role: string) => {
  const roleRank = ['team', 'proctor', 'judge', 'admin']
  return user && roleRank.indexOf(user.role) >= roleRank.indexOf(role)
}

export const hasRole = (role: string): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authenticate(req, res)
      if (userHasRole(user, role)) {
        next()
        return
      }
    } catch (err) { }

    res.sendStatus(403)
  }
}