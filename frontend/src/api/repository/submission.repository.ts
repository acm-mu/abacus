import type { ISubmission, ISubmissionReq } from 'abacus'
import { ApiResponse, transform } from 'api'
import { BaseRepository } from "./base.repository"

export default class SubmissionRepository extends BaseRepository<ISubmissionReq, ISubmission> {
  collection = 'submission'

  public async rerun(sid: string): Promise<ApiResponse<ISubmission>> {
    const instance = this.createInstance()
    const result = await instance.post(`${this.collection}/rerun`, { sid }).then(transform)
    return result as ApiResponse<ISubmission>
  }
}