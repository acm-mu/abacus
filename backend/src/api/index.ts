import { Router } from "express"
import auth from "./auth"
import contest from "./contest"
import problems from "./problems"
import standings from "./standings"
import submissions from "./submissions"
import users from "./users"

const api = Router();

api.use(auth, problems, contest, standings, submissions, users)

export default api