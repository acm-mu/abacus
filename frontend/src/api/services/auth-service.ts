import type { IUser } from "abacus"
import { HttpClient, transform, transformAndApply } from 'api'

type AuthResponse = {
  accessToken: string
  user: IUser
}

export default class AuthService extends HttpClient {
  async checkAuth() {
    const instance = this.createInstance()

    return await instance.get('auth')
      .then(resp => transform<IUser>(resp))
  }

  async login(username: string, password: string) {
    const instance = this.createInstance()

    const applyFunc = async ({ accessToken, ...user }: any): Promise<AuthResponse> => ({
      user,
      accessToken
    })

    return await instance.post('auth', { username, password })
      .then(transformAndApply(applyFunc))
  }
}