import { ApiOptions, PagedResult } from 'abacus'
import { ProblemModel, Problem } from './models'


class ProblemService {
  static async getAllProblems(options?: ApiOptions): Promise<PagedResult<Problem>> {
    var sortOption: {} | undefined;
    if (options?.sortBy) {
      sortOption = { [options?.sortBy]: options.sortDirection == 'ascending' ? 1 : -1 }
    }

    const pageSize = options?.pageSize ?? 25
    const page = options?.page ?? 1
    const skip = (page - 1) * pageSize

    const totalItems = await ProblemModel.countDocuments({ ...options?.filters })
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      totalItems,
      totalPages,
      items: await ProblemModel.find({ ...options?.filters }).sort(sortOption).skip(skip).limit(pageSize)
    }
  }

  static async getProblemById(problemId: string): Promise<Problem | null> {
    return ProblemModel.findById(problemId)
  }

  static async createProblem(problem: Problem): Promise<Problem> {
    return ProblemModel.create(problem)
  }

  static async updateProblem(problemId: string, problem: Partial<Problem>): Promise<Problem | null> {
    console.log("Updating...")
    console.log(problemId)
    console.log(problem)
    return ProblemModel.findByIdAndUpdate(problemId, problem, { new: true })
  }

  static async deleteProblem(problemId: string) {
    return ProblemModel.findByIdAndDelete(problemId)
  }
}

export default ProblemService