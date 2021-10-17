export type Payload = Record<string, unknown>

export default abstract class Lambda {
  constructor() {
    if (this.constructor == Lambda) {
      throw new Error('Object of Abstract Class cannot be created')
    }
  }

  abstract invoke(FunctionName: string, payload: Payload): Promise<unknown>
}
