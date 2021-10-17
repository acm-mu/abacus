import axios from 'axios'
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

      try {
        axios
          .post(`http://lambda-spoofer:6000/execute`, payload)
          .then((data) => resolve(data.data))
          .catch((err) => reject(err))
      } catch (error) {
        console.log(error)
      }
    })
  }
}
