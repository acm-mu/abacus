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
  }
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
    if (!clarifications.length) {
      res.sendStatus(404)
      return
    }

    clarifications?.map((clarification: any) => {
      const user = users[clarification.uid]
      clarification.user = {
        uid: user.uid,
        username: user.username,
        display_name: user.display_name,
        division: user.division
      }
    })

    res.send(transpose(clarifications, 'cid'))
  } catch (err) {
    console.error(err);
    res.sendStatus(500)
  }


}