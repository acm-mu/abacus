import { Router } from "express";
import contest from "../contest";

const users = Router();

users.get("/", async (req, res) =>
  res.send(await contest.get_users(req.query))
);

export default users;
