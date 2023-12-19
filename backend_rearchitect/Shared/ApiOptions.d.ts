declare module 'abacus' {
  export interface ApiOptions {
    sortBy?: string,
    sortDirection?: 'ascending' | 'descending',
    page: number,
    pageSize?: number,
    filters?: { [key: string]: any }
  }
}