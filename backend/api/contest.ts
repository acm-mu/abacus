import { Router } from "express";
import contest from "../contest";

const router = Router();

router.get("/", async (_req, res: any) => {
  res.send(await contest.get_settings())
});

export default router;
