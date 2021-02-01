import AWS from "aws-sdk";
import { createHash } from 'crypto';

class ContestService {
  docClient: AWS.DynamoDB.DocumentClient;

  constructor() {
    this.init_aws();
  }

  init_aws() {
    const credentials = new AWS.SharedIniFileCredentials({
      profile: "default",
    });

    AWS.config.credentials = credentials;
    AWS.config.region = 'us-east-2'

    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  auth_login(form_data: {password: string}) {
    const hash = createHash('sha256').update(form_data.password).digest('hex')
    return hash
  }

  home() {}

  makeParams(args?: {}) {
    if (!args) return {}
    const entries = Object.entries(args)
    if (entries.length == 0) return {}
    return {
      FilterExpression: entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(" AND "),
      ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({[`#${x[0]}`]: x[0]}) )),
      ExpressionAttributeValues: Object.assign({}, ...entries.map((x) => ({[`:${x[0]}`]: x[1]}) ))
    }
  }

  dumps(res: any, key: string) {
    return res.Items ? Object.assign({}, ...res.Items.map((obj: any) => ({[obj[key]]: obj}))) : []
  }

  async get_settings() {
    const res = await this.docClient.scan({TableName: 'setting'}).promise()
    return res.Items ? Object.assign({}, ...res.Items.map((x) => ({[x.key]: x.value}))) : []
  }

  save_settings() {}

  async get_problems(args?: any) {
    const params = {TableName: 'problem', ...this.makeParams(args)}
    const res = await this.docClient.scan(params).promise()
    return this.dumps(res, 'problem_id')
  }

  async get_submissions(args?: any) {
    const params = {TableName: 'submission', ...this.makeParams(args)}
    const res = await this.docClient.scan(params).promise()
    return this.dumps(res, 'submission_id')
  }

  async get_users(args?: {}) {
    const params = {TableName: 'user', ...this.makeParams(args)}
    const res = await this.docClient.scan(params).promise()
    return this.dumps(res, 'user_id')
  }

  get_user_info() {}

  import_users() {}

  submit(_request: any) {
    // const {language, problem_id, ...} = request.form
    // const submission_id = uuid.uuid4().hex
  }
}

const contest = new ContestService();
export default contest;
