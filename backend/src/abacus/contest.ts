import { Lambda } from "@aws-sdk/client-lambda";
import { Args, Clarification, Item, Items, Problem, ResolvedSubmission, Settings, Submission, User } from 'abacus'
import type { ApiOptions } from "../api";
import { Database } from '../services'
import { MongoDB } from '../services/db'
import { transpose } from '../utils'

class ContestService {
  db: Database
  lambda: Lambda

  constructor() {
    this.db = new MongoDB()
    this.lambda = new Lambda()
  }

  /* Users */

  async create_user(item: Item) {
    return this.db.put('user', item)
  }

  async get_user(uid: string) {
    return await this.db.get('user', { uid }) as unknown as Promise<User | null>
  }

  async get_users(args?: Args, columns?: string[], options?: ApiOptions) {
    return await this.db.scan('user', { args, columns }, options) as unknown as Promise<Items<User>>
  }

  async update_user(uid: string, item: Item) {
    return this.db.update('user', { uid }, item)
  }

  async delete_user(uid: string): Promise<void> {
    return this.db.delete('user', { uid })
  }

  /* Clarifications */

  async create_clarification(item: Item): Promise<Clarification> {
    return await this.db.put('clarification', item) as unknown as Promise<Clarification>
  }

  async get_clarification(cid: string): Promise<Clarification> {
    return await this.db.get('clarification', { cid }) as unknown as Promise<Clarification>
  }

  async get_clarifications(args?: Args, options?: ApiOptions): Promise<Items<Clarification>> {
    return await this.db.scan('clarification', { args }, options) as unknown as Promise<Items<Clarification>>
  }

  async update_clarification(cid: string, item: Item): Promise<Clarification> {
    return await this.db.update('clarification', { cid }, item) as unknown as Promise<Clarification>
  }

  async delete_clarification(cid: string): Promise<void> {
    return this.db.delete('clarification', { cid })
  }

  /* Submissions */

  async create_submission(item: Item): Promise<Submission> {
    return await this.db.put('submission', item) as unknown as Promise<Submission>
  }

  async get_submission(sid: string): Promise<Submission> {
    return await this.db.get('submission', { sid }) as unknown as Promise<Submission>
  }

  async get_submissions(args: Args, options?: ApiOptions): Promise<Items<Submission>> {
    return await this.db.scan('submission', { args }, options) as unknown as Promise<Items<Submission>>
  }

  async get_resolved_submissions(args: Args, options?: ApiOptions): Promise<Items<ResolvedSubmission>> {
    const user_columns = ['uid', 'username', 'disabled', 'display_name', 'division']
    const users = transpose((await this.get_users({}, user_columns, undefined)).items, 'uid')

    const prob_columns = ['pid', 'division', 'id', 'name', 'max_points', 'capped_points']

    const problems = transpose((await this.get_problems({}, prob_columns, undefined)).items, 'pid')

    const submissions = await this.get_submissions(args, options)

    return {
      items: submissions.items.map(sub => ({
        ...sub,
        problem: problems[sub.pid],
        team: users[sub.tid],
        claimed: sub.claimed ? users[sub.claimed] : undefined,
        flagged: sub.flagged ? users[sub.flagged] : undefined
      })),
      totalItems: submissions.totalItems
    }
  }

  async update_submission(sid: string, item: Item): Promise<Submission> {
    return await this.db.update('submission', { sid }, item) as unknown as Promise<Submission>
  }

  async delete_submission(sid: string): Promise<void> {
    return this.db.delete('submission', { sid })
  }

  /* Problems */

  async create_problem(item: Item) {
    return await this.db.put('problem', item)
  }

  async get_problem(pid: string): Promise<Problem> {
    return await this.db.get('problem', { pid }) as unknown as Promise<Problem>
  }

  async get_problems(args?: Args, columns?: string[], options?: ApiOptions): Promise<Items<Problem>> {
    return await this.db.scan('problem', { args, columns }, options) as unknown as Promise<Items<Problem>>
  }

  async update_problem(pid: string, item: Item) {
    return this.db.update('problem', { pid }, item)
  }

  async delete_problem(pid: string): Promise<void> {
    return this.db.delete('problem', { pid })
  }

  /* Settings */

  async get_settings(): Promise<Settings> {
    return new Promise((resolve, reject) => {
      this.db
        .scan('setting')
        .then((data) => resolve(data.items[0] as Settings))
        .catch((err) => reject(err))
    })
  }

  save_settings(settings: Record<string, number | string>) {
    return this.db.update('setting', {}, settings)
  }
}

export default new ContestService()
