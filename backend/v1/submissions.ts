import { Router, Request, Response } from "express";
import contest from "../contest";

const submissions = Router();

submissions.get("/submissions", async (req: Request, res: Response) => {
  try {
    const submissions = await contest.get_submissions(req.query as ({ [key: string]: string }))
    res.send(submissions)
  } catch (err) {
    res.status(500).send(err)
  }
});

export default submissions;
