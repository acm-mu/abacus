import { Args, Clarification, Item, Problem, ResolvedSubmission, Settings, Submission, User } from 'abacus'
import { Lambda } from 'aws-sdk'
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

  create_user(item: Item): Promise<User> {
    return this.db.put('user', item) as Promise<User>
  }

  get_user(uid: string): Promise<User> {
    return this.db.get('user', { uid }) as Promise<User>
  }

  get_users(args?: Args, columns?: string[], page?: number): Promise<User[]> {
    return this.db.scan('user', { args, columns }, page) as Promise<User[]>
  }

  update_user(uid: string, item: Item): Promise<User> {
    return this.db.update('user', { uid }, item) as Promise<User>
  }

  delete_user(uid: string): Promise<void> {
    return this.db.delete('user', { uid })
  }
  /* gets the size of a given table */
  get_table_size(table: string, args?: any): Promise<number> {
    return this.db.count(table, { args })
  }

  /* Clarifications */

  create_clarification(item: Item): Promise<Clarification> {
    return this.db.put('clarification', item) as Promise<Clarification>
  }

  get_clarification(cid: string): Promise<Clarification> {
    return this.db.get('clarification', { cid }) as Promise<Clarification>
  }

  get_clarifications(args?: Args, page?: number): Promise<Clarification[]> {
    return this.db.scan('clarification', { args }, page) as Promise<Clarification[]>
  }

  update_clarification(cid: string, item: Item): Promise<Clarification> {
    return this.db.update('clarification', { cid }, item) as Promise<Clarification>
  }

  delete_clarification(cid: string): Promise<void> {
    return this.db.delete('clarification', { cid })
  }

  /* Submissions */

  create_submission(item: Item): Promise<Submission> {
    return this.db.put('submission', item) as Promise<Submission>
  }

  get_submission(sid: string): Promise<Submission> {
    return this.db.get('submission', { sid }) as Promise<Submission>
  }

  get_submissions(args: Args, page?: number): Promise<Submission[]> {
    return this.db.scan('submission', { args }, page) as Promise<Submission[]>
  }

  async get_resolved_submissions(args: Args, page?: number): Promise<ResolvedSubmission[]> {
    const user_columns = ['uid', 'username', 'disabled', 'display_name', 'division']
    const users = transpose(await this.get_users({}, user_columns), 'uid')

    const prob_columns = ['pid', 'division', 'id', 'name', 'max_points', 'capped_points', 'practice']

    const problems = transpose(await this.get_problems({}, prob_columns), 'pid')

    const submissions = await this.get_submissions(args, page)

    return submissions
      ? submissions.map((sub) => {
          return {
            ...sub,
            problem: problems[sub.pid],
            team: users[sub.tid],
            claimed: sub.claimed ? users[sub.claimed] : undefined,
            flagged: sub.flagged ? users[sub.flagged] : undefined
          }
        })
      : []
  }

  update_submission(sid: string, item: Item): Promise<Submission> {
    return this.db.update('submission', { sid }, item) as Promise<Submission>
  }

  delete_submission(sid: string): Promise<void> {
    return this.db.delete('submission', { sid })
  }

  /* Problems */

  create_problem(item: Item): Promise<Problem> {
    return this.db.put('problem', item) as Promise<Problem>
  }

  get_problem(pid: string): Promise<Problem> {
    return this.db.get('problem', { pid }) as Promise<Problem>
  }

  get_problems(args?: Args, columns?: string[], page?: number): Promise<Problem[]> {
    return this.db.scan('problem', { args, columns }, page) as Promise<Problem[]>
  }

  update_problem(pid: string, item: Item): Promise<Problem> {
    return this.db.update('problem', { pid }, item) as Promise<Problem>
  }

  delete_problem(pid: string): Promise<void> {
    return this.db.delete('problem', { pid })
  }

  /* Settings */

  get_settings(): Promise<Settings> {
    return new Promise((resolve, reject) => {
      this.db
        .scan('setting')
        .then((data) => resolve(data[0] as Settings))
        .catch((err) => reject(err))
    })
  }

  save_settings(settings: Record<string, number | string>): Promise<Settings> {
    return this.db.update('setting', {}, settings) as Promise<Settings>
  }
}

export default new ContestService()
