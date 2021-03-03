import { Problem } from 'abacus';
import archiver from 'archiver';
import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import contest from '../../contest';

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
  problem_id: {
    in: 'query',
    notEmpty: true,
    errorMessage: 'problem_id is not supplied'
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
    const problem = await contest.getItem('problem', { pid }) as unknown as Problem
    const archive = archiver('zip')
    for (const skeleton of problem.skeletons)
      archive.append(skeleton.source, { name: `${stripFilename(problem.problem_name)}.${fileExtension(skeleton.language)}` })

    res.attachment(`${stripFilename(problem.problem_name)}.zip`)
    archive.pipe(res)
    archive.finalize()
  } catch (err) { res.sendStatus(500) }
}