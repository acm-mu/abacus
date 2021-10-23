import superagent from 'superagent'
import { Lambda } from '.'
import { Payload } from './lambda'

export default class LocalLambda extends Lambda {
  constructor() {
    super()
  }

  invoke(FunctionName: string, payload: Payload): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (FunctionName !== 'PistonRunner') {
        reject(`LocalLambda does not support'${FunctionName}'`)
      }

      const lambda_spoofer = process.env.USE_DOCKER ? 'lambda-spoofer:6000' : 'http://localhost:6000'
      
      delete payload.tests

      try {
        superagent.post(`${lambda_spoofer}/execute`)
        .send(payload)
        .then(res => resolve(res.body))
        .catch(reject)
      } catch (error) {
        console.log(error)
      }
    })
  }
}
