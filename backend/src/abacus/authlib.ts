import { User } from 'abacus'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import contest from './contest'

export const authenticate = (req: Request): Promise<User | undefined> =>
  new Promise<User | undefined>((resolve, reject) => {
    const { authorization } = req.headers
    const token = authorization && authorization.split(' ')[1]
    if (!token) return reject()

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', async (err, data) => {
      if (err || !data) {
        reject()
        return
      }

      try {
        const { username, password } = data as Record<string, unknown>
        const users = await contest.get_users({ username, password })
        if (users.length) {
          req.user = users[0]
          return resolve(users[0])
        }
      } catch (err) {
        reject()
      }
      reject()
    })
  })

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authenticate(req)
    if (user) {
      next()
      return
    }
    res.sendStatus(403)
  } catch (err) {
    res.sendStatus(403)
  }
}

export const userHasRole = (user: User | undefined, role: string): boolean => {
  const roleRank = ['team', 'proctor', 'judge', 'admin']
  return user !== undefined && roleRank.indexOf(user.role) >= roleRank.indexOf(role)
}

export const hasRole = (role: string): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authenticate(req)
      if (userHasRole(user, role)) {
        next()
        return
      }
      res.sendStatus(403)
    } catch (err) {
      res.sendStatus(403)
    }
  }
}
