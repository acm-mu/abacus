import { Request, Response } from 'express'

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Returns associated user object for provided accessToken
 *     description: Provided a valid access token, returns the authenticated user object.
 *     tags: [auth]
 *     security:
 *       - bearerAuth: [""]
 *     responses:
 *       '200':
 *         description: >-
 *           The server was able to authenticate the user. Returns the
 *           authenticated user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Could not authenticate user. The access token is either not provided, or is invalid
 *
 */
export const getAuth = async (req: Request, res: Response) => {
  res.send(req.user)
}
