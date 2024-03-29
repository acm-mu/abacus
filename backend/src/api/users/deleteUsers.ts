import { Request, Response } from 'express'
import { ParamSchema, validationResult } from 'express-validator'
import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  uid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Uid not provided'
  }
}

const deleteSubmissionsForUser = async (tid: string) => {
  try {
    const submissions = await contest.get_submissions({ tid })
    if (!submissions) return
    for (const { sid } of submissions) {
      try {
        contest.delete_submission(sid)
        console.log(`Deleted submission ${sid}`)
      } catch (err) {
        console.log(`Error deleting submission ${sid}`)
      }
    }
  } catch (err) {
    return
  }
}

const deleteClarificationsForUser = async (tid: string) => {
  try {
    const clarifications = await contest.get_clarifications({ uid: tid })
    if (!clarifications) return
    for (const { cid } of clarifications) {
      try {
        contest.delete_clarification(cid)
        console.log(`Deleted clarification ${cid}`)
      } catch (err) {
        console.log(`Error deleting clarification ${cid}`)
      }
    }
  } catch (err) {
    return
  }
}

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Deletes provided users and all clarifications, submissions associated with users.
 *     description: Provided either a list of user ids (uid) or a single uid, deletes them, and all their associated submissions/clarifications.
 *     security:
 *       - bearerAuth: [""]
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully completed request
 *       400:
 *         description: Bad Request. Request body does not match required schema.
 *       500:
 *         description: A server error occurred while trying to delete clarifications.
 */
export const deleteUsers = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  if (req.body.uid instanceof Array) {
    let success = 0
    let failed = 0
    for (const uid of req.body.uid) {
      await deleteSubmissionsForUser(uid)
      await deleteClarificationsForUser(uid)
      try {
        await contest.delete_user(uid)
        success++
      } catch (err) {
        failed++
      }
    }
    res.json({ message: `Successfully deleted ${success} user(s). (${failed} failed)` })
  } else {
    await deleteSubmissionsForUser(req.body.uid)
    await deleteClarificationsForUser(req.body.uid)
    try {
      contest.delete_user(req.body.uid)
      res.json({ message: 'User deleted successfully!' })
    } catch (err) {
      res.sendStatus(500)
    }
  }
}
