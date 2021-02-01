import { Router } from "express";
// import contest from "../contest";

const standings = Router();

standings.get("/", async (_req, res) =>
res.send("Hello World")
  // res.send(await contest.get_standings(req.query))
);

export default standings;
