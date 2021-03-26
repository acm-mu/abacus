import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator";
import axios from 'axios'

export const schema: Record<string, ParamSchema> = {
  username: {
    in: ['body', 'query'],
    isString: true,
    errorMessage: 'username not provided!'
  },
}

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
  } catch (err) { res.sendStatus(400) }
}