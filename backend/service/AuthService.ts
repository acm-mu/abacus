import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(403)
  }

  next()
}

export const isAdminUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role == "admin") {
    next()
  }
  res.sendStatus(403)
}
