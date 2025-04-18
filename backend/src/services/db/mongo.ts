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
    var obj = { _id: 0 }
    if (query?.columns) {
      obj = query.columns.reduce((o, key) => ({ ...o, [key]: 1 }), { _id: 0 })
    }

    const pageSize = 25
    const skip = page ? (page - 1) * 25 : null
    return new Promise((resolve, reject) => {
      this.db
        .collection(TableName)
        .find(query?.args || {}, { projection: obj })
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
    return new Promise((resolve, reject) => {
      this.db
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
      const setFields: Record<string, any> = {}
      const unsetFields: Record<string, any> = {}

      // Separate the fields into $set and $unset
      for (const key in Item) {
        if (Item[key] === null) {
          unsetFields[key] = "" // Remove the field if it's null
        } else {
          setFields[key] = Item[key] // Update the field with the new value
        }
      }

      const updateOps: Record<string, any> = {}
      if (Object.keys(setFields).length) updateOps['$set'] = setFields
      if (Object.keys(unsetFields).length) updateOps['$unset'] = unsetFields

      // Perform the update
      this.db.collection(TableName).updateOne(
        Key,
        updateOps, // Apply both $set and $unset as needed
        (err, data) => {
          if (err) {
            reject(err)
            return
          }
          if (data) resolve(Item) // Return the original item as confirmation
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
