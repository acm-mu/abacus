import { Database, ScanOptions } from ".";

type JSONData = Record<string, Record<string, Record<string, unknown>>>

/*
 {
   'tableName': {
      'pk': rowItem,
      'pk2': rowItem
   }
 }
*/

export default class JSONDB implements Database {
  data: JSONData;

  constructor(data: JSONData) {
    this.data = data
  }

  scan(tableName: string, options?: ScanOptions): Promise<Record<string, unknown>[] | undefined> {
    return new Promise((resolve, _reject) => {
      let tableData: Record<string, unknown>[] = Object.values(this.data[tableName])

      if (options?.args !== undefined) {
        tableData = tableData.filter((obj) => {
          for (const [key, value] of Object.entries(options.args as Record<string, unknown>)) {
            if (obj[key] !== value) return false
          }
          return true
        })
      }

      resolve(tableData)
    })
  }

  get(_tableName: string, _key: Record<string, string>): Promise<Record<string, unknown> | undefined> {
    return new Promise((_resolve, _reject) => {

      throw new Error('You called the JSON get method')
    })
  }

  put(_tableName: string, _item: Record<string, unknown>): Promise<void> {
    return new Promise((_resolve, _reject) => {

      throw new Error('You called the JSON put method')
    })
  }

  update(_tableName: string, _key: Record<string, unknown>, _args: Record<string, unknown>): Promise<void> {
    return new Promise((_resolve, _reject) => {

      throw new Error('You called the JSON update method')
    })
  }

  delete(_tableName: string, _key: Record<string, unknown>): Promise<void> {
    return new Promise((_resolve, _reject) => {

      throw new Error('You called the JSON delete method')
    })
  }
}