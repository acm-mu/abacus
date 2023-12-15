import { Request, Response } from 'express'
import contest from '../contest'

/**
 * @swagger
 * /problems/:pid:
 *   get:
 *     summary: Search for problems with provided queries.
 *     description: >-
 *       Returns list of problems that match provided query. Hides problems before competition starts from users.
 *     tags: [Problems]
 *     responses:
 *       200:
 *         description: List of problems matching provided query.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Problem'
 *       400:
 *         description: Bad Request. Provided query does not match request schema.
 *       500:
 *         description: A server error occured while trying to complete request.
 */
export const getProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    res.send(await contest.get_problem(req.params['pid']))
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
