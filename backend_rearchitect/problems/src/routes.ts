import { RequestHandler, Router } from "express";
import Validation from "./validation";
import ProblemController from "./controller";

/**
 * @swagger
 * tags:
 *   name: Problems
 */
const router = Router()

router.get('/problems', (async (req, res) => {
  await ProblemController.getAllProblems(req, res)
}) as RequestHandler)

router.get('/problems/search', Validation.searchProblems, (async (req, res) => {
  await ProblemController.searchProblems(req, res)
}) as RequestHandler)

router.post('/problems', Validation.createProblem, (async (req, res) => {
  await ProblemController.createProblem(req, res)
}) as RequestHandler)

// router.get('/problem/:problemId', hasRole('admin'), checkSchema(postSchema), ProblemController.getProblemById)
// router.put('/problem/:problemId', hasRole('admin'), checkSchema(putSchema), ProblemController.updateProblem)
// router.delete('/problem/:problemId', hasRole('admin'), checkSchema(deleteSchema), ProblemController.deleteProblem)
// Maybe also a patch


export default router