import { Converter } from 'aws-sdk/clients/dynamodb'
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

  const submission = await contest.get_submissions({ args: matchedData(req) })
  if (submission) {
    contest.lambda.invoke(
      {
        FunctionName: 'PistonRunner',
        Payload: {
          Records: [
            {
              eventName: 'INSERT',
              dynamodb: {
                NewImage: Converter.marshall(submission[0])
              }
            }
          ]
        }
      },
      (err, data) => {
        if (err) res.sendStatus(500)
        else if (data.StatusCode == 200) res.send(data.Payload)
      }
    )
  }
}
