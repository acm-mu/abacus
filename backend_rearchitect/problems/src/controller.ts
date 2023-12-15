import { Request, Response } from 'express'
import ProblemService from './service'
import { matchedData, validationResult } from 'express-validator'
import { ProblemModel } from 'abacus'

class ProblemController {
  static async getAllProblems(_req: Request, res: Response): Promise<void> {
    try {
      const users = await ProblemService.getAllProblems()
      res.status(200).json(users)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getProblemById(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const problemId = req.params.id
      const problem = await ProblemService.getProblemById(problemId)

      if (problem) {
        res.status(200).json(problem)
      } else {
        res.status(404).json({ error: "Problem not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async searchProblems(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const problems = await ProblemService.searchProblems()
      res.status(200).json(problems)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async createProblem(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const createProblem = matchedData(req)
      const newProblem = await ProblemService.createProblem(createProblem as ProblemModel)

      res.status(201).json(newProblem)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async updateProblem(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const problemId = req.params.id;
      const updateProblem = matchedData(req)
      const updatedProblem = await ProblemService.updateProblem(problemId, updateProblem as ProblemModel)

      if (updatedProblem) {
        res.status(200).json(updatedProblem)
      } else {
        res.status(404).json({ error: "Problem not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async deleteProblem(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const problemId = req.params.id
      const deletedProblem = await ProblemService.deleteProblem(problemId)

      if (deletedProblem) {
        res.status(200).json({ message: "Problem deleted successfully" })
      } else {
        res.status(404).json({ error: "Problem not found" })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

export default ProblemController