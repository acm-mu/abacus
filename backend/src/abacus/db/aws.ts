import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
import { AttributeMap, DocumentClient, ItemList, ScanInput } from "aws-sdk/clients/dynamodb";
import { Database } from ".";

export default class AWSDB implements Database {
  constructor(aws_region?: string) {
    AWS.config.region = aws_region || 'us-east-1'
  }

  scan(tableName: string, query?: { args?: Record<string, unknown>, columns?: string[] }): Promise<ItemList | undefined> {
    const db = new DocumentClient();
    return new Promise(async (resolve, reject) => {
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
      const scanResults: ItemList = []
      let items;
      try {
        do {
          items = await db.scan(params).promise()
          items.Items?.forEach(item => scanResults.push(item))
          params.ExclusiveStartKey = items.LastEvaluatedKey
        } while (typeof items.LastEvaluatedKey != "undefined")
        resolve(scanResults)
      } catch (err) {
        reject(err)
      }
    })
  }

  get(tableName: string, key: Record<string, string>): Promise<AttributeMap | undefined> {
    const db = new DocumentClient();
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

  put(tableName: string, item: Record<string, unknown>): Promise<void> {
    const db = new DocumentClient();
    return new Promise((resolve, reject) => {
      db.put({
        TableName: tableName,
        Item: item
      }, (err) => {
        if (err) {
          reject(err)
          return
        }
        this.logActivity(tableName, 'PUT', item)
        resolve()
      })
    })
  }

  update(tableName: string, key: Record<string, string>, args: Record<string, unknown>): Promise<void> {
    const db = new DocumentClient();
    return new Promise((resolve, reject) => {
      const entries = Object.entries(args).filter(entry => !Object.keys(key).includes(entry[0]))

      const setEntries = entries.filter(e => e[1] != null)
      const remEntries = entries.filter(e => e[1] == null)

      const params: any = {}

      const updateExpression: string[] = []

      if (setEntries.length > 0) {
        updateExpression.push("SET " + (setEntries.map(e => `#${e[0]} = :${e[0]}`).join(", ")))
        params.ExpressionAttributeValues = Object.assign({}, ...entries.filter(e => e[1] != null).map((x) => ({ [`:${x[0]}`]: x[1] })))
      }

      if (remEntries.length > 0) updateExpression.push("REMOVE " + (remEntries.map(e => `#${e[0]}`)))

      db.update({
        ...params,
        TableName: tableName,
        Key: key,
        ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
        UpdateExpression: updateExpression.join(" | ")
      }, err => {
        if (err) {
          reject(err)
          return
        }
        this.logActivity(tableName, 'UPDATE', { ...key, ...args })
        resolve()
      })
    })
  }

  delete(tableName: string, key: Record<string, string>): Promise<void> {
    const db = new DocumentClient();
    return new Promise((resolve, reject) => {
      db.delete({
        TableName: tableName,
        Key: key
      }, (err) => {
        if (err) {
          reject(err)
          return
        }
        this.logActivity(tableName, 'DELETE', { ...key })
        resolve()
      })
    })
  }

  logActivity(tableName: string, action: string, newValue: Record<string, unknown>) {
    const db = new DocumentClient();
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

