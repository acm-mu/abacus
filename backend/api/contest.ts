import { Router, Response, Request } from 'express';
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

router.post('/contest', async (req: Request, res: Response) => {
  try {
    const result = await contest.save_settings(req)
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})

export default router;
