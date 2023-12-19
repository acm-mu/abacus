import { Router } from "express"
import ClarificationController from "./controller"
import { validationMiddleware } from "./middleware"
import swagger from "./swagger"
import Validation from "./validation"

const api = Router()

api.use(validationMiddleware)

api.get('/clarifications', Validation.base, ClarificationController.getAllClarifications)

api.post('/clarifications', ClarificationController.createClarification)

api.get('/clarification/:id', ClarificationController.getClarificationById)

api.put('/clarification/:id', ClarificationController.updateClarification)

api.delete('/clarification/:id', ClarificationController.deleteClarification)

const routes = Router()

routes.use(api, swagger)

export default routes