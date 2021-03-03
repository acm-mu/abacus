import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAdminUser, isAuthenticated } from "../../service/AuthService";
import { deleteProblems, schema as deleteSchema } from "./deleteProblems";
import { downloadFiles, schema as downloadSchema } from "./downloadFiles";
import { exportProblems } from "./exportProblems";
import { getProblems, schema as getSchema } from "./getProblems";
import { postProblems, schema as postSchema } from "./postProblems";
import { putProblems, schema as putSchema } from "./putProblems";

const problems = Router()

problems.get('/problems', checkSchema(getSchema), getProblems)
problems.post('/problems', [isAuthenticated, isAdminUser], checkSchema(postSchema), postProblems)
problems.put('/problems', [isAuthenticated, isAdminUser], checkSchema(putSchema), putProblems)
problems.delete('/problems', [isAuthenticated, isAdminUser], checkSchema(deleteSchema), deleteProblems)
problems.get('/sample_files.json', isAuthenticated, checkSchema(downloadSchema), downloadFiles)
problems.get('/problems.json', isAuthenticated, exportProblems)

export default problems