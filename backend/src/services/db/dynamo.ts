import { type AttributeValue, DynamoDB, type ScanInput } from "@aws-sdk/client-dynamodb";
import { Item, Items } from 'abacus'
import { Database } from '.'
import type { ApiOptions } from "../../api";
import { Key, ScanOptions } from './database'

type AWSKey = Record<string, AttributeValue>

export default class AWSDynamoDB extends Database {
  db: DynamoDB

  constructor() {
    super()
    this.db = new DynamoDB()
  }

  count(TableName: string, query: ScanOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      // might change exclusivestartkey below, so I disable prefer const
      // eslint-disable-next-line prefer-const
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const params: ScanInput = { TableName }
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
            else
              params.ExpressionAttributeNames = Object.assign({}, ...query.columns.map((e) => ({ [`#${e}`]: `${e}` })))
          }
        }
        const scanResults: Item[] = []
        let Items
        try {
          do {
            Items = await this.db.scan(params)
            Items.Items?.forEach((Item) => scanResults.push(Item))
            params.ExclusiveStartKey = Items.LastEvaluatedKey
          } while (typeof Items.LastEvaluatedKey != 'undefined')
          resolve(scanResults.length)
        } catch (err) {
          reject(err)
        }
      })()
    })
  }

  scan(TableName: string, query: ScanOptions, _options?: ApiOptions, startKey?: Key): Promise<Items> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const params: ScanInput = { TableName }
        params.ExclusiveStartKey = (startKey ? startKey : undefined) as AWSKey
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
            else
              params.ExpressionAttributeNames = Object.assign({}, ...query.columns.map((e) => ({ [`#${e}`]: `${e}` })))
          }
        }
        const scanResults: Item[] = []
        let Items
        try {
          do {
            Items = await this.db.scan(params)
            Items.Items?.forEach((Item) => scanResults.push(Item))
            params.ExclusiveStartKey = Items.LastEvaluatedKey
          } while (typeof Items.LastEvaluatedKey != 'undefined')

          resolve({ items: scanResults, totalItems: 0 })
        } catch (err) {
          reject(err)
        }
      })()
    })
  }

  async get(TableName: string, Key: Key): Promise<Item | undefined> {
    const result = await this.db.getItem({ TableName, Key: Key as AWSKey })
    return result.Item
  }

  async put(TableName: string, Item: Item) {
    await this.db.putItem({ TableName, Item: Item as AWSKey })
  }

  async update(TableName: string, Key: Key, Item: Item) {
    const entries = Object.entries(Item).filter((entry) => !Object.keys(Key).includes(entry[0]))

    const setEntries = entries.filter((e) => e[1] != null)
    const remEntries = entries.filter((e) => e[1] == null)

    const params: Record<string, string> = {}

    const updateExpression: string[] = []

    if (setEntries.length > 0) {
      updateExpression.push('SET ' + setEntries.map((e) => `#${e[0]} = :${e[0]}`).join(', '))
      params.ExpressionAttributeValues = Object.assign(
        {},
        ...entries.filter((e) => e[1] != null).map((x) => ({ [`:${x[0]}`]: x[1] }))
      )
    }

    if (remEntries.length > 0) updateExpression.push('REMOVE ' + remEntries.map((e) => `#${e[0]}`))

    await this.db.updateItem(
      {
        ...params,
        TableName,
        Key: Key as AWSKey,
        ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
        UpdateExpression: updateExpression.join(' | ')
      })
  }

  async delete(TableName: string, Key: Key) {
    await this.db.deleteItem({ TableName, Key: Key as AWSKey });
  }
}
