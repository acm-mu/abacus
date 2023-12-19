import { Router } from "express";
import swagger from "./swagger";
import { validationMiddleware } from "./middleware";
import UserController from "./controller";

const api = Router()

api.use(validationMiddleware)

api.get('/users', UserController.getAllUsers)

api.post('/users', UserController.createUser)

api.get('/user/:id', UserController.getUserById)

api.put('/user/:id', UserController.updateUser)

api.delete('/user/:id', UserController.deleteUser)

const routes = Router()

routes.use(api, swagger)

export default routes