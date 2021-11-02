import { Clarification, Problem, Settings, Submission, User } from 'abacus'
import { Lambda } from 'aws-sdk'
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

  async create_user(item: any): Promise<User> {
    return this.db.put('user', item) as Promise<User>
  }

  async get_user(uid: string): Promise<User> {
    return this.db.get('user', { uid }) as Promise<User>
  }

  async get_users(args?: any, page?: number): Promise<User[]> {
    return this.db.scan('user', { args }, page) as Promise<User[]>
  }

  /*
  async get_user_page_count(args?: any): Promise<User[]> {
    return this.db.count('user', { args }) as Promise<User[]>
  }
  */

  async update_user(uid: string, item: any): Promise<User> {
    return this.db.update('user', { uid }, item) as Promise<User>
  }

  async delete_user(uid: string): Promise<void> {
    return this.db.delete('user', { uid })
  }

  /* Clarifications */

  async create_clarification(item: any): Promise<Clarification> {
    return this.db.put('clarification', item) as Promise<Clarification>
  }

  async get_clarification(cid: string): Promise<Clarification> {
    return this.db.get('clarification', { cid }) as Promise<Clarification>
  }

  async get_clarifications(args?: any, page?: number): Promise<Clarification[]> {
    return this.db.scan('clarification', { args }, page) as Promise<Clarification[]>
  }

  async update_clarification(cid: string, item: any): Promise<Clarification> {
    return this.db.update('clarification', { cid }, item) as Promise<Clarification>
  }

  async delete_clarification(cid: string): Promise<void> {
    return this.db.delete('clarification', { cid })
  }

  /* Submissions */

  async create_submission(item: any): Promise<Submission> {
    return this.db.put('submission', item) as Promise<Submission>
  }

  async get_submission(sid: string): Promise<Submission> {
    return this.db.get('submission', { sid }) as Promise<Submission>
  }

  async get_submissions(args: any, page?: number): Promise<Submission[]> {
    return this.db.scan('submission', { args }, page) as Promise<Submission[]>
  }

  async update_submission(sid: string, item: any): Promise<Submission> {
    return this.db.update('submission', { sid }, item) as Promise<Submission>
  }

  async delete_submission(sid: string): Promise<void> {
    return this.db.delete('submission', { sid })
  }

  /* Problems */

  async create_problem(item: any): Promise<Problem> {
    return this.db.put('problem', item) as Promise<Problem>
  }

  async get_problem(pid: string): Promise<Problem> {
    return this.db.get('problem', { pid }) as Promise<Problem>
  }

  async get_problems(args: any, page?: number, ...columns: any): Promise<Problem[]> {
    return this.db.scan('problem', { args, columns }, page) as Promise<Problem[]>
  }

  async update_problem(pid: string, item: any): Promise<Problem> {
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

export const transpose = (itemList: any[] | undefined, key: string): { [key: string]: any } => {
  if (!itemList) return {}
  return Object.assign({}, ...itemList.map((obj: any) => ({ [obj[key]]: obj })))
}

export const makeJSON = (itemList: any, columns: string[] = []): string => {
  itemList.map((e: any) => {
    Object.keys(e).forEach((key) => {
      if (!columns.includes(key)) {
        delete e[key]
      }
    })
  })
  return JSON.stringify(itemList)
}

export default new ContestService()
