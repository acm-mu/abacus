import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { getProject, schema as getProjectSchema } from './getProject'
import { getUser, schema as getUserSchema } from './getUser'

/**
 * @swagger
 * tags:
 *   name: scratch
 *   description: Some random description
 *   externalDocs:
 *     description: Scratch API
 *     url: https://en.scratch-wiki.info/wiki/Scratch_API
 */

const scratch = Router()

scratch.get('/scratch', checkSchema(getUserSchema), getUser)
scratch.get('/scratch/project', checkSchema(getProjectSchema), getProject)

export default scratch
