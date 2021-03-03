import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import contest from '../contest'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    res.sendStatus(401)
    return
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '',
    async (err, { username, password }: any) => {
      if (err) {
        return res.status(500).send({ message: "Token is invalid!" })
      }

      try {
        const users = await contest.scanItems('user', { username, password })
        if (users && users.length) {
          req.user = users[0]
          next()
          return
        }
        res.sendStatus(401)
        return
      } catch (err) { }
      res.sendStatus(500)
      return
    })
}

export const isAdminUser = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    res.sendStatus(403)
    return
  }
  next()
}
