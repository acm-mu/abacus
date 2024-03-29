import { Args, Item } from 'abacus'

export type Key = Record<string, string>
export type ScanOptions = {
  args?: Args
  columns?: string[]
}

export default abstract class Database {
  constructor() {
    if (this.constructor == Database) {
      throw new Error('Object of Abstract Class cannot be created')
    }
  }

  abstract scan(TableName: string, query?: ScanOptions, page?: number): Promise<Item[]>

  abstract get(TableName: string, Key: Key): Promise<Item>

  abstract put(TableName: string, Item: Item): Promise<Item>

  abstract update(TableName: string, Key: Key, Item: Item): Promise<Item>

  abstract delete(TableName: string, Key: Key): Promise<void>

  abstract count(TableName: string, query?: ScanOptions): Promise<number>
}
