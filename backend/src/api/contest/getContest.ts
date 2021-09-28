import { Response, Request } from 'express'
import contest from '../../abacus/contest'

export default async (_: Request, res: Response): Promise<void> => {
  try {
    res.send(await contest.get_settings())
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
