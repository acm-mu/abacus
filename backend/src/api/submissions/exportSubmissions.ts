import { Request, Response } from 'express';
import contest, { makeJSON } from '../../abacus/contest';

export const exportSubmissions = async (_: Request, res: Response) => {
  try {
    const submissions = await contest.scanItems('submission')
    if (!submissions) {
      res.sendStatus(500);
      return
    }
    res.attachment('submissions.json').send(makeJSON(submissions))

  } catch (err) {
    res.sendStatus(500)
  }
}