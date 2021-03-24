import { User } from "abacus";
import { Request, Response } from "express";
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest, { transpose } from "../../abacus/contest";

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

const hasAccessTo = ({ type, division, uid }: any, user?: User) => {
  if (type == 'public') {
    if ((user?.role == 'team' || user?.role == 'judge'))
      if ((division !== 'public' && user?.division !== division)) return false
  } else if (type == 'private') {
    if (user?.role == 'team' && user?.uid !== uid)
      return false
  }
  return true
}

export const getClarifications = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const query = matchedData(req)
  const users = transpose(await contest.scanItems('user'), 'uid')


  try {
    let clarifications: any = await contest.scanItems('clarification', query)
    if (clarifications.length == 0) {
      res.sendStatus(404)
      return
    }

    clarifications = clarifications.map((clarification: any) => {
      const user = users[clarification.uid]
      return {
        ...clarification,
        children: [],
        user: {
          uid: user.uid,
          username: user.username,
          display_name: user.display_name,
          division: user.division
        }
      }
    })

    const map = transpose(clarifications.filter((clarification: any) =>
      clarification.parent == undefined && hasAccessTo(clarification, req.user)
    ), 'cid')

    for (const clarification of clarifications)
      if (clarification.parent != undefined)
        if (clarification.parent in map) // inherently has access to
          map[clarification.parent].children.push(clarification)

    res.send(map)
  } catch (err) {
    console.error(err);
    res.sendStatus(500)
  }
}