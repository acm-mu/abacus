declare module 'abacus' {
  export interface TestType extends Record<string, unknown> {
    in: string
    out: string
    result: string
  }
}