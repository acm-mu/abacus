import archiver from 'archiver'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { fileExtension, stripFilename } from '../../utils'
import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'query',
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  }
}

export const downloadFiles = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const { pid } = matchedData(req)

  try {
    const problem = await contest.get_problem(pid)
    if (problem.skeletons) {
      const archive = archiver('zip')
      for (const skeleton of problem.skeletons) {
        // TODO: LANGUAGE
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
