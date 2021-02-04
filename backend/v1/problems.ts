import contest from '../contest';
import { Router, Request, Response } from 'express'

const problems = Router();

problems.get('/', async (req: Request, res: Response) => {
  try {
    const problems = await contest.get_problems(req.query as ({ [key: string]: string }))
    res.send(problems)
  } catch (err) {
    res.status(500).send(err)
  }
})

problems.post('/:problem_id/submit', async (req: Request, res: Response) => {
  try {
    const result = await contest.submit(req)
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})

export default problems