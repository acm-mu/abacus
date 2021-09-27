import { createHash } from 'crypto'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'

import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  display_name: {
    in: 'body',
    notEmpty: true,
    isString: true,
    errorMessage: 'String display_name is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    optional: true,
    errorMessage: 'String division is not supplied'
  },
  school: {
    in: 'body',
    isString: true,
    optional: true
  },
  password: {
    in: 'body',
    notEmpty: true,
    isString: true,
    errorMessage: 'String password is not supplied'
  },
  role: {
    in: 'body',
    notEmpty: true,
    isString: true,
    errorMessage: 'String role is not supplied'
  },
  username: {
    in: 'body',
    notEmpty: true,
    isString: true,
    errorMessage: 'String username is not supplied'
  }
}

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user.
 *     description: >-
 *       Creates new user.
 *     tags: [users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *               division:
 *                 type: string
 *               school:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               username:
 *                 type: string
 *             required: [display_name, password, role, username]
 *     security:
 *       - bearerAuth: [""]
 *     responses:
 *       '200':
 *         description: Successfully created new user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad Request. Request body does not match required schema. Judges and teams require division.
 *       '401':
 *         description: Could not authenticate requested user.
 *       '403':
 *         description: Requesting user does not have sufficient permission to complete request.
 *       '500':
 *         description: A server error occured while trying to complete request.
 */
export const postUsers = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)
  item.username = item.username.toLowerCase()
  item.password = createHash('sha256').update(item.password).digest('hex')

  const users = await contest.get_users({ username: item.username })

  if ((item.role == 'team' || item.role == 'judge') && item.division == undefined) {
    res.status(400).json({ message: 'String division is not provided!' })
    return
  }

  if (Object.values(users).length) {
    res.status(400).json({ message: 'Username is taken!' })
    return
  }
  item.uid = uuidv4().replace(/-/g, '')

  try {
    await contest.create_user(item)
    res.send(item)
  } catch (err) {
    res.sendStatus(500)
  }
}
