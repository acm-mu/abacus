import { Database } from "."
import { Item, Key, ScanOptions } from "./database"
import { Db, MongoClient } from "mongodb"

export default class MongoDB extends Database {

  url = "mongodb://localhost"
  db: Db

  constructor() {
    super()
    MongoClient.connect(this.url, (err, db) => {
      if (err) throw err;
      if (!db) throw new Error("Could not connect to MongoDB database")
      this.db = db.db("abacus")
    })
  }

  scan(TableName: string, query?: ScanOptions): Promise<Item[]> {
    return new Promise(async (resolve, _reject) => {
      resolve(await this.db.collection(TableName).find(query?.args || {}).toArray())
    })
  }

  get(TableName: string, Key: Key): Promise<Item> {
    return new Promise(async (resolve, reject) => {
      await this.db.collection(TableName).findOne(Key, (err, data) => {
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
      await this.db.collection(TableName).insertOne(Item, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        if (data) resolve(data)
      })
    })
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    return new Promise(async (resolve, _reject) => {
      const result = await this.db.collection(TableName).updateOne(Key, { $set: Item })

      for (const [key, value] of Object.entries(Item)) {
        if (value === null) {
          await this.db.collection(TableName).updateOne(Key, {
            $unset: { [key]: 1 }
          })
        }
      }
      if (result) resolve(result)
    })
  }

  delete(TableName: string, Key: Key): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.db.collection(TableName).deleteOne(Key, (err, _data) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  batchWrite(TableName: string, PutItems: Record<string, any>[]): Promise<void> {
    return new Promise(async(resolve, reject) => {
      this.db.collection(TableName).updateMany({}, PutItems, (err, _res) => {
        if(err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}