import { Response, Request } from 'express';
import contest from "../../abacus/contest"

/**
 * @swagger
 * /contest:
 *   get:
 *     description: Returns competition settings
 *     tags: ['contest']
 *     responses:
 *       200:
 *         description: response
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Settings'
 */
export default async (_: Request, res: Response) => {
  try {
    res.send(await contest.get_settings())
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}