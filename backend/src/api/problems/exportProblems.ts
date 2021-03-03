import { Request, Response } from 'express';
import contest, { makeJSON } from '../../contest';

export const exportProblems = async (_: Request, res: Response) => {
  try {
    const problems = await contest.scanItems('problems') || []
    res.attachment('problems.json').send(makeJSON(problems))
  } catch (err) { res.sendStatus(500) }
}