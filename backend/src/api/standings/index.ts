import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { getStandings, schema as getStandingsSchema } from './getStandings'
/**
 * @swagger
 * tags:
 *   name: standings
 *   description: Some random description
 */

const standings = Router()

standings.get('/standings', checkSchema(getStandingsSchema), getStandings)

export default standings
