import { Request, Response } from 'express'
import { ParamSchema, validationResult } from "express-validator";
import contest from '../../contest';

export const schema: Record<string, ParamSchema> = {
  uid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Uid not provided'
  }
}

const deleteSubmissionsForUser = async (tid: string) => {
  try {
    const submissions = await contest.scanItems('submission', { tid })
    if (!submissions) return
    for (const { sid } of submissions) {
      try {
        contest.deleteItem('submission', { sid })
        console.log(`Deleted submission ${sid}`)
      } catch (err) { console.log(`Error deleting submission ${sid}`) }
    }
  } catch (err) { return }
}

export const deleteUsers = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  if (req.body.uid instanceof Array) {
    let success = 0
    let failed = 0
    for (const uid of req.body.uid) {
      await deleteSubmissionsForUser(uid)
      try {
        await contest.deleteItem('user', { uid })
        success++
      } catch (err) { failed++ }
    }
    res.json({ message: `Successfully deleted ${success} user(s). (${failed} failed)` })
  } else {
    await deleteSubmissionsForUser(req.body.uid)
    try {
      contest.deleteItem('user', { uid: req.body.uid })
      res.json({ message: "User deleted successfully!" })
    } catch (err) { res.sendStatus(500) }
  }
}
