import { Router } from "express";
import { checkSchema } from "express-validator";
import { isAdminUser, isAuthenticated } from "../../service/AuthService";
import { getUsers, schema as getSchema } from "./getUsers";
import { putUsers, schema as putSchema } from "./putUsers";
import { deleteUsers, schema as deleteSchema } from "./deleteUsers"
import { exportUsers } from "./exportUsers";

const users = Router()

users.get('/users', checkSchema(getSchema), getUsers)
users.put('/users', [isAuthenticated, isAdminUser], checkSchema(putSchema), putUsers)
users.delete('/users', [isAuthenticated, isAdminUser], checkSchema(deleteSchema), deleteUsers)
users.get('/users.json', [isAuthenticated, isAdminUser], exportUsers)

export default users