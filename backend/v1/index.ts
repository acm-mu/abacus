import contest from './contest'
import users from './users'
import submissions from './submissions'
import problems from './problems'
import standings from './standings'
import { Router } from "express";

const api = Router();
api.use(contest, users, submissions, problems, standings)

export default api