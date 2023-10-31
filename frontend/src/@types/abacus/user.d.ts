declare module 'abacus' {

  export interface IUserReq {
    role: string
    username: string
    password: string
    display_name: string
    division?: string
    school?: string
    disabled?: boolean
  }

  export interface IUser extends Record<string, unknown>{
    uid: string
    role: string
    username: string
    disabled?: boolean
    password: string
    display_name: string
    division?: string
    school?: string
  }
}