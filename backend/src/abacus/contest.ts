import { Clarification, Settings, User } from "abacus";
import { Lambda } from "aws-sdk";
import { transpose } from "../utils";
import { AWSDB, Database } from "./db";

class ContestService {

  db: Database;
  user?: User;
  lambda: Lambda;

  constructor(db: Database) {
    this.db = db
    this.lambda = new Lambda()
  }

  auth(user: User) {
    this.user = user
  }

  get_user(data: Record<string, unknown>): Promise<User | undefined> {
    return new Promise(async (resolve, reject) => {
      const users = await this.db.scan('user', data)
      if (!users?.length) {
        reject()
        return
      }
      if (users?.length > 1) reject('Too many users returned!')
      if (users?.length == 1) resolve(users[0] as User)
    })
  }

  get_users(query?: { args?: Record<string, unknown>, columns?: string[] }): Promise<Record<string, User>> {
    return new Promise(async (resolve, reject) => {
      try {
        const map = transpose(await this.db.scan('user', query), 'uid') as Record<string, User>
        resolve(map)
      } catch (err) {
        reject(err)
      }
    })
  }

  get_clarifications(query?: { args?: Record<string, unknown>, columns?: string[] }): Promise<Record<string, Clarification>> {
    return new Promise(async (resolve, reject) => {
      try {
        const map = transpose(await contest.db.scan('clarification', query), 'cid') as Record<string, Clarification>
        resolve(map)
      } catch (err) {
        reject(err)
      }
    })
  }

  get_settings(): Promise<Settings> {
    return new Promise(async (resolve, reject) => {
      try {
        const settings = await this.db.scan('setting') as Record<string, string | number>[]
        resolve(Object.assign({}, ...settings?.map(x => ({ [x.key]: x.value }))))
      } catch (err) { reject(err) }
    })
  }

  invoke(FunctionName: string, Payload: Record<string, unknown>): Promise<Lambda.InvocationResponse> {
    return new Promise((resolve, reject) => {
      this.lambda.invoke({
        FunctionName,
        Payload: JSON.stringify(Payload)
      }, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  transpose(items: Record<string, unknown>[] | undefined, key: string): { [key: string]: any } {
    return items ? Object.assign({}, ...items.map((obj: Record<string, unknown>) => ({ [`${obj[key]}`]: obj }))) : {}
  }
}

const awsdb = new AWSDB(process.env.AWS_REGION || 'us-east-1')
const contest = new ContestService(awsdb)

export default contest
