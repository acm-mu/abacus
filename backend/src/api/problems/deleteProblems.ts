import { Request, Response } from 'express';
import { ParamSchema, validationResult } from "express-validator";
import contest from '../../contest';

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'problem_id is not supplied'
  }
}

const deleteSubmissionsForProblem = async (pid: string) => {
  try {
    const submissions = await contest.scanItems('submission', { pid }) || []
    for (const { sid } of submissions) {
      await contest.deleteItem('submission', { sid })
        .then(_ => console.log(`Deleted submission ${sid}`))
        .catch(_ => console.log(`Error deleting submission ${sid}`))
    }
  } catch (err) {
    console.log(`Error finding submissions to delete for problem ${pid}`)
  }
}

export const deleteProblems = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  if (req.body.pid instanceof Array) {
    let [success, failed] = [0, 0]
    for (const pid of req.body.pid) {
      deleteSubmissionsForProblem(pid)
      try {
        await contest.deleteItem('problem', { pid })
        success++
      } catch (err) { failed++ }
    }
    res.json({ message: `Successfully deleted ${success} problem(s) (${failed} failed).` })
  } else {
    deleteSubmissionsForProblem(req.body.pid)
    try {
      await contest.deleteItem('problem', { problem_id: req.body.problem_id })
      res.json({ message: "Problem successfully deleted" })
    } catch (err) { res.sendStatus(500) }
  }
}
