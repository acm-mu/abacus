import { DocumentClient, ScanInput } from "aws-sdk/clients/dynamodb";
import { Database } from ".";
import { Item, Key, ScanOptions } from "./database";

export default class DynamoDB extends Database {

  db: DocumentClient

  constructor() {
    super()
    this.db = new DocumentClient()
  }

  scan(tableName: string, query: ScanOptions): Promise<Item[]> {
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
      const scanResults: Item[] = []
      let items;
      try {
        do {
          items = await this.db.scan(params).promise();
          items.Items?.forEach(item => scanResults.push(item))
          params.ExclusiveStartKey = items.LastEvaluatedKey
        } while (typeof items.LastEvaluatedKey != "undefined")
        resolve(scanResults)
      } catch (err) {
        reject(err)
      }
    })
  }

  get(tableName: string, key: Key): Promise<Item> {
    return new Promise((resolve, reject) => {
      this.db.get({
        TableName: tableName,
        Key: key
      }, (err, data) => {
        if (err) reject(err)
        else resolve(data.Item as Item)
      })
    })
  }

  put(tableName: string, item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      this.db.put({
        TableName: tableName,
        Item: item
      }, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        // this.logActivity(tableName, 'PUT', item)
        resolve(data)
      })
    })
  }

  update(tableName: string, key: Key, item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      const entries = Object.entries(item).filter(entry => !Object.keys(key).includes(entry[0]))

      const setEntries = entries.filter(e => e[1] != null)
      const remEntries = entries.filter(e => e[1] == null)

      const params: any = {}

      const updateExpression: string[] = []

      if (setEntries.length > 0) {
        updateExpression.push("SET " + (setEntries.map(e => `#${e[0]} = :${e[0]}`).join(", ")))
        params.ExpressionAttributeValues = Object.assign({}, ...entries.filter(e => e[1] != null).map((x) => ({ [`:${x[0]}`]: x[1] })))
      }

      if (remEntries.length > 0) updateExpression.push("REMOVE " + (remEntries.map(e => `#${e[0]}`)))

      this.db.update({
        ...params,
        TableName: tableName,
        Key: key,
        ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
        UpdateExpression: updateExpression.join(" | ")
      }, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        // this.logActivity(tableName, 'UPDATE', { ...key, ...args })
        resolve(data)
      })
    })
  }

  delete(tableName: string, key: Key): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.delete({
        TableName: tableName,
        Key: key
      }, (err, _data) => {
        if (err) {
          reject(err)
          return
        }
        // this.logActivity(tableName, 'DELETE', { ...key })
        resolve()
      })
    })
  }

  batchWrite(TableName: string, PutItems: Record<string, any>[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.batchWrite({
        RequestItems: {
         [TableName]: PutItems.map((Item) => ({ PutRequest: { Item } }))
        }
      }, (err, _data) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}