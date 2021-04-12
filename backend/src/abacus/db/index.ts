export { default as AWSDB } from './aws';
export { default as JSONDB } from './json';

export interface ScanOptions {
  args?: Record<string, unknown>
}

type PrimaryKey = Record<string, string>

export interface Database {
  scan: (tableName: string, options?: ScanOptions) => Promise<Record<string, unknown>[] | undefined>
  get: (tableName: string, key: PrimaryKey) => Promise<Record<string, unknown> | undefined>
  put: (tableName: string, item: Record<string, unknown>) => Promise<void>
  update: (tableName: string, key: PrimaryKey, args: Record<string, unknown>) => Promise<void>
  delete: (tableName: string, key: PrimaryKey) => Promise<void>
}