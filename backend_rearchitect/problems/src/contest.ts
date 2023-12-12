class ContestService {
async create_problem(item: any): Promise<any> {
    console.log("Creating problem from temp service")
  }

  async get_problem(pid: string): Promise<any> {
    console.log("Getting problem from temp service")
  }

  async get_problems(args?: any, columns?: string[], page?: number): Promise<any> {
    console.log("Getting multiple problems from temp service")
  }

  async update_problem(pid: string, item: any): Promise<any> {
    console.log("Updating problem from temp service")
  }

  async delete_problem(pid: string): Promise<void> {
    console.log("Deleting problem from temp service")
  }
}

export default new ContestService
