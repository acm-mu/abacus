import { Args, Item, Items } from 'abacus'
import type { ApiOptions } from "../../api";

export type Key = Record<string, unknown>
export type ScanOptions = {
  args?: Args
  columns?: string[]
}

export default abstract class Database {
  protected constructor() {
    if (this.constructor == Database) {
      throw new Error('Object of Abstract Class cannot be created')
    }
  }

  abstract scan(TableName: string, query?: ScanOptions, options?: ApiOptions): Promise<Items>

  abstract get(TableName: string, Key: Key): Promise<Item | undefined | null>

  abstract put(TableName: string, Item: Item): Promise<void>

  abstract update(TableName: string, Key: Key, Item: Item): Promise<void>

  abstract delete(TableName: string, Key: Key): Promise<void>
}
