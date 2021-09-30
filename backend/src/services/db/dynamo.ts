import { DocumentClient, ScanInput } from 'aws-sdk/clients/dynamodb'
import { Database } from '.'
import { Item, Key, ScanOptions } from './database'

export default class DynamoDB extends Database {
  db: DocumentClient

  constructor() {
    super()
    this.db = new DocumentClient()
  }

  scan(TableName: string, query: ScanOptions, page?: number, lastStartKey?: any): Promise<Item[]> {
    return new Promise(async (resolve, reject) => {
      let params: ScanInput = { TableName }
      page ? (params.Limit = 25) : undefined
      lastStartKey ? (params.ExclusiveStartKey = lastStartKey) : (params.ExclusiveStartKey = undefined)
      if (query) {
        if (query.args) {
          const entries = Object.entries(query.args)
          if (entries.length > 0) {
            params.FilterExpression = entries.map((e) => `#${e[0]} = :${e[0]}`).join(' AND ')
            params.ExpressionAttributeNames = Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] })))
            params.ExpressionAttributeValues = Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
          }
        }
        if (query.columns) {
          params.ProjectionExpression = query.columns.map((e) => `#${e}`).join(', ')
          if (params.ExpressionAttributeNames)
            params.ExpressionAttributeNames = {
              ...params.ExpressionAttributeNames,
              ...Object.assign({}, ...query.columns.map((e) => ({ [`#${e}`]: `${e}` })))
            }
          else params.ExpressionAttributeNames = Object.assign({}, ...query.columns.map((e) => ({ [`#${e}`]: `${e}` })))
        }
      }
      const scanResults: Item[] = []
      let Items
      try {
        do {
          Items = await this.db.scan(params).promise()
          Items.Items?.forEach((Item) => scanResults.push(Item))
          params.ExclusiveStartKey = Items.LastEvaluatedKey
        } while (typeof Items.LastEvaluatedKey != 'undefined')
        resolve(scanResults)
      } catch (err) {
        reject(err)
      }
    })
  }

  get(TableName: string, Key: Key): Promise<Item> {
    return new Promise((resolve, reject) => {
      this.db.get({ TableName, Key }, (err, data) => {
        if (err) reject(err)
        else resolve(data.Item as Item)
      })
    })
  }

  put(TableName: string, Item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      this.db.put({ TableName, Item }, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      const entries = Object.entries(Item).filter((entry) => !Object.keys(Key).includes(entry[0]))

      const setEntries = entries.filter((e) => e[1] != null)
      const remEntries = entries.filter((e) => e[1] == null)

      const params: any = {}

      const updateExpression: string[] = []

      if (setEntries.length > 0) {
        updateExpression.push('SET ' + setEntries.map((e) => `#${e[0]} = :${e[0]}`).join(', '))
        params.ExpressionAttributeValues = Object.assign(
          {},
          ...entries.filter((e) => e[1] != null).map((x) => ({ [`:${x[0]}`]: x[1] }))
        )
      }

      if (remEntries.length > 0) updateExpression.push('REMOVE ' + remEntries.map((e) => `#${e[0]}`))

      this.db.update(
        {
          ...params,
          TableName,
          Key,
          ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
          UpdateExpression: updateExpression.join(' | ')
        },
        (err, data) => {
          if (err) {
            reject(err)
            return
          }
          resolve(data)
        }
      )
    })
  }

  delete(TableName: string, Key: Key): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.delete({ TableName, Key }, (err, _data) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}
