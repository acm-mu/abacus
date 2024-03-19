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

/**
 * @swagger
 * /scratch:
 *   get:
 *     summary: Returns information about the specified user.
 *     description: This endpoint is a proxy for the Scratch API.
 *     tags: [Scratch]
 *     parameters:
 *       - name: username
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Returns information about the user. (Schema subject to change from scratch api.)
 *       400:
 *         description: The request did not match the required schema.
 */
export const getProject = async (req: Request, res: Response): Promise<void> => {
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
