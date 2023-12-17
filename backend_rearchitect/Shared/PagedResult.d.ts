declare module 'abacus' {
  export interface PagedResult<T> {
    items: T[],
    totalItems: number,
    totalPages: number
  }
}