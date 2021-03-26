import { Router } from "express"
import auth from "./auth"
import contest from "./contest"
import problems from "./problems"
import scratch from "./scratch"
import standings from "./standings"
import submissions from "./submissions"
import users from "./users"

const api = Router();

api.use(auth, problems, contest, standings, submissions, users, scratch)

export default api