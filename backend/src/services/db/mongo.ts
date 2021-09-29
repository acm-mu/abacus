import { Database } from '.'
import { Item, Key, ScanOptions } from './database'
import { Db, MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

export default class MongoDB extends Database {
  db: Db

  constructor() {
    super()

    const { MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_DBNAME } = process.env
    const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DBNAME}`

    MongoClient.connect(url, (err: any, db) => {
      if (err) throw err
      if (!db) throw new Error('Could not connect to MongoDB database')
      this.db = db.db('abacus')
    })
  }

  scan(TableName: string, query?: ScanOptions, page?: number): Promise<Item[]> {
    const pageSize = 25;
    const skip = page ? (page - 1) * 25 : null;
    return new Promise(async (resolve, reject) => {
      await this.db
        .collection(TableName)
        .find(query?.args || {})
        .skip(skip ? skip: 0)
        .limit(skip ? pageSize : 0)
        .toArray((err: any, data: any) => {
          if (err) {
            reject(err)
            return
          }
          if (data) resolve(data)
        })
    })
  }

  get(TableName: string, Key: Key): Promise<Item> {
    return new Promise(async (resolve, reject) => {
      await this.db.collection(TableName).findOne(Key, (err: any, data) => {
        if (err) {
          reject(err)
          return
        }
        if (data) resolve(data)
      })
    })
  }
  
  put(TableName: string, Item: Item): Promise<Item> {
    return new Promise(async (resolve, reject) => {
      await this.db.collection(TableName).insertOne(Item, (err: any, data) => {
        if (err) {
          reject(err)
          return
        }
        if (data) resolve(data)
      })
    })
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    return new Promise(async (resolve, reject) => {
      const unsetFields = Object.assign(
        {},
        ...Object.entries(Item)
          .filter((obj) => !obj[1])
          .map((obj) => ({ [`${obj[0]}`]: 1 }))
      )

      await this.db.collection(TableName).updateOne(
        Key,
        {
          $set: Item,
          $unset: unsetFields
        },
        (err: any, data) => {
          if (err) {
            reject(err)
            return
          }
          if (data) resolve(data)
        }
      )
    })
  }

  delete(TableName: string, Key: Key): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.db.collection(TableName).deleteOne(Key, (err: any, _data) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}
