import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { getProject, schema as getProjectSchema } from './getProject'
import { getUser, schema as getUserSchema } from './getUser'

const scratch = Router()

scratch.get('/scratch', checkSchema(getUserSchema), getUser)
scratch.get('/scratch/project', checkSchema(getProjectSchema), getProject)

export default scratch
