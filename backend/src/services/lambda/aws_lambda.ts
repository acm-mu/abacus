import { Lambda } from '.'
import { Lambda as AWS_Lambda } from 'aws-sdk'
import { Converter } from 'aws-sdk/lib/dynamodb/converter'
import { Payload } from './lambda'

export default class AWSLambda extends Lambda {
  lambda: AWS_Lambda

  constructor() {
    super()
    this.lambda = new AWS_Lambda()
  }

  invoke(FunctionName: string, payload: Payload): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.lambda.invoke(
        {
          FunctionName,
          Payload: {
            Records: [
              {
                eventName: 'INSERT',
                dynamodb: {
                  NewImage: Converter.marshall(payload)
                }
              }
            ]
          }
        },
        (err, data) => {
          if (err) reject(err)
          resolve(data.Payload)
        }
      )
    })
  }
}
