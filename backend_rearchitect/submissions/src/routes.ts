import { Router } from "express"
import SubmissionController from "./controller"
import { validationMiddleware } from "./middleware"
import swagger from "./swagger"
import Validation from "./validation"

const api = Router()

api.use(validationMiddleware)

api.get('/submissions', Validation.base, SubmissionController.getAllSubmissions)

api.post('/submissions', SubmissionController.createSubmission)

api.get('/submission/:id', SubmissionController.getSubmissionById)

api.put('/submission/:id', SubmissionController.updateSubmission)

api.delete('/submission/:id', SubmissionController.deleteSubmission)

const routes = Router()

routes.use(api, swagger)

export default routes