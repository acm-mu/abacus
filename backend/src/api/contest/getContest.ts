import { Response, Request } from 'express';
import contest from "../../abacus/contest"

export default async (_: Request, res: Response) => {
  try {
    const data = await contest.get_settings()
    res.send(data)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}