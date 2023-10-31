import type { IUser, IUserReq } from "abacus"
import { BaseRepository } from "./base.repository"

export default class UserRepository extends BaseRepository<IUserReq, IUser> {
  collection = 'users'
}