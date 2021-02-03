import contest from '../contest';
import { Router, Request, Response } from 'express'

const problems = Router();

problems.get('/', async (req: Request, res: Response) =>
  res.send(await contest.get_problems(req.query as ({ [key: string]: string })))
)

problems.post('/:problem_id/submit', async (req: Request, res: Response) =>
  res.status(200).send(await contest.submit(req))
)

export default problems