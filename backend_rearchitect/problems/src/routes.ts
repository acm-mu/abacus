import { Router } from "express"
import ProblemController from "./controller"
import { validationMiddleware } from "./middleware"
import swagger from "./swagger"
import Validation from "./validation"


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
 *         description: A server error occurred while trying to complete request.
 */

api.use(validationMiddleware)

api.get('/problems', Validation.getProblems, ProblemController.getAllProblems)

api.post('/problems', Validation.createProblem, ProblemController.createProblem)

api.get('/problem/:id', ProblemController.getProblemById)

api.put('/problem/:id', Validation.updateProblem, ProblemController.updateProblem)

api.delete('/problem/:id', ProblemController.deleteProblem)

const routes = Router()

routes.use(api, swagger)

export default routes