import { createHash } from 'crypto'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'

export const schema: Record<string, ParamSchema> = {
  uid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: "'uid' is not provided"
  },
  display_name: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  school: {
    in: 'body',
    isString: true,
    optional: true
  },
  password: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  role: {
    in: 'body',
    isString: true,
    optional: true
  },
  username: {
    in: 'body',
    isString: true,
    optional: true
  },
  disabled: {
    in: 'body',
    isBoolean: true,
    optional: true
  }
}

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update exisiting user.
 *     description: Updates user (identified by uid provided in body).
 *     tags: [users]
 *     security:
 *       - bearerAuth: [""]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
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
 *               disabled:
 *                 type: boolean
 *             required: [uid]
 *     responses:
 *       '200':
 *         description: Returns request body.
 *       '400':
 *         description: Request body does not match required schema.
 *       '403':
 *         description: User does not have permission to complete request.
 *       '500':
 *         description: A server error occured while trying to complete request.
 */
export const putUsers = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)
  if (item.username) {
    item.username = item.username.toLowerCase()
  }
  if (item.password) {
    item.password = createHash('sha256').update(item.password).digest('hex')
  }

  if (req.user?.role != 'admin' && (item.username || item.display_name || item.division || item.role || item.school)) {
    res.sendStatus(403)
    return
  }

  try {
    if (item.username) {
      let users = await contest.get_users({ username: item.username })
      users = users.filter((user) => user.uid != item.uid)
      if (users.length > 0) {
        res.status(400).json({ message: 'Username is taken!' })
        return
      }
    }

    await contest.update_user(item.uid, item)
    res.send(item)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
