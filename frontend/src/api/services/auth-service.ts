import type { User } from "abacus"
import { HttpClient, transform } from 'api'

export default class AuthService extends HttpClient {
  async checkAuth() {
    const instance = this.createInstance()

    return await instance.get('auth')
      .then(resp => transform<User>(resp))
  }

  async login(username: string, password: string) {
    const instance = this.createInstance()

    return await instance.post('auth', { username, password })
      .then(resp => transform<User>(resp))
  }
}