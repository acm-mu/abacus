import { Router, Response } from 'express';
import contest from "../contest";

const router = Router();

router.get("/", async (_, res: Response) => {
  res.send(await contest.get_settings())
});

export default router;
