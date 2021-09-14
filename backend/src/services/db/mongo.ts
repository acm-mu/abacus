import { Database } from "."
import { Item, Key, ScanOptions } from "./database"

export default class MongoDB extends Database {

  scan(TableName: string, query?: ScanOptions): Promise<Item[]> {
    throw new Error("Implement Me!")
  }

  get(TableName: string, Key: Key): Promise<Item> {
    throw new Error("Implement Me!")
  }

  put(TableName: string, Item: Item): Promise<Item> {
    throw new Error("Implement Me!")
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    throw new Error("Implement Me!")
  }

  delete(TableName: string, Key: Key): Promise<void> {
    throw new Error("Implement Me!")
  }

  batchWrite(tableName: string, PutItems: Record<string, any>[]): Promise<void> {
    throw new Error("Implement Me!")
  }
}