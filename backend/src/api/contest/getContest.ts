import { Response, Request } from 'express'
import contest from '../../abacus/contest'

/**
 * @swagger
 * /contest:
 *   get:
 *     summary: Returns contest settings.
 *     description: Returns competition settings
 *     tags: [contest]
 *     responses:
 *       200:
 *         description: >-
 *           Returns competition settings.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 */
export default async (_: Request, res: Response) => {
  try {
    res.send(await contest.get_settings())
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
