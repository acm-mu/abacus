import { Args, Settings } from "abacus";
import AWS, { Lambda } from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
import { AttributeMap, BatchWriteItemOutput, DeleteItemOutput, DocumentClient, ItemList, PutItemOutput, ScanInput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { InvocationResponse } from "aws-sdk/clients/lambda";

class ContestService {
  constructor() {
    AWS.config.region = process.env.AWS_REGION || 'us-east-1';
  }

  async get_settings(): Promise<Settings> {
    return new Promise((resolve, reject) => {
      this.scanItems('setting').then(itemList => {
        if (itemList) {
          resolve(Object.assign({}, ...itemList.map(((x: any) => ({ [x.key]: x.value })))))
        } else {
          reject()
        }
      })
        .catch(err => reject(err))
    })
  }

  save_settings(settings: Settings): Promise<BatchWriteItemOutput> {
    const db = new DocumentClient()
    return new Promise((resolve, reject) => {
      db.batchWrite({
        RequestItems: {
          'setting': Object.entries(settings).map((e) => ({ PutRequest: { Item: { "key": e[0], "value": e[1] } } }))
        }
      }, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  scanItems(tableName: string, query?: { args?: Args, columns?: string[] }): Promise<ItemList | undefined> {
    const db = new DocumentClient()
    return new Promise((resolve, reject) => {
      let params: ScanInput = {
        TableName: tableName
      }
      if (query) {
        if (query.args) {
          const entries = Object.entries(query.args)
          if (entries.length > 0) {
            params.FilterExpression = entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(" AND ")
            params.ExpressionAttributeNames = Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] })))
            params.ExpressionAttributeValues = Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))

          }
        }
        if (query.columns) {
          params.ProjectionExpression = query.columns.map((e) => `#${e}`).join(", ")
          if (params.ExpressionAttributeNames)
            params.ExpressionAttributeNames = { ...params.ExpressionAttributeNames, ...Object.assign({}, ...query.columns.map((e) => ({ [`#${e}`]: `${e}` }))) }
          else
            params.ExpressionAttributeNames = Object.assign({}, ...query.columns.map((e) => ({ [`#${e}`]: `${e}` })))
        }
      }
      db.scan(params, (err, data) => {
        if (err) reject(err)
        else resolve(data.Items)
      })
    })
  }

  getItem(tableName: string, key: Args): Promise<AttributeMap | undefined> {
    const db = new DocumentClient()
    return new Promise((resolve, reject) => {
      db.get({
        TableName: tableName,
        Key: key
      }, (err, data) => {
        if (err) reject(err)
        else resolve(data.Item)
      })
    })
  }

  putItem(tableName: string, item: Args): Promise<PutItemOutput> {
    const db = new DocumentClient()
    return new Promise((resolve, reject) => {
      db.put({
        TableName: tableName,
        Item: item
      }, (err, data) => {
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
    const db = new DocumentClient()
    return new Promise((resolve, reject) => {
      const entries = Object.entries(args).filter(entry => !Object.keys(key).includes(entry[0]))
      db.update({
        TableName: tableName,
        Key: key,
        UpdateExpression: "SET " + (entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(", ")),
        ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
        ExpressionAttributeValues: Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
      }, (err, data) => {
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
    const db = new DocumentClient()
    return new Promise((resolve, reject) => {
      db.delete({
        TableName: tableName,
        Key: key
      }, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        this.logActivity(tableName, 'DELETE', { ...key })
        resolve(data)
      })
    })
  }

  invoke(FunctionName: string, Payload: Args): Promise<InvocationResponse> {
    const lambda = new Lambda()
    return new Promise((resolve, reject) => {
      lambda.invoke({
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

  logActivity(tableName: string, action: string, newValue: Args) {
    const db = new DocumentClient()
    db.put({
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
