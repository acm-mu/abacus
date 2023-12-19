import { Router } from "express";
import swagger from "./swagger";
import { validationMiddleware } from "./middleware";
import ClarificationController from "./controller";

const api = Router()

api.use(validationMiddleware)

api.get('/clarifications', ClarificationController.getAllClarifications)

api.post('/clarifications', ClarificationController.createClarification)

api.get('/clarification/:id', ClarificationController.getClarificationById)

api.put('/clarification/:id', ClarificationController.updateClarification)

api.delete('/clarification/:id', ClarificationController.deleteClarification)

const routes = Router()

routes.use(api, swagger)

export default routes