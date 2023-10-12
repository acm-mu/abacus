import {Clarification} from 'abacus'
import {BaseRepository} from "./base.repository"

export default class ClarificationRepository extends BaseRepository<Clarification> {
  collection = 'clarification'
}
