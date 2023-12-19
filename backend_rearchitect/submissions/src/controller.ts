import { Request, Response } from "express"
import { matchedData } from "express-validator"
import SubmissionService from "./service"
import { Submission } from "./models"

class SubmissionController {
  static async getAllSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const { sortBy, sortDirection, page, pageSize, ...filters } = matchedData(req)

      const submissions = await SubmissionService.getAllSubmissions({
        sortBy,
        sortDirection,
        page,
        pageSize,
        filters
      })

      res.status(200).json(submissions)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getSubmissionById(req: Request, res: Response): Promise<void> {
    try {
      const submissionId = req.params.id

      const submission = await SubmissionService.getSubmissionById(submissionId)

      if (submission) {
        res.status(200).json(submission)
      } else {
        res.status(404).json({ error: "Submission not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async createSubmission(req: Request, res: Response): Promise<void> {
    try {
      const createSubmission = matchedData(req)
      const newSubmission = await SubmissionService.createSubmission(createSubmission as Submission)

      res.status(201).json(newSubmission)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async updateSubmission(req: Request, res: Response): Promise<void> {
    try {
      const submissionId = req.params.id
      const { _id, ...updateSubmission } = matchedData(req)

      const updatedSubmission = await SubmissionService.updateSubmission(submissionId, updateSubmission)

      if (updatedSubmission) {
        res.status(200).json(updatedSubmission)
      } else {
        res.status(404).json({ error: "Submission not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async deleteSubmission(req: Request, res: Response): Promise<void> {
    try {
      const submissionId = req.params.id
      const deletedSubmission = await SubmissionService.deleteSubmission(submissionId)

      if (deletedSubmission) {
        res.status(200).json({ message: "Submission deleted successfully" })
      } else {
        res.status(404).json({ error: "Submission not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

export default SubmissionController