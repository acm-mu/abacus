import { ProblemModel } from "abacus"
import { v4 as uuidv4 } from 'uuid'


class ProblemService {
  static async getAllProblems(): Promise<ProblemModel[]> {
    const problems: ProblemModel[] = [
      { pid: uuidv4(), id: 'A', division: 'blue', name: 'First Problem' },
      { pid: uuidv4(), id: 'B', division: 'blue', name: 'Second Problem' }
    ]

    return problems
  }

  static async getProblemById(problemId: string): Promise<ProblemModel | null> {
    const problem: ProblemModel | undefined =
      [{ pid: uuidv4(), id: 'A', division: 'blue', name: 'First Problem' },
      { pid: uuidv4(), id: 'B', division: 'blue', name: 'Second Problem' }]
        .find(p => p.id == problemId)

    return problem ?? null
  }

  static async searchProblems(): Promise<ProblemModel[]> {
    throw new Error('Search is currently not implemented')
  }

  static async createProblem(_problem: ProblemModel): Promise<ProblemModel> {
    throw new Error('Create problem is currently not implemented')
  }

  static async updateProblem(_problemId: string, _problem: ProblemModel): Promise<ProblemModel | null> {
    throw new Error('Update problem is currently not implemented')
  }

  static async deleteProblem(_problemId: string): Promise<ProblemModel | null> {
    throw new Error('Delete problem is currently not implemented')
  }
}

export default ProblemService