declare module 'abacus' {
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       properties:
   *         uid:
   *           type: string
   *         role:
   *           type: string
   *           enum: [admin, judge, user]
   *         username:
   *           type: string
   *         password:
   *           type: string
   *         display_name:
   *           type: string
   *         division:
   *           type: string
   *         school:
   *           type: string
   *         disabled:
   *           type: boolean
   *       required: [uid, role, username, password, display_name]
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     AuthUser:
   *       properties:
   *         accessToken:
   *           type: string
   *         uid:
   *           type: string
   *         display_name:
   *           type: string
   *         role:
   *           type: string
   *           enum: [user, judge, admin]
   *           example: 'user'
   *         username:
   *           type: string
   */
  export interface User extends Record<string, unknown> {
    uid: string
    role: string
    username: string
    password: string
    display_name: string
    division?: string
    school?: string
    disabled?: boolean
  }
}