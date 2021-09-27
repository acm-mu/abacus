import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { postAuth, schema as postSchema } from './postAuth'
import { getAuth } from './getAuth'
import { isAuthenticated } from '../../abacus/authlib'

/**
 * @swagger
 * tags:
 *   name: auth
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       description: JWT Authorization header using the Bearer scheme.
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * security:
 *   - bearerAuth:
 *     -
 */

const auth = Router()

auth.get('/auth', isAuthenticated, getAuth)
auth.post('/auth', checkSchema(postSchema), postAuth)

export default auth
