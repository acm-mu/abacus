import { Request, Response } from "express";
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from "../../abacus/contest";
import { v4 as uuidv4 } from 'uuid'
import { Clarification } from "abacus";

export const schema: Record<string, ParamSchema> = {
  body: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'body is not provided!'
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
    notEmpty: true,
    optional: true
  },
  type: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  }
}

export const postClarifications = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  try {
    let { body, parent, division, type, title } = matchedData(req)

    if (!req.user) {
      res.status(400).json({ message: 'User is not valid!' })
      return
    }

    let clarification: Clarification = {
      cid: uuidv4().replace(/-/g, ''),
      date: Date.now() / 1000,
      body,
      uid: req.user.uid
    }

    // Response
    if (parent) {
      console.log('New Reply')
      const clarifications = await contest.scanItems('clarification', { cid: parent })
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

      if (!division || !(['blue', 'gold', 'public'].includes(division))) {
        res.status(400).json({ message: `Division ${division} is not allowed!` })
        return
      }

      if (!title) {
        res.status(400).json({ message: "Clarification missing title!" })
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

    await contest.putItem('clarification', { ...clarification })
    res.send(clarification)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}