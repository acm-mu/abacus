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
      const result = await this.db.collection(TableName).findOne(Key)

      if (result) resolve(result)
      else reject(result)
    })
  }

  put(_TableName: string, _Item: Item): Promise<Item> {
    throw new Error("Implement Me!")
  }

  update(_TableName: string, _Key: Key, _Item: Item): Promise<Item> {
    throw new Error("Implement Me!")
  }

  delete(_TableName: string, _Key: Key): Promise<void> {
    throw new Error("Implement Me!")
  }

  batchWrite(_TableName: string, _PutItems: Record<string, any>[]): Promise<void> {
    throw new Error("Implement Me!")
  }
}