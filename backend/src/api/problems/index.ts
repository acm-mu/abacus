import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAdminUser } from "../../abacus/authlib";
import { deleteProblems, schema as deleteSchema } from "./deleteProblems";
import { downloadFiles, schema as downloadSchema } from "./downloadFiles";
import { getProblems, schema as getSchema } from "./getProblems";
import { postProblems, schema as postSchema } from "./postProblems";
import { putProblems, schema as putSchema } from "./putProblems";

const problems = Router()

problems.get('/problems', checkSchema(getSchema), getProblems)
problems.get('/sample_files', checkSchema(downloadSchema), downloadFiles)

problems.post('/problems', isAdminUser, checkSchema(postSchema), postProblems)
problems.put('/problems', isAdminUser, checkSchema(putSchema), putProblems)
problems.delete('/problems', isAdminUser, checkSchema(deleteSchema), deleteProblems)

export default problems