import { Request, Response } from "express";
import UserService from "./service";
import { User } from "./models";
import { matchedData } from "express-validator";

class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { sortBy, sortDirection, page, pageSize, ...filters } = matchedData(req)

      const users = await UserService.getAllUsers({
        sortBy,
        sortDirection,
        page,
        pageSize,
        filters
      })

      res.status(200).json(users)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id
      const user = await UserService.getUserById(userId)

      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ error: "User not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUser = matchedData(req)
      const newUser = await UserService.createUser(createUser as User)

      res.status(201).json(newUser)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id
      const { _id, ...updateUser } = matchedData(req)

      const updatedUser = await UserService.updateUser(userId, updateUser)

      if (updatedUser) {
        res.status(200).json(updatedUser)
      } else {
        res.status(404).json({ error: "User not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id
      const deletedUser = await UserService.deleteUser(userId)

      if (deletedUser) {
        res.status(200).json({ message: "User deleted successfully" })
      } else {
        res.status(404).json({ error: "User not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

export default UserController