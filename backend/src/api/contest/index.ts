import { Router } from "express"
import { checkSchema } from "express-validator"
import { isAdminUser } from "authlib"
import getContest from "./getContest"
import { putContest, schema } from "./putContest"

const contest = Router()

contest.get('/contest', getContest)
contest.put('/contest', isAdminUser, checkSchema(schema), putContest)

export default contest

