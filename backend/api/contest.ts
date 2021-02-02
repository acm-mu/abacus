import { Router, Request, Response } from "express";
import contest from "../contest";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  res.send(await contest.get_settings())
});

export default router;
