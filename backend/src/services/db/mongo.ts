import { Item, Items } from 'abacus'
import * as dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { Database } from '.'
import type { ApiOptions } from "../../api";
import { Key, ScanOptions } from './database'

dotenv.config()

export default class MongoDB extends Database {
  db: Db

  constructor() {
    super()

    const { MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_DBNAME } = process.env
    const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DBNAME}`

    const client = new MongoClient(url);

    client.connect().then(db => {
      if (!db) {
        console.error("Error occurred while trying to connect to Mongo!")
        throw new Error('Could not connect to MongoDB database')
      }
      this.db = db.db('abacus')
      console.log("Connected to abacus!")
    })
  }

  async scan(TableName: string, query?: ScanOptions, options?: ApiOptions): Promise<Items> {
    let obj = { _id: 0 }

    if (query?.columns) {
      obj = query.columns.reduce((o, key) => ({ ...o, [key]: 1 }), { _id: 0 })
    }

    const collection = this.db.collection(TableName)

    let result = collection.find(query?.args || {}, { projection: obj })
    const totalItems = await collection.countDocuments(query?.args || {})

    if (options?.sortBy) {
      console.log(`Sorting ${options.sortBy}`)
      result = result.sort(options.sortBy, options.sortDirection == 'ascending' ? 1 : -1)
    }

    const items = await result.skip(options?.skip ?? 0)
      .limit(options?.limit ?? 25)
      .toArray()

    return {
      items,
      totalItems
    }
  }

  async get(TableName: string, Key: Key): Promise<Item | null> {
    return await this.db.collection(TableName).findOne(Key, { projection: { _id: 0 } })
  }

  async put(TableName: string, Item: Item) {
    await this.db.collection(TableName).insertOne(Item)
  }

  async update(TableName: string, Key: Key, Item: Item) {
    const unsetFields = Object.assign(
      {},
      ...Object.entries(Item)
        .filter((obj) => obj[1] === undefined || obj[1] === null)
        .map((obj) => ({ [`${obj[0]}`]: 1 }))
    )

    const collection = this.db.collection(TableName)

    await collection.updateOne(Key, {
      $set: Item,
      $unset: unsetFields
    })
  }

  async delete(TableName: string, Key: Key) {
    await this.db.collection(TableName).deleteOne(Key)
  }
}
