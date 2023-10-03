import { Clarification, User } from 'abacus'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'
import { transpose } from '../../utils'

export const schema: Record<string, ParamSchema> = {
  cid: {
    in: ['body', 'query'],
    isString: true,
    notEmpty: true,
    optional: true
  },
  uid: {
    in: ['body', 'query'],
    isString: true,
    notEmpty: true,
    optional: true
  },
  type: {
    in: ['body', 'query'],
    isString: true,
    notEmpty: true,
    optional: true
  },
  parent: {
    in: ['body', 'query'],
    isString: true,
    notEmpty: true,
    optional: true
  },
  division: {
    in: ['body', 'query'],
    isString: true,
    notEmpty: true,
    optional: true
  },
  open: {
    in: ['body', 'query'],
    isBoolean: true,
    notEmpty: true,
    optional: true
  }
}

const filterQuery = (clarification: Clarification, query: { [key: string]: string | boolean }) => {
  if (query.cid && clarification.cid !== query.cid) return false
  if (query.uid && clarification.uid !== query.uid) return false
  if (query.type && clarification.type !== query.type) return false
  if (query.parent && clarification.parent != query.parent) return false
  if (query.division && clarification.division != query.division) return false
  if (query.open && clarification.open != query.open) return false
  return true
}

const hasAccessTo = ({ type, division, uid }: Clarification, user?: User) => {
  if (type == 'public') {
    if (user?.role == 'team' || user?.role == 'judge')
      if (division !== 'public' && user?.division !== division) return false
  } else if (type == 'private') {
    if (user?.role == 'team' && user?.uid !== uid) return false
  }
  return true
}

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
export const getClarifications = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page
  //page comes in as string due to being a query
  const newPage = page ? parseInt(page as string) : 0
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const query = matchedData(req)
  const users = transpose(await contest.get_users(), 'uid') as Record<string, User>

  try {
    let clarifications = await contest.get_clarifications({}, newPage)
    if (clarifications.length == 0) {
      res.sendStatus(404)
      return
    }

    clarifications = clarifications.map((clarification) => {
      const user = users[clarification.uid]
      return {
        ...clarification,
        children: [],
        user: {
          uid: user?.uid,
          username: user?.username,
          display_name: user?.display_name,
          division: user?.division,
          school: user?.school
        }
      }
    })

    const map = transpose(
      clarifications.filter(
        (clarification) =>
          clarification.parent == undefined && hasAccessTo(clarification, req.user) && filterQuery(clarification, query)
      ),
      'cid'
    ) as Record<string, Clarification>

    for (const clarification of clarifications)
      if (clarification.parent !== undefined && clarification.parent in map)
        map[clarification.parent].children?.push(clarification)

    res.send(map)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
