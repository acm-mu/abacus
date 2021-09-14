export type Item = Record<string, any>
export type Key = Record<string, string>
export type ScanOptions = {
  args?: Record<string, any>,
  columns?: string[]
}

export default abstract class Database {
  constructor() {
    if (this.constructor == Database) {
      throw new Error("Object of Abstract Class cannot be created")
    }
  }

  abstract scan(TableName: string, query?: ScanOptions): Promise<Item[]>;

  abstract get(TableName: string, Key: Key): Promise<Item>;

  abstract put(TableName: string, Item: Item): Promise<Item>;

  abstract update(TableName: string, Key: Key, Item: Item): Promise<Item>;

  abstract delete(TableName: string, Key: Key): Promise<void>;
}