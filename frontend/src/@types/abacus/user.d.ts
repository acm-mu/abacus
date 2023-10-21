declare module 'abacus' {
  export interface IUser {
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