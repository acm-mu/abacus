import { Request, Response } from 'express'
import { contest } from '../../abacus'

/**
 * @swagger
 * /clarifications:
 *   get:
 *     summary: Search for clarifications with provided queries.
 *     description: Returns list of clarifications that match provided query.
 *     security:
 *       - bearerAuth: [""]
 *     tags: [Clarifications]
 *     parameters:
 *       - name: cid
 *         in: query
 *         schema:
 *           type: string
 *       - name: uid
 *         in: query
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *       - name: parent
 *         in: query
 *         schema:
 *           type: string
 *       - name: division
 *         in: query
 *         schema:
 *           type: string
 *       - name: open
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of clarifications matching provided queries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clarification'
 *       401:
 *         description: Could not authenticate user.
 */
export const getClarification = async (req: Request, res: Response): Promise<void> => {
  try {
    let clarification = await contest.get_clarification(req.params.cid)
    const user = await contest.get_user(clarification.uid)

    clarification.user = {
      uid: user?.uid,
      username: user?.username,
      display_name: user?.display_name,
      division: user?.division,
      school: user?.school
    }

    res.send(clarification)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
