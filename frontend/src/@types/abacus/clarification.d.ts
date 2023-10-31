declare module 'abacus' {

  export interface IClarificationReq {
    body: string
    parent?: string
    division?: string
    type?: string
    children?: IClarification[]
    open?: boolean
    context?: IContext
  }

  export interface IClarification {
    cid: string
    body: string
    user: IUser
    date: number
    parent?: string
    division?: string
    type?: string
    title?: string
    children?: IClarification[]
    open?: boolean
    context?: IContext
  }

}