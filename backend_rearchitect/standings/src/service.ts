import { ApiOptions, PagedResult } from "abacus"
import { User, UserModel } from "./models"

class StandingsService {
  static async getStandingsByDivision(division, options?: ApiOptions): Promise<PagedResult<Standing>> {
    
  }


  static async getAllUsers(options?: ApiOptions): Promise<PagedResult<User>> {
    let sortOption: {} | undefined
    if (options?.sortBy) {
      sortOption = { [options?.sortBy]: options.sortDirection == 'ascending' ? 1 : -1 }
    }

    const pageSize = options?.pageSize ?? 25
    const page = options?.page ?? 1
    const skip = (page - 1) * pageSize

    const totalItems = await UserModel.countDocuments({ ...options?.filters })
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      totalItems,
      totalPages,
      items: await UserModel
        .find({ ...options?.filters })
        .sort(sortOption)
        .collation({ locale: 'en_US', numericOrdering: true })
        .skip(skip)
        .limit(pageSize)
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    return UserModel.findById(userId)
  }

  static async createUser(user: User): Promise<User> {
    return UserModel.create(user)
  }

  static async updateUser(userId: string, user: Partial<User>): Promise<User | null> {
    return UserModel.findByIdAndUpdate(userId, user, { new: true })
  }

  static async deleteUser(userId: string) {
    return UserModel.findByIdAndDelete(userId)
  }
}

export default StandingsService