import { Args, Clarification, Item, Problem, ResolvedSubmission, Settings, Submission, User } from 'abacus'
import { Lambda } from 'aws-sdk'
import { transpose } from '../utils'
import { Database } from '../services'
import { MongoDB } from '../services/db'

class ContestService {
  db: Database
  lambda: Lambda

  constructor() {
    this.db = new MongoDB()
    this.lambda = new Lambda()
  }

  /* Users */

  async create_user(item: Item): Promise<User> {
    return this.db.put('user', item) as Promise<User>
  }

  async get_user(uid: string): Promise<User> {
    return this.db.get('user', { uid }) as Promise<User>
  }

  async get_users(args?: Args, columns?: string[]): Promise<User[]> {
    return this.db.scan('user', { args, columns }) as Promise<User[]>
  }

  async update_user(uid: string, item: Item): Promise<User> {
    return this.db.update('user', { uid }, item) as Promise<User>
  }

  async delete_user(uid: string): Promise<void> {
    return this.db.delete('user', { uid })
  }

  /* Clarifications */

  async create_clarification(item: Item): Promise<Clarification> {
    return this.db.put('clarification', item) as Promise<Clarification>
  }

  async get_clarification(cid: string): Promise<Clarification> {
    return this.db.get('clarification', { cid }) as Promise<Clarification>
  }

  async get_clarifications(args?: Args): Promise<Clarification[]> {
    return this.db.scan('clarification', { args }) as Promise<Clarification[]>
  }

  async update_clarification(cid: string, item: Item): Promise<Clarification> {
    return this.db.update('clarification', { cid }, item) as Promise<Clarification>
  }

  async delete_clarification(cid: string): Promise<void> {
    return this.db.delete('clarification', { cid })
  }

  /* Submissions */

  async create_submission(item: Item): Promise<Submission> {
    return this.db.put('submission', item) as Promise<Submission>
  }

  async get_submission(sid: string): Promise<Submission> {
    return this.db.get('submission', { sid }) as Promise<Submission>
  }

  async get_submissions(args: Args): Promise<Submission[]> {
    return this.db.scan('submission', { args }) as Promise<Submission[]>
  }

  async get_resolved_submissions(args: Args): Promise<ResolvedSubmission[]> {
    const user_columns = ['uid', 'username', 'disabled', 'display_name', 'division']
    const users = transpose(await this.get_users({}, user_columns), 'uid')

    const prob_columns = ['pid', 'division', 'id', 'name', 'max_points', 'capped_points', 'practice']
    const problems = transpose(await this.get_problems({}, prob_columns), 'pid')

    const submissions = await this.get_submissions(args)

    return submissions.map((sub) => {
      return {
        ...sub,
        problem: problems[sub.pid],
        team: users[sub.tid],
        claimed: sub.claimed ? users[sub.claimed] : undefined,
        flagged: sub.flagged ? users[sub.flagged] : undefined
      }
    })
  }

  async update_submission(sid: string, item: Item): Promise<Submission> {
    return this.db.update('submission', { sid }, item) as Promise<Submission>
  }

  async delete_submission(sid: string): Promise<void> {
    return this.db.delete('submission', { sid })
  }

  /* Problems */

  async create_problem(item: Item): Promise<Problem> {
    return this.db.put('problem', item) as Promise<Problem>
  }

  async get_problem(pid: string): Promise<Problem> {
    return this.db.get('problem', { pid }) as Promise<Problem>
  }

  async get_problems(args?: Args, columns?: string[]): Promise<Problem[]> {
    return this.db.scan('problem', { args, columns }) as Promise<Problem[]>
  }

  async update_problem(pid: string, item: Item): Promise<Problem> {
    return this.db.update('problem', { pid }, item) as Promise<Problem>
  }

  async delete_problem(pid: string): Promise<void> {
    return this.db.delete('problem', { pid })
  }

  /* Settings */

  async get_settings(): Promise<Settings> {
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
