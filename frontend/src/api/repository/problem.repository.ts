import type { IProblem } from "abacus"
import { BaseRepository } from "./base.repository"

export default class ProblemRepository extends BaseRepository<IProblem, IProblem> {
  collection = 'problems'
}