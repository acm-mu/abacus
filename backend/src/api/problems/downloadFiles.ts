import { Problem } from 'abacus';
import archiver from 'archiver';
import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from '../../abacus/contest';

const stripFilename = (str: string) => str.replace(/ /g, '_').replace(/[!@#$%^&*\(\)]/g, '');
const fileExtension = (lang: string) => {
  switch (lang) {
    case 'python':
      return 'py';
    default:
      return lang
  }
}

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'query',
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  }
}

export const downloadFiles = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const { pid } = matchedData(req)

  try {
    const problem = await contest.db.get('problem', { pid }) as unknown as Problem
    if (problem.skeletons) {
      const archive = archiver('zip')
      for (const skeleton of problem.skeletons) {
        archive.append(skeleton.source, { name: `${stripFilename(problem.name)}.${fileExtension(skeleton.language)}` })
      }
      res.attachment(`${stripFilename(problem.name)}.zip`)
      archive.pipe(res)
      archive.finalize()
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}