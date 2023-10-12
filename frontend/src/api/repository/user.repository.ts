import {BaseRepository} from "./base.repository"
import {User} from "abacus"

export default class UserRepository extends BaseRepository<User> {
  collection = 'user'
}