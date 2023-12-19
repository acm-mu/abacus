import { Router } from "express"
import UserController from "./controller"
import { validationMiddleware } from "./middleware"
import swagger from "./swagger"
import Validation from "./validation"

const api = Router()

api.use(validationMiddleware)

api.get('/users', Validation.base, UserController.getAllUsers)

api.post('/users', UserController.createUser)

api.get('/user/:id', UserController.getUserById)

api.put('/user/:id', UserController.updateUser)

api.delete('/user/:id', UserController.deleteUser)

const routes = Router()

routes.use(api, swagger)

export default routes