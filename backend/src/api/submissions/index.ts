import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAdminUser, isAuthenticated } from "../../service/AuthService";
import { exportSubmissions } from "./exportSubmissions";
import { getSubmissions, schema as getSchema } from "./getSubmissions";

const submissions = Router()

submissions.get('/submissions', checkSchema(getSchema), getSubmissions)
submissions.get('/submissions.json', [isAuthenticated, isAdminUser], exportSubmissions)

export default submissions