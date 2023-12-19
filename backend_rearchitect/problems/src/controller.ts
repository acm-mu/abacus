import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import ProblemService from './service'
import { Problem } from './models'

class ProblemController {
  static async getAllProblems(req: Request, res: Response): Promise<void> {
    try {
      const { sortBy, sortDirection, page, pageSize, ...filters } = matchedData(req)

      const problems = await ProblemService.getAllProblems({
        sortBy,
        sortDirection,
        page,
        pageSize,
        filters
      })

      res.status(200).json(problems)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getProblemById(req: Request, res: Response): Promise<void> {
    try {
      const problemId = req.params.id
      console.log(problemId)
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

  static async createProblem(req: Request, res: Response): Promise<void> {
    try {
      const createProblem = matchedData(req)
      const newProblem = await ProblemService.createProblem(createProblem as Problem)

      res.status(201).json(newProblem)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async updateProblem(req: Request, res: Response): Promise<void> {
    try {
      const problemId = req.params.id;
      const { _id, ...updateProblem } = matchedData(req)

      const updatedProblem = await ProblemService.updateProblem(problemId, updateProblem)

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