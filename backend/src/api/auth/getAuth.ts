import { Request, Response } from 'express'

export const getAuth = async (req: Request, res: Response): Promise<void> => {
  res.send(req.user)
}
