import { Request, Response } from 'express'
import { ParamSchema, validationResult } from 'express-validator'
import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  }
}

const deleteSubmissionsForProblem = async (pid: string) => {
  try {
    const submissions = (await contest.get_submissions({ pid })) || []
    for (const { sid } of submissions) {
      await contest
        .delete_submission(sid)
        .then((_) => console.log(`Deleted submission ${sid}`))
        .catch((_) => console.log(`Error deleting submission ${sid}`))
    }
  } catch (err) {
    console.error(err)
    console.log(`Error finding submissions to delete for problem ${pid}`)
  }
}

/**
 * @swagger
 * /problems:
 *   delete:
 *     summary: Deletes provided problems and all submissions for problems.
 *     description: Provided either a list of problem ids (pid) or a single pid, deletes them, and all submissions associated with the problems.
 *     tags: [problems]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pid:
 *                 type: array
 *                 items:
 *                   type: string
 *     security:
 *       - bearerAuth: [""]
 *     responses:
 *       200:
 *         description: Success. Provided problems and associate submissions were deleted.
 *       400:
 *         description: Bad Request. Request does not match schema
 *       500:
 *         description: A server error occurred while trying to complete request.
 */
export const deleteProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  if (req.body.pid instanceof Array) {
    let [success, failed] = [0, 0]
    for (const pid of req.body.pid) {
      deleteSubmissionsForProblem(pid)
      try {
        await contest.delete_problem(pid)
        success++
      } catch (err) {
        failed++
      }
    }
    res.json({ message: `Successfully deleted ${success} problem(s) (${failed} failed).` })
  } else {
    deleteSubmissionsForProblem(req.body.pid)
    try {
      await contest.delete_problem(req.body.pid)
      res.json({ message: 'Problem successfully deleted' })
    } catch (err) {
      res.sendStatus(500)
    }
  }
}
