import type { IScratchProject } from "abacus"
import { ApiResponse, HttpClient, transform } from 'api'

export default class ScratchService extends HttpClient {

  async getProject(project_id: string): Promise<ApiResponse<IScratchProject>> {
    const instance = this.createInstance()
    const result = await instance.get(`scratch/project?project_id=${project_id}`).then(transform)
    return result as ApiResponse<IScratchProject>
  }
}