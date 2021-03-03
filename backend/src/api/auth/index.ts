import { Router } from "express"
import { checkSchema } from "express-validator"
import { postAuth, schema } from "./postAuth"

const auth = Router()

auth.post('/auth', checkSchema(schema), postAuth)

export default auth