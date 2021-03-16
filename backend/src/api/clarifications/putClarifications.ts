import { Request, Response } from "express";
import { matchedData, ParamSchema, validationResult } from "express-validator";

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  }
}

export const putClarifications = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const data = matchedData(req)
}