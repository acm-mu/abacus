import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { io, sendNotification } from '../../server'
import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'sid is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'division is invalid'
  },
  language: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'language is invalid'
  },
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'pid is invalid'
  },
  status: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'status is invalid'
  },
  sub_no: {
    in: 'body',
    isNumeric: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sub_no is invalid'
  },
  tid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'tid is invalid'
  },
  released: {
    in: 'body',
    isBoolean: true,
    optional: true
  },
  released_date: {
    in: 'body',
    isNumeric: true,
    optional: true
  },
  claimed: {
    in: 'body',
    optional: true
  },
  claimed_date: {
    in: 'body',
    isNumeric: true,
    optional: true
  },
  score: {
    in: 'body',
    optional: true
  },
  flagged: {
    in: 'body',
    optional: true
  },
  viewed: {
    in: 'body',
    isBoolean: true,
    optional: true
  },
  feedback: {
    in: 'body',
    optional: true
  }
}

const notifyTeam = async (item: Record<string, unknown>) => {
  const res = await contest.get_submissions({ sid: item.sid })
  if (!res) return

  sendNotification({
    to: `uid:${res[0].tid}`,
    header: 'Feedback!',
    content: 'Your submission has been graded!',
    context: {
      type: 'sid',
      id: item.sid as string
    }
  })
}

/**
 * @swagger
 * /submissions:
 *   put:
 *     summary: Updates an existing submission.
 *     description: Updates a submission (identified by sid, provided in body).
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: [""]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sid:
 *                 type: string
 *               division:
 *                 type: string
 *               language:
 *                 type: string
 *               pid:
 *                 type: string
 *               status:
 *                 type: string
 *               sub_no:
 *                 type: integer
 *               tid:
 *                 type: string
 *               released:
 *                 type: boolean
 *               claimed:
 *                 type: boolean
 *               score:
 *                 type: integer
 *               flagged:
 *                 type: string
 *               viewed:
 *                 type: boolean
 *               feedback:
 *                 type: string
 *             required: [sid]
 *     responses:
 *       200:
 *         description: Returns request body.
 *       400:
 *         description: Request body does not match required schema.
 *       403:
 *         description: Judges cannot update claimed property if already set.
 *       500:
 *         description: A server error occured while trying to complete request.
 */
export const putSubmissions = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const item = matchedData(req)

  //console.log("backend/src/api/submissions/putSubmission.ts:", req)
  //console.log("backend/src/api/submissions/putSubmission.ts: item", item)

  try {
    const submission = await contest.get_submission(item.sid)

    //console.log("backend/src/api/submissions/putSubmission.ts: here")

    if (item.claimed !== undefined && submission.claimed !== undefined) {
      // Trying to change a claimed submission
      if (req.user?.role !== 'admin' && item.claimed !== null) {
        res.status(403).send({ message: 'This submission is already claimed!' })
        return
      }
    }

    //console.log("backend/src/api/submissions/putSubmission.ts: before update submission")
    //console.log("backend/src/api/submissions/putSubmission.ts: item.sid", item.sid)
    //console.log("backend/src/api/submissions/putSubmission.ts: item", item)

    await contest.update_submission(item.sid, item)

    
    //console.log("backend/src/api/submissions/putSubmission.ts: after update submission")

    if (item.released == true) notifyTeam(item)

    io.emit('update_submission', { sid: item.sid })

    res.send(item)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
