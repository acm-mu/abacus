import { Request, Response } from 'express'
import { ParamSchema, validationResult } from 'express-validator'
import { io } from '../../server'
import { contest } from '../../abacus'

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'No sid supplied'
  }
}

/**
 * @swagger
 * /submissions:
*   delete:
*     summary: Deletes provided submissions.
*     description: Provided either a list of submission ids (sid) or a single sid, deletes them.
*     tags: [submissions]
*     security:
*       - bearerAuth: [""]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               sid:
*                 type: array
*                 items:
*                   type: string
*     responses:
*       '200':
*         description: Successfully completed request.
*       '400':
*         description: Bad Request. Request does not match required schema.
*       '500':
*         description: A server error has occurred while trying to complete request.
 */
export const deleteSubmissions = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  if (req.body.sid instanceof Array) {
    let [success, failed] = [0, 0]
    for (const sid of req.body.sid) {
      try {
        await contest.delete_submission(sid)
        success++
        io.emit('delete_submission', { sid })
      } catch (err) {
        console.error(err)
        failed++
      }
    }
    res.json({ message: `Successfully deleted ${success} submission(s) (${failed} failed).` })
  } else {
    try {
      await contest.delete_submission(req.body.sid)

      io.emit('delete_submission', { sid: req.body.sid })

      res.json({ message: 'Submission successfully deleted' })
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }
  }
}
