import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'sid is invalid'
  }
}

/**
 * @swagger
 * /submissions/rerun:
 *   post:
 *     summary: Invoke piston runner to rerun submission
 *     security:
 *       - bearerAuth: [""]
 *     tags: [Submissions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               sid:
 *                 type: string
 *             required: [sid]
 *     responses:
 *       200:
 *         description: Returns payload from piston runner lambda (Subject to change).
 *       400:
 *         description: Could not complete request, request does not match schema.
 *       500:
 *         description: A server error occurred while trying to complete request.
 */
export const rerunSubmission = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const { sid } = matchedData(req)

  try {
    const response = await contest.run_submission(sid)
    res.send(response)
  } catch (error) {
    res.sendStatus(500)
  }
}
