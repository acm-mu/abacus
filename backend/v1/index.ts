import contest from './contest'
import users from './users'
import submissions from './submissions'
import problems from './problems'
import standings from './standings'
import { Router } from "express";

const api = Router();

api.use('/contest', contest)
api.use('/users/', users)
api.use('/submissions', submissions)
api.use('/problems', problems)
api.use('/standings', standings)

export default api