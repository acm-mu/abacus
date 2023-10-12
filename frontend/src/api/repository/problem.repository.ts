import {BaseRepository} from "./base.repository"
import {Problem} from "abacus"

export default class ProblemRepository extends BaseRepository<Problem> {
  collection = 'problem'
}