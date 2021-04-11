import { Response, Request } from 'express';
import contest from "../../abacus/contest"

export default async (_: Request, res: Response) => {
  try {
    res.send(await contest.scanItems('contest'))
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}