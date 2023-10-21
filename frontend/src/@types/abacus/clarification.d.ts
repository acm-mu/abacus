declare module 'abacus' {
  export interface IClarification {
    cid: string
    body: string
    user: IUser
    date: number
    parent?: string
    division?: string
    type?: string
    title?: string
    children: IClarification[]
    open?: boolean
    context?: IContext
  }

  export interface IClarificationRequest {
    cid: string
    body: string
    user: User
    date: number
    parent?: string
    division?: string
    type?: string
    title?: string
    children: IClarification[]
    open?: boolean
    context?: IContext
  }
}