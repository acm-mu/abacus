declare module 'abacus' {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Test:
   *       properties:
   *         in:
   *           type: string
   *         out:
   *           type: string
   *         result:
   *           type: string
   *       required: [in, out, result]
   */
  export interface TestModel extends Record<string, unknown> {
    in: string
    out: string
    result: string
  }
}