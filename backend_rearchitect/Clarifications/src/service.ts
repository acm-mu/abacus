import { ApiOptions, PagedResult } from "abacus";
import { Clarification, ClarificationModel } from "./models";

class ClarificationService {
  static async getAllClarifications(options?: ApiOptions): Promise<PagedResult<Clarification>> {
    var sortOption: {} | undefined
    if (options?.sortBy) {
      sortOption = { [options?.sortBy]: options.sortDirection == 'ascending' ? 1 : -1 }
    }

    const pageSize = options?.pageSize ?? 25
    const page = options?.page ?? 1
    const skip = (page - 1) * pageSize

    const totalItems = await ClarificationModel.countDocuments({ ...options?.filters })
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      totalItems,
      totalPages,
      items: await ClarificationModel
        .find({ ...options?.filters })
        .sort(sortOption)
        .collation({ locale: 'en_US', numericOrdering: true })
        .skip(skip)
        .limit(pageSize)
    }
  }

  static async getClarificationById(clarificationId: string): Promise<Clarification | null> {
    return ClarificationModel.findById(clarificationId)
  }

  static async createClarification(clarification: Clarification): Promise<Clarification> {
    return ClarificationModel.create(clarification)
  }

  static async updateClarification(clarificationId: string, clarification: Partial<Clarification>): Promise<Clarification | null> {
    return ClarificationModel.findByIdAndUpdate(clarificationId, clarification, { new: true })
  }

  static async deleteClarification(clarificationId: string) {
    return ClarificationModel.findByIdAndDelete(clarificationId)
  }
}

export default ClarificationService