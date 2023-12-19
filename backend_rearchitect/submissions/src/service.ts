import { ApiOptions, PagedResult } from "abacus"
import { Submission, SubmissionModel } from "./models"

class SubmissionService {
  static async getAllSubmissions(options?: ApiOptions): Promise<PagedResult<Submission>> {
    let sortOption: {} | undefined
    if (options?.sortBy) {
      sortOption = { [options?.sortBy]: options.sortDirection == 'ascending' ? 1 : -1 }
    }

    const pageSize = options?.pageSize ?? 25
    const page = options?.page ?? 1
    const skip = (page - 1) * pageSize

    const totalItems = await SubmissionModel.countDocuments({ ...options?.filters })
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      totalItems,
      totalPages,
      items: await SubmissionModel
        .find({ ...options?.filters })
        .sort(sortOption)
        .collation({ locale: 'en_US', numericOrdering: true })
        .skip(skip)
        .limit(pageSize)
    }
  }

  static async getSubmissionById(submissionId: string): Promise<Submission | null> {
    return SubmissionModel.findById(submissionId)
  }

  static async createSubmission(submission: Submission): Promise<Submission> {
    return SubmissionModel.create(submission)
  }

  static async updateSubmission(submissionId: string, submission: Partial<Submission>): Promise<Submission | null> {
    return SubmissionModel.findByIdAndUpdate(submissionId, submission, { new: true })
  }

  static async deleteSubmission(submissionId: string) {
    return SubmissionModel.findByIdAndDelete(submissionId)
  }
}

export default SubmissionService