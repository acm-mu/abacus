import { Router } from "express"
import { checkSchema } from "express-validator"
import { isAuthenticated, isAdminUser } from "../../service/AuthService"
import getContest from "./getContest"
import { putContest, schema } from "./putContest"

const contest = Router()

contest.get('/contest', getContest)
contest.put(
  '/contest',
  [isAuthenticated, isAdminUser],
  checkSchema(schema),
  putContest)

export default contest

