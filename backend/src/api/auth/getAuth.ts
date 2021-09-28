import { Request, Response } from 'express'

export const getAuth = async (req: Request, res: Response) => {
  res.send(req.user)
}
