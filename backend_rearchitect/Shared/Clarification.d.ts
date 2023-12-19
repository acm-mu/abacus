declare module 'abacus' {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Context:
   *       properties:
   *         type:
   *           type: string
   *           enum: [cid, pid, sid]
   *         id:
   *           type: string
   *       required: [type, id]
   */
  export interface ContextType extends Record<string, unknown> {
    type: 'pid' | 'cid' | 'sid'
    cid: string
  }

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
  export interface ClarificationType extends Record<string, unknown> {
    cid: string
    body: string
    uid: string
    date: number
    open?: boolean
    parent?: string
    division?: string
    type?: string
    title?: string
    context?: ContextType
    children?: ClarificationType[]
  }
}