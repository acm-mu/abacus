import { Request, Response } from "express";
import { ParamSchema, validationResult } from "express-validator";
import contest from "../../abacus/contest";

export const schema: Record<string, ParamSchema> = {
  cid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'cid is not supplied'
  }
}

export const deleteClarifications = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  if (req.body.cid instanceof Array) {
    let [success, failed] = [0, 0]
    for (const cid of req.body.cid) {
      try {
        await contest.deleteItem('clarification', { cid })
        success++
      } catch (err) {
        console.error(err)
        failed++
      }
    }
    res.json({ message: `Successfully deleted ${success} clarification(s) (${failed} failed).` })
  } else {
    try {
      await contest.deleteItem('clarification', { cid: req.body.cid })
      res.json({ message: "Clarification successfully deleted" })
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }
  }
}