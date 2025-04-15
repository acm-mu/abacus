import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { io, sendNotification } from '../../server'
import contest from '../../abacus/contest'

// Define the validation schema for the request body
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

// Function to send notification to the team when a submission is graded
export const notifyTeam = async (item: Record<string, unknown>) => {
  // Get the submission using the provided submission ID (sid)
  const res = await contest.get_submissions({ sid: item.sid })
  // If no submission is found, return early
  if (!res) return 

  // Send a notification to the team associated with the submission
  sendNotification({
    to: `uid:${res[0].tid}`, // Send to the team (tid) associated with the submission
    header: 'Feedback!', // Notification header
    content: `Submission ${res[0].sid.substring(0, 7)} has been graded!`, // Notification content
    context: {
      type: 'sid', // Specify the context type as submission ID (sid)
      id: item.sid as string // Attach the submission ID to the notification context
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

// Function to handle PUT request for updating a submission
export const putSubmissions = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors in the request body
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    // If validation fails, return a 400 Bad Request response
    res.status(400).json({ message: errors[0].msg })
    return
  }

  // Extract matched data from the request body
  const item = matchedData(req)

  try {
    // Get the existing submission using the submission ID (sid)
    const submission = await contest.get_submission(item.sid)

    // Set claimed and claimed_date to null to remove those attributes from the submission data entry in the database
    if (item.claimed === '' && submission.claimed !== undefined) {
      item.claimed = null
      item.claimed_date = null
    }
    
    // Update the submission with the new data provided in the request
    await contest.update_submission(item.sid, item)

    // If the submission is released, notify the team
    if (item.released == true) notifyTeam(item)

    // Emit a socket event to notify other services or clients about the updated submission
    io.emit('update_submission', { sid: item.sid })

    // Return the updated submission data in the response
    res.send(item)
  } catch (err) {
    // Handle any errors that occur during the process and send a 500 Internal Server
    console.error(err)
    res.sendStatus(500)
  }
}
