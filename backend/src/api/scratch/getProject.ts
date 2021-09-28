import axios from 'axios'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'

export const schema: Record<string, ParamSchema> = {
  project_id: {
    in: ['body', 'query'],
    isString: true,
    errorMessage: 'project_id not provided!'
  }
}

export const getProject = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const { project_id } = matchedData(req)

  try {
    const scratchResponse = await axios.get(`https://api.scratch.mit.edu/projects/${project_id}`)
    res.send(scratchResponse.data)
  } catch (err) {
    res.sendStatus(400)
  }
}
