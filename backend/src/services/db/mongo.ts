import { Item } from 'abacus'
import * as dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { Database } from '.'
import { Key, ScanOptions } from './database'

dotenv.config()

export default class MongoDB extends Database {
  db: Db

  constructor() {
    super()

    const { MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_DBNAME } = process.env
    const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DBNAME}`

    MongoClient.connect(url, (err, db) => {
      if (err) throw err
      if (!db) throw new Error('Could not connect to MongoDB database')
      this.db = db.db('abacus')
    })
  }

  scan(TableName: string, query?: ScanOptions, page?: number): Promise<Item[]> {
    const pageSize = 5
    const skip = page ? (page - 1) * 5 : null
    return new Promise((resolve, reject) => {
      this.db
        .collection(TableName)
        .find(query?.args || {}, { projection: { _id: 0 } })
        .skip(skip ? skip : 0)
        .limit(page ? pageSize : 0)
        .toArray((err: any, data: any) => {
          if (err) {
            reject(err)
            return
          }
          if (data) resolve(data)
        })
    })
  }

  count(TableName: string, query?: ScanOptions): Promise<number> {
    return new Promise(async (resolve, reject) => {
      await this.db
        .collection(TableName)
        .find(query?.args || {})
        .count((err: any, data: any) => {
          if (err) {
            reject(err)
            return
          }
          if (data) resolve(data)
        })
    })
  }

  /*count(TableName: string, query?: ScanOptions): Promise<Item[]> {
    return new Promise(async (resolve, reject) => {
      await this.db
        .collection(TableName)
        .find(query?.args || {})
        .count((err: any, data: any) => {
        if(err) {
          reject(err)
          return
        }
        if(data) resolve(data);
        })
    })
  }
  */

  get(TableName: string, Key: Key): Promise<Item> {
    return new Promise((resolve, reject) => {
      this.db.collection(TableName).findOne(Key, { projection: { _id: 0 } }, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        if (data) resolve(data)
      })
    })
  }

  put(TableName: string, Item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      this.db.collection(TableName).insertOne(Item, (err: any, data: any) => {
        if (err) {
          reject(err)
          return
        }
        if (data) resolve(data as unknown as Item)
      })
    })
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      const unsetFields = Object.assign(
        {},
        ...Object.entries(Item)
          .filter((obj) => obj[1] === undefined || obj[1] === null)
          .map((obj) => ({ [`${obj[0]}`]: 1 }))
      )

      this.db.collection(TableName).updateOne(
        Key,
        {
          $set: Item,
          $unset: unsetFields
        },
        (err, data) => {
          if (err) {
            reject(err)
            return
          }
          if (data) resolve(data as unknown as Item)
        }
      )
    })
  }

  delete(TableName: string, Key: Key): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.collection(TableName).deleteOne(Key, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}
