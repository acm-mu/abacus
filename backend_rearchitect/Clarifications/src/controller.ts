import { Request, Response } from "express"
import { matchedData } from "express-validator"
import { Clarification } from "./models"
import ClarificationService from "./service"

class ClarificationController {
  static async getAllClarifications(req: Request, res: Response): Promise<void> {
    try {
      const { sortBy, sortDirection, page, pageSize, ...filters } = matchedData(req)

      const clarifications = await ClarificationService.getAllClarifications({
        sortBy,
        sortDirection,
        page,
        pageSize,
        filters
      })

      res.status(200).json(clarifications)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getClarificationById(req: Request, res: Response): Promise<void> {
    try {
      const clarificationId = req.params.id
      const clarification = await ClarificationService.getClarificationById(clarificationId)

      if (clarification) {
        res.status(200).json(clarification)
      } else {
        res.status(404).json({ error: "Clarification not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async createClarification(req: Request, res: Response): Promise<void> {
    try {
      const createClarification = matchedData(req)
      const newClarification = await ClarificationService.createClarification(createClarification as Clarification)

      res.status(201).json(newClarification)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async updateClarification(req: Request, res: Response): Promise<void> {
    try {
      const clarificationId = req.params.id
      const { _id, ...updateClarification } = matchedData(req)

      const updatedClarification = await ClarificationService.updateClarification(clarificationId, updateClarification)

      if (updatedClarification) {
        res.status(200).json(updatedClarification)
      } else {
        res.status(404).json({ error: "Clarification not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async deleteClarification(req: Request, res: Response): Promise<void> {
    try {
      const clarificationId = req.params.id
      const deletedClarification = await ClarificationService.deleteClarification(clarificationId)

      if (deletedClarification) {
        res.status(200).json({ message: "Clarification deleted successfully" })
      } else {
        res.status(404).json({ message: "Clarification not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

export default ClarificationController