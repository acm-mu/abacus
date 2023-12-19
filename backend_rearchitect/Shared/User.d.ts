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
declare module 'abacus' {
  export interface UserType extends Record<string, unknown> {
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