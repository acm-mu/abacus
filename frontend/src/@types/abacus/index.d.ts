declare module 'abacus' {
  export interface IContext {
    type: 'pid' | 'cid' | 'sid'
    id: string
  }

  export interface INotification {
    header?: string
    to?: string
    content: string
    id: string
    context?: IContext
    type?: 'success' | 'warning' | 'error'
  }

  export interface ISettings {
    competition_name: string
    practice_name: string
    points_per_yes: number
    points_per_no: number
    points_per_compilation_error: number
    points_per_minute: number
    start_date: Date
    end_date: Date
    practice_start_date: Date
    practice_end_date: Date
  }

  export interface IArgs {
    [key: string]: unknown
  }

  export interface SortConfig<T> {
    sortBy: keyof T
    sortDirection: 'ascending' | 'descending' | undefined
  }

  export type NullablePartial<
    T,
    NK extends keyof T = { [K in keyof T]: null extends T[K] ? K : never }[keyof T],
    NP = Partial<Pick<T, NK>> & Pick<T, Exclude<keyof T, NK>>
  > = { [K in keyof NP]: NP[K] }
}