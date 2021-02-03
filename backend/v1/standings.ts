import { Router, Response } from "express";

const standings = Router();

standings.get("/", async (_, res: Response) =>
  res.status(501)
  // res.send(await contest.get_standings(req.query))
);

export default standings;
