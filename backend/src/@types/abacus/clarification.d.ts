declare module 'abacus' {
  /**
   * @swagger
   * components:
   *   schemas:
   *     NewClarification:
   *       properties:
   *         body:
   *           type: string
   *         parent:
   *           type: string
   *         division:
   *           type: string
   *         title:
   *           type: string
   *         type:
   *           type: string
   *         context:
   *           $ref: '#/components/schemas/Context'
   *       required: [body]
   *     Clarification:
   *       allOf:
   *         - type: object
   *           properties:
   *             cid:
   *               type: string
   *             uid:
   *               type: string
   *             date:
   *               type: string
   *               format: date
   *             open:
   *               type: boolean
   *             children:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Clarification'
   *           required: [cid, body, uid, date]
   *         - $ref: '#/components/schemas/NewClarification'
   */
  export interface Clarification extends Record<string, unknown> {
    cid: string
    body: string
    uid: string
    date: number
    open?: boolean
    parent?: string
    division?: string
    type?: string
    title?: string
    context?: Context
    children?: Clarification[]
  }
}