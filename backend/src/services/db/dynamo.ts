import { Item } from 'abacus'
import { DocumentClient, ScanInput } from 'aws-sdk/clients/dynamodb'
import { Database } from '.'
import { Key, ScanOptions } from './database'

export default class DynamoDB extends Database {
  db: DocumentClient

  constructor() {
    super()
    this.db = new DocumentClient()
  }

  count(TableName: string, query: ScanOptions): Promise<number> {
    return new Promise(async (resolve, reject) => {
      // might change exclusivestartkey below, so I disable prefer const
      // eslint-disable-next-line prefer-const
      let params: ScanInput = { TableName }
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
          Items = await await this.db.scan(params).promise()
          Items.Items?.forEach((Item) => scanResults.push(Item))
          params.ExclusiveStartKey = Items.LastEvaluatedKey
        } while (typeof Items.LastEvaluatedKey != 'undefined')
        resolve(scanResults.length)
      } catch (err) {
        reject(err)
      }
    })
  }

  scan(TableName: string, query: ScanOptions, _page?: number, startKey?: DocumentClient.Key): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const params: ScanInput = { TableName }
        params.ExclusiveStartKey = startKey ? startKey : undefined
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
            Items = await this.db.scan(params).promise()
            Items.Items?.forEach((Item) => scanResults.push(Item))
            params.ExclusiveStartKey = Items.LastEvaluatedKey
          } while (typeof Items.LastEvaluatedKey != 'undefined')

          resolve(scanResults)
        } catch (err) {
          reject(err)
        }
      })()
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
        resolve(data as Item)
      })
    })
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
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
          resolve(data as Item)
        }
      )
    })
  }

  delete(TableName: string, Key: Key): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.delete({ TableName, Key }, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}
