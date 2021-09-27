import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import axios from 'axios'

export const schema: Record<string, ParamSchema> = {
  username: {
    in: ['body', 'query'],
    isString: true,
    errorMessage: 'username not provided!'
  }
}

/**
 * @swagger
 * /scratch/project:
 *   get:
 *     summary: Returns information regarding a project and its author.
 *     description: This endpoint is a proxy for the Scratch API.
 *     tags: [scratch]
 *     parameters:
 *       - name: project_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Returns information about a project. (Schema subject to change from scratch api.)
 *       400:
 *         description: The request did not match the required schema.
 */
export const getUser = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const { username } = matchedData(req)

  try {
    const scratchResponse = await axios.get(`https://api.scratch.mit.edu/users/${username}`)
    res.status(scratchResponse.status).send(scratchResponse.statusText)
  } catch (err) {
    res.sendStatus(400)
  }
}
