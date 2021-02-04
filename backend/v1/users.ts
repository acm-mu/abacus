import { Router, Request, Response } from "express";
import contest from "../contest";

const users = Router();

users.get("/", async (req: Request, res: Response) => {
  try {
    const users = await contest.get_users(req.query as ({ [key: string]: string }))
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
});

export default users;
