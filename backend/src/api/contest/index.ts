import { Router } from "express"
import { checkSchema } from "express-validator"
import { hasRole } from "../../abacus/authlib"
import getContest from "./getContest"
import { putContest, schema } from "./putContest"

/**
 * @swagger
 * tags:
 *   name: contest
 *   description: Some random description
 */

const contest = Router()

contest.get('/contest', getContest)
contest.put('/contest', hasRole('admin'), checkSchema(schema), putContest)

export default contest

