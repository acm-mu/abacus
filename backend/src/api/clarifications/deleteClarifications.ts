import { Request, Response } from 'express'
import { ParamSchema, validationResult } from 'express-validator'
import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  cid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'cid is not supplied'
  }
}
/**
 * @swagger
 * /clarifications:
 *   delete:
 *     summary: Deletes provided clarifications and all child clarifications.
 *     description: Provided either a list of clarification ids (cid) or a single cid, deletes them, and all their children.
 *     security:
 *       - bearerAuth: [""]
 *     tags: [Clarifications]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cid:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully completed request
 *       500:
 *         description: A server error occurred while trying to delete clarifications.
 */

export const deleteClarifications = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const clarifications = await contest.get_clarifications()

  if (req.body.cid instanceof Array) {
    let [success, failed] = [0, 0]
    for (const cid of req.body.cid) {
      try {
        await contest.delete_clarification(cid)
        for (const clarification of clarifications)
          if (clarification.parent && clarification.parent == cid)
            await contest.delete_clarification(clarification.parent)

        success++
      } catch (err) {
        console.error(err)
        failed++
      }
    }
    res.json({ message: `Successfully deleted ${success} clarification(s) (${failed} failed).` })
  } else {
    try {
      await contest.delete_clarification(req.body.cid)
      for (const clarification of clarifications)
        if (clarification.parent == req.body.cid) await contest.delete_clarification(clarification.cid)
      res.json({ message: 'Clarification successfully deleted' })
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }
  }
}
