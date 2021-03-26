import { Router } from "express";
import { checkSchema } from "express-validator";
import { getUser, schema as getSchema } from './getUser'

const scratch = Router()

scratch.get('/scratch', checkSchema(getSchema), getUser)

export default scratch