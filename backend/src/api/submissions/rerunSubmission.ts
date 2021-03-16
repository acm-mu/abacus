import { Converter } from 'aws-sdk/clients/dynamodb';
import { InvocationResponse } from 'aws-sdk/clients/lambda';
import { Request, Response } from 'express';
import { matchedData, ParamSchema, validationResult } from "express-validator"
import contest from '../../contest'

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'sid is invalid'
  }
}

export const rerunSubmission = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const submission = await contest.scanItems('submission', matchedData(req))
  if (submission) {
    contest.lambda.invoke({
      FunctionName: 'PistonRunner',
      Payload: JSON.stringify({
        Records: [{
          eventName: "INSERT",
          dynamodb: {
            NewImage: Converter.marshall(submission[0])
          }
        }]
      })
    }, (err, data: InvocationResponse) => {
      if (err) res.sendStatus(500)
      else if (data.StatusCode == 200) res.send(data.Payload)
    })
  }
}
