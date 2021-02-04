import { Router, Response } from "express";

const standings = Router();

standings.get("/", async (_, res: Response) => {
  res.status(501).send({
    status: 501,
    message: "Method Not Yet Implemeneted"
  })
});

export default standings;
