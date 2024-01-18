import { Router } from "express"
import StandingsController from "./controller"
import { validationMiddleware } from "./middleware"
import swagger from "./swagger"
import Validation from "./validation"

const api = Router()

api.use(validationMiddleware)

api.get('/standings/:division', Validation.base, StandingsController.getStandingsByDivision)

const routes = Router()

routes.use(api, swagger)

export default routes