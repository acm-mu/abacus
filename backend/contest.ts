import AWS from "aws-sdk";
import { QueryString } from "aws-sdk/clients/cloudwatchlogs";
import { ScanOutput } from "aws-sdk/clients/dynamodb";
import { v4 as uuidv4 } from 'uuid'

class ContestService {
  db: AWS.DynamoDB.DocumentClient;
  s3: AWS.S3

  constructor() {
    this.init_aws();
  }

  init_aws() {
    AWS.config.region = 'us-east-2'

    this.db = new AWS.DynamoDB.DocumentClient();
    this.s3 = new AWS.S3();
  }

  makeParams(args?: { [key: string]: string } | QueryString) {
    if (!args) return {}
    const entries = Object.entries(args)
    if (entries.length == 0) return {}
    return {
      FilterExpression: entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(" AND "),
      ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
      ExpressionAttributeValues: Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
    }
  }

  updateItem(TableName: string, Key: { [key: string]: string }, args: { [key: string]: string }) {
    const entries = Object.entries(args)
    try {
      const params = {
        TableName,
        Key,
        UpdateExpression: entries.map((e) => "SET  " + (`#${e[0]} = :${e[0]}`)).join(","),
        ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
        ExpressionAttributeValues: Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
      }
      this.db.update(params, (_err, _data) => { })
    } catch (err) {
      throw (err)
    }
  }

  dumps(res: ScanOutput, key: string): {} {
    return res.Items ? Object.assign({}, ...res.Items.map((obj: any) => ({ [obj[key]]: obj }))) : {}
  }

  async get_settings() {
    try {
      const res = await this.db.scan({ TableName: 'setting' }).promise()
      return res.Items ? Object.assign({}, ...res.Items.map((x) => ({ [x.key]: x.value }))) : []
    } catch (err) {
      throw (err)
    }
  }

  save_settings() {
    const item = {

    }
    try {
      this.db.put({
        TableName: 'setting',
        Item: item
      }, (_err: any, _data: any) => { }
      )
      return item
    } catch (err) {
      throw (err)
    }
  }

  async get_problems(args?: { [key: string]: string }): Promise<{ [key: string]: any }> {
    const params = { TableName: 'problem', ...this.makeParams(args) }
    try {
      const res = await this.db.scan(params).promise()
      return this.dumps(res, 'problem_id')
    } catch (err) {
      throw (err)
    }
  }

  async get_submissions(args?: { [key: string]: string }): Promise<{}> {
    const params = { TableName: 'submission', ...this.makeParams(args) }
    try {
      const res = await this.db.scan(params).promise()

      const users = await this.get_users()
      const problems = await this.get_problems()

      if (res && res.Items) {
        for (const submission of res.Items) {
          submission.team_name = users[submission.team_id].display_name
          submission.prob_name = problems[submission.problem_id].problem_name
        }
      }

      return this.dumps(res, 'submission_id')
    } catch (err) {
      throw (err)
    }
  }

  async get_users(args?: { [key: string]: string }): Promise<{ [key: string]: any }> {
    const params = { TableName: 'user', ...this.makeParams(args) }
    try {
      const res = await this.db.scan(params).promise()
      return this.dumps(res, 'user_id')
    } catch (err) {
      throw (err)
    }
  }

  /*
  Don't accept if missing in request (file_ext, problem_id, file, language, team_id)
  */
  async submit(req: any) {
    const { name: filename, size: filesize, md5 } = req.files.file
    const { language, problem_id, team_id } = req.body
    const submission_id = uuidv4().replace(/-/g, '')

    if (!(language && problem_id && team_id)) {
      console.log("Invalid submission!")
      console.log("Must include `language`, `problem_id`, and `team_id`")
      return
    }

    try {
      const { tests } = (await this.get_problems({ problem_id }))[problem_id]

      const item = {
        submission_id,
        sub_no: 0,
        status: 'pending',
        score: 0,
        division: 'blue',
        date: Date.now(),
        language,
        problem_id,
        team_id,
        filename,
        runtime: 0,
        filesize,
        md5,
        tests,
      }

      const params = {
        Bucket: 'abacus-submissions',
        Key: `${submission_id}/${filename}`,
        Body: req.files.file.data
      }
      this.s3.upload(params, (_err: any, _data: any) => { console.log(_err) })

      this.db.put(
        {
          TableName: 'submission',
          Item: item
        },
        (_err: any, _data: any) => { console.log(_err) }
      )
      return item
    } catch (err) {
      throw (err)
    }
  }
}

const contest = new ContestService();
export default contest;
