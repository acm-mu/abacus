import { Router, Response } from 'express';
import contest from "../contest";

const router = Router();

router.get("/contest", async (_, res: Response) => {
  try {
    const data = await contest.get_settings()
    res.send(data)
  } catch (err) {
    res.status(500).send(err)
  }
});

export default router;
