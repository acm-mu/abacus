import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { hasRole, isAuthenticated } from '../../abacus/authlib'
import { deleteClarifications, schema as deleteSchema } from './deleteClarifications'
import { getClarifications, schema as getSchema } from './getClarifications'
import { postClarifications, schema as postSchema } from './postClarifications'
import { putClarifications, schema as putSchema } from './putClarifications'
/**
 * @swagger
 * tags:
 *   name: Clarifications
 */

const clarifications = Router()

clarifications.get('/clarifications', isAuthenticated, checkSchema(getSchema), getClarifications)
clarifications.post('/clarifications', isAuthenticated, checkSchema(postSchema), postClarifications)
clarifications.put('/clarifications', hasRole('judge'), checkSchema(putSchema), putClarifications)
clarifications.delete('/clarifications', hasRole('admin'), checkSchema(deleteSchema), deleteClarifications)

export default clarifications
