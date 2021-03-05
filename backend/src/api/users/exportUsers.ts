import { Request, Response } from 'express'
import contest, { makeJSON } from '../../abacus/contest'

export const exportUsers = async (_: Request, res: Response) => {
  try {
    const users = await contest.scanItems('user')
    if (!users) {
      res.sendStatus(500);
      return
    }

    res.attachment('users.json').send(makeJSON(users))
  } catch (err) {
    res.sendStatus(500)
  }
}