import { Router } from "express"
import Validation from "./validation"
import ProblemController from "./controller"
import { validationMiddleware } from "./middleware"
import swagger from "./swagger"


/**
 * @swagger
 * tags:
 *   name: Problems
 */
const api = Router()

/**
 * @swagger
 * /problems:
 *   get:
 *     summary: Get all problems
 *     description: Returns a list of problems.
 *     tags: [Problems]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema: 
 *           type: string
 *         required: false
 *         description: Field to sort results by.
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum:
 *             - ascending
 *             - descending
 *         required: false
 *         description: The direction to sort by.
 *     responses:
 *       200:
 *         description: List of problems.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Problem'
 *       500:
 *         description: A server error occured while trting to complete request.
 */

api.get('/problems', Validation.getProblems, validationMiddleware, ProblemController.getAllProblems)

api.post('/problems', Validation.createProblem, validationMiddleware, ProblemController.createProblem)

api.get('/problem/:id', ProblemController.getProblemById)

api.put('/problem/:id', Validation.updateProblem, validationMiddleware, ProblemController.updateProblem)

api.delete('/problem/:id', ProblemController.deleteProblem)

const routes = Router()

routes.use(api, swagger)

export default routes