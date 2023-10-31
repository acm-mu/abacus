import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'
import { transpose } from '../../utils'

export const schema: Record<string, ParamSchema> = {
  uid: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String uid is invalid'
  },
  display_name: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String display_name is not supplied'
  },
  school: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String school is invalid'
  },
  division: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String division is not supplied'
  },
  password: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String password is not supplied'
  },
  role: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String role is not supplied'
  },
  username: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String username is not supplied'
  }
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Search for users with provided queries.
 *     description: Returns list of users that match provided query.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [""]
 *     parameters:
 *       - name: uid
 *         in: query
 *         schema:
 *           type: string
 *       - name: display_name
 *         in: query
 *         schema:
 *           type: string
 *       - name: school
 *         in: query
 *         schema:
 *           type: string
 *       - name: division
 *         in: query
 *         schema:
 *           type: string
 *       - name: password
 *         in: query
 *         schema:
 *           type: string
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *       - name: username
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users matching provided queries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Could not complete request because request does not match required schema.
 *       401:
 *         description: Could not authenticate user.
 *       500:
 *         description: A server error occurred while trying to complete request.
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const query = matchedData(req)

  //const newPage = page ? page  : null;
  if (req.user?.role == 'team') query.uid = req.user?.uid
  if (req.user?.role == 'judge') {
    query.role = 'team'
    query.division = req.user.division
  }

  try {
    const pageSize = req.query.limit? parseInt(req.query.limit as string) : 25
    
    const options = {
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
      limit: pageSize,
      sortBy: req.query.sortBy as string,
      sortDirection: req.query.sortDirection as string
    }
    
    const userItems = await contest.get_users(query, undefined, options)
    let users = userItems.items
    
    users?.map((user: any) => {
      const { password, ...returnUser } = user

      return returnUser
    })
    
    res.send({
      totalItems: userItems.totalItems,
      totalPages: Math.floor(userItems.totalItems / pageSize),
      items: transpose(users, 'uid')
    })
  } catch (err) {
    res.sendStatus(500)
  }
}
