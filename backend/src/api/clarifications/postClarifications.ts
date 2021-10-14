import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import contest from '../../abacus/contest'
import { v4 as uuidv4 } from 'uuid'
import { Clarification } from 'abacus'
import { sendNotification } from '../../server'

export const schema: Record<string, ParamSchema> = {
  body: {
    in: 'body',
    isString: true,
    custom: {
      options: (value) => value.trim() !== ''
    },
    notEmpty: true,
    errorMessage: 'Missing body'
  },
  parent: {
    in: 'body',
    optional: true
  },
  division: {
    in: 'body',
    isString: true,
    optional: true
  },
  title: {
    in: 'body',
    isString: true,
    custom: {
      options: (value) => value.trim() !== ''
    },
    notEmpty: true,
    optional: true
  },
  type: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  context: {
    in: 'body',
    isObject: true,
    notEmpty: true,
    optional: true
  }
}

const notify = async (clarification: Clarification) => {
  if (clarification.parent) {
    const res = await contest.get_clarifications({ cid: clarification.parent })
    if (!res) return
    const parent = res[0]

    const to =
      parent.type == 'public' ? (parent.division ? `division:${parent.division}` : 'public') : `uid:${parent.uid}`

    sendNotification({
      to,
      header: 'New Reply',
      content: clarification.body,
      context: {
        type: 'cid',
        id: clarification.parent
      }
    })
  } else {
    const to =
      clarification.type == 'public'
        ? clarification.division
          ? `division:${clarification.division}`
          : 'public'
        : `role:judge&division=${clarification.division}`
    sendNotification({
      to,
      header: clarification.title,
      content: clarification.body,
      context: {
        type: 'cid',
        id: clarification.cid
      }
    })
  }
}

/**
 * @swagger
 * /clarifications:
 *   post:
 *     summary: Create new clarification.
 *     security:
 *       - bearerAuth: [""]
 *     tags: [Clarifications]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewClarification'
 *     responses:
 *       200:
 *         description: Success. Returns new clarification.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clarification'
 *       401:
 *         description: Could not authenticate user.
 *       404:
 *         description: Bad Request. Provided clarification does not match schema.
 */
export const postClarifications = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  try {
    const data = matchedData(req)
    const { body, parent, title, context } = data
    let { division, type } = data

    if (!req.user) {
      res.status(400).json({ message: 'User is not valid!' })
      return
    }

    let clarification: Clarification = {
      cid: uuidv4().replace(/-/g, ''),
      date: Date.now() / 1000,
      body,
      context,
      uid: req.user.uid
    }

    // Response
    if (parent) {
      const clarifications = await contest.get_clarifications({ cid: parent })
      if (!clarifications?.length) {
        res.status(400).json({ message: `Clarification ${parent} does not exist!` })
        return
      }

      clarification = {
        parent,
        ...clarification
      }
    } else {
      // Team's can only post private clarifications
      if (req.user.role == 'team') type = 'private'
      if (req.user.role == 'judge' || req.user.role == 'admin') type = 'public'

      // Team's and Judge's clarifications only apply to themselves
      if (req.user?.role == 'team' || req.user?.role == 'judge') division = req.user.division

      if (!division || !['blue', 'gold', 'public'].includes(division)) {
        res.status(400).json({ message: `Division ${division} is not allowed!` })
        return
      }

      if (!title) {
        res.status(400).json({ message: 'Clarification missing title!' })
        return
      }

      clarification = {
        type,
        title,
        division,
        open: true,
        ...clarification
      }
    }

    await contest.create_clarification(clarification)

    notify(clarification)

    res.send(clarification)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
