import { Request, Response } from 'express';

/**
 * @swagger
 * /auth:
 *   get:
 *     description: This should return the authenticated user.
 *     tags: [auth]
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth:
 *         - 
 *     responses:
 *       200:
 *         description: Authenticated user
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/User'
 */
export const getAuth = async (req: Request, res: Response) => {
  console.log('Hi There')
  res.send(req.user)
}