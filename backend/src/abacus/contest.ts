import { Args, Settings } from "abacus";
import AWS, { AWSError, Lambda, S3 } from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
import { AttributeMap, BatchWriteItemOutput, DeleteItemOutput, DocumentClient, GetItemOutput, ItemList, PutItemOutput, ScanInput, ScanOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";

class ContestService {
  db: DocumentClient;
  s3: S3;
  lambda: Lambda;

  constructor() {
    this.init_aws();
  }

  init_aws() {
    AWS.config.region = process.env.AWS_REGION || 'us-east-1';

    this.db = new DocumentClient();
    this.s3 = new S3();
    this.lambda = new Lambda();
  }

  async get_settings(): Promise<Settings> {
    return new Promise((resolve, reject) => {
      this.scanItems('setting')
        .then((itemList?: ItemList) => {
          if (itemList)
            resolve(Object.assign({}, ...itemList.map(((x: any) => ({ [x.key]: x.value })))))
          else
            reject()
        })
        .catch(err => reject(err))
    })
  }

  save_settings(settings: Settings): Promise<BatchWriteItemOutput> {
    return new Promise((resolve, reject) => {
      this.db.batchWrite({
        RequestItems: {
          'setting': Object.entries(settings).map((e) => ({ PutRequest: { Item: { "key": e[0], "value": e[1] } } }))
        }
      }, (err: AWSError, data: BatchWriteItemOutput) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  scanItems(tableName: string, args?: Args, columns?: string[]): Promise<ItemList | undefined> {
    return new Promise((resolve, reject) => {
      let params: ScanInput = {
        TableName: tableName
      }
      if (args) {
        const entries = Object.entries(args)
        if (entries.length > 0) {
          params.FilterExpression = entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(" AND ")
          params.ExpressionAttributeNames = Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] })))
          params.ExpressionAttributeValues = Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))

        }
        if (columns) {
          params.ProjectionExpression = columns.map((e) => `#${e}`).join(", ")
          if (params.ExpressionAttributeNames)
            params.ExpressionAttributeNames = { ...params.ExpressionAttributeNames, ...Object.assign({}, ...columns.map((e) => ({ [`#${e}`]: `${e}` }))) }
          else
            params.ExpressionAttributeNames = Object.assign({}, ...columns.map((e) => ({ [`#${e}`]: `${e}` })))
        }
      }
      this.db.scan(params, (err: AWSError, data: ScanOutput) => {
        if (err) reject(err)
        else resolve(data.Items)
      })
    })
  }

  getItem(tableName: string, key: Args): Promise<AttributeMap | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get({
        TableName: tableName,
        Key: key
      }, (err: AWSError, data: GetItemOutput) => {
        if (err) reject(err)
        else resolve(data.Item)
      })
    })
  }

  putItem(tableName: string, item: Args): Promise<PutItemOutput> {
    return new Promise((resolve, reject) => {
      this.db.put({
        TableName: tableName,
        Item: item
      }, (err: AWSError, data: PutItemOutput) => {
        if (err) {
          reject(err)
          return
        }
        this.logActivity(tableName, 'PUT', item)
        resolve(data)
      })
    })
  }

  updateItem(tableName: string, key: Args, args: Args): Promise<UpdateItemOutput> {
    return new Promise((resolve, reject) => {
      const entries = Object.entries(args).filter(entry => !Object.keys(key).includes(entry[0]))
      this.db.update({
        TableName: tableName,
        Key: key,
        UpdateExpression: "SET " + (entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(", ")),
        ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
        ExpressionAttributeValues: Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
      }, (err: AWSError, data: UpdateItemOutput) => {
        if (err) {
          reject(err)
          return
        }
        this.logActivity(tableName, 'UPDATE', { ...key, ...args })
        resolve(data)
      })
    })
  }

  deleteItem(tableName: string, key: Args): Promise<DeleteItemOutput> {
    return new Promise((resolve, reject) => {
      this.db.delete({
        TableName: tableName,
        Key: key
      }, (err: AWSError, data: DeleteItemOutput) => {
        if (err) {
          reject(err)
          return
        }
        this.logActivity(tableName, 'DELETE', { ...key })
        resolve(data)
      })
    })
  }

  logActivity(tableName: string, action: string, newValue: Args) {
    this.db.put({
      TableName: 'activity',
      Item: {
        aid: uuidv4(),
        table_name: tableName,
        action,
        ...newValue,
        date: Date.now() / 1000
      }
    })
  }
}

const transpose = (itemList: ItemList | undefined, key: string): { [key: string]: any } => itemList ? Object.assign({}, ...itemList.map((obj: any) => ({ [obj[key]]: obj }))) : {}

const makeJSON = (itemList: ItemList, columns: string[] = []): string => {
  itemList.map((e) => {
    Object.keys(e).forEach((key) => {
      if (!columns.includes(key)) {
        delete e[key]
      }
    })
  })
  return JSON.stringify(itemList)
}

export default new ContestService()
export { transpose, makeJSON };
