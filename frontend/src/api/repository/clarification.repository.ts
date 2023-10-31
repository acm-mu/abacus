import type { IClarification, IClarificationReq } from 'abacus'
import { BaseRepository } from "./base.repository"

export default class ClarificationRepository extends BaseRepository<IClarificationReq, IClarification> {
  collection = 'clarifications'
}
