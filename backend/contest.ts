import AWS from "aws-sdk";
import { QueryString } from "aws-sdk/clients/cloudwatchlogs";
import { ScanOutput } from "aws-sdk/clients/dynamodb";
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid'

class ContestService {
  db: AWS.DynamoDB.DocumentClient;
  s3: AWS.S3

  constructor() {
    this.init_aws();
  }

  init_aws() {
    const credentials = new AWS.SharedIniFileCredentials({
      profile: "default",
    });

    AWS.config.credentials = credentials;
    AWS.config.region = 'us-east-2'

    this.db = new AWS.DynamoDB.DocumentClient();
    this.s3 = new AWS.S3();
  }

  auth_login(form_data: { password: string }) {
    const hash = createHash('sha256').update(form_data.password).digest('hex')
    return hash
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

  dumps(res: ScanOutput, key: string): {} {
    return res.Items ? Object.assign({}, ...res.Items.map((obj: any) => ({ [obj[key]]: obj }))) : {}
  }

  async get_settings() {
    const res = await this.db.scan({ TableName: 'setting' }).promise()
    return res.Items ? Object.assign({}, ...res.Items.map((x) => ({ [x.key]: x.value }))) : []
  }

  save_settings() {
    const item = {

    }

    this.db.put(
      {
        TableName: 'setting',
        Item: item
      },
      (_err: any, _data: any) => { }
    )
    return item
  }

  async get_problems(args?: { [key: string]: string }): Promise<{ [key: string]: any }> {
    const params = { TableName: 'problem', ...this.makeParams(args) }
    const res = await this.db.scan(params).promise()
    return this.dumps(res, 'problem_id')
  }

  async get_submissions(args?: { [key: string]: string }): Promise<{}> {
    const params = { TableName: 'submission', ...this.makeParams(args) }
    const res = await this.db.scan(params).promise()

    if (res && res.Items) {
      for (const submission of res.Items) {
        submission.team_name = (await this.get_users({ user_id: submission.team_id }))[submission.team_id].user_name
        submission.prob_name = (await this.get_problems({ problem_id: submission.problem_id }))[submission.problem_id].problem_name
      }
    }

    return this.dumps(res, 'submission_id')
  }

  async get_users(args?: { [key: string]: string }): Promise<{ [key: string]: any }> {
    const params = { TableName: 'user', ...this.makeParams(args) }
    const res = await this.db.scan(params).promise()
    return this.dumps(res, 'user_id')
  }

  async submit(req: any) {
    const { name: filename, size: filesize, md5: sha1sum } = req.files.file
    const { language, problem_id, team_id } = req.body
    const submission_id = uuidv4().replace(/-/g, '')

    const { tests } = (await this.get_problems({ problem_id }))[problem_id]

    const item = {
      submission_id,
      sub_no: 0,
      status: 'pending',
      score: 0,
      date: Date.now(),
      language,
      problem_id,
      team_id,
      filename,
      runtime: 0,
      filesize,
      sha1sum,
      tests,
    }

    const params = {
      Bucket: 'abacus-submissions',
      Key: `${submission_id}/${filename}`,
      Body: req.files.file.data
    }
    this.s3.upload(params, (_err: any, _data: any) => { })

    this.db.put(
      {
        TableName: 'submission',
        Item: item
      },
      (_err: any, _data: any) => { }
    )
    return item
  }
}

const contest = new ContestService();
export default contest;
