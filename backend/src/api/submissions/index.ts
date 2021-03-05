import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAdminUser, isAuthenticated } from "../../abacus/authlib";
import { deleteSubmissions, schema as deleteSchema } from "./deleteSubmissions";
import { exportSubmissions } from "./exportSubmissions";
import { getSubmissions, schema as getSchema } from "./getSubmissions";
import { postSubmissions, schema as postSchema } from "./postSubmissions";
import { putSubmissions, schema as putSchema } from "./putSubmissions";
import { rerunSubmission, schema as rerunSchema } from "./rerunSubmission";

const submissions = Router()

submissions.get('/submissions', isAuthenticated, checkSchema(getSchema), getSubmissions)
submissions.get('/submissions.json', isAdminUser, exportSubmissions)

submissions.post('/submissions', isAuthenticated, checkSchema(postSchema), postSubmissions)
submissions.put('/submissions', isAdminUser, checkSchema(putSchema), putSubmissions)
submissions.delete('/submissions', isAdminUser, checkSchema(deleteSchema), deleteSubmissions)
submissions.post('/submissions/rerun', isAdminUser, checkSchema(rerunSchema), rerunSubmission)

export default submissions