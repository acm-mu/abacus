import { Router } from "express"
import { getStandings } from "./getStandings"

const standings = Router()

standings.get('/standings', getStandings)

export default standings