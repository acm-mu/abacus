import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { getStandings, schema as getStandingsSchema } from './getStandings'
/**
 * @swagger
 * tags:
 *   name: Standings
 */

const standings = Router()

standings.get('/standings', checkSchema(getStandingsSchema), getStandings)

//standings.get('/standingsBlueDB', getStandingsBlueDB)

export default standings
