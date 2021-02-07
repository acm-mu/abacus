import { useState } from "react"
import config from './environment'
import { UserType } from "./types"

const isAuthenticated = (): boolean => {
  const { username, session_token } = localStorage
  // If any of them are undefined
  if (!(username && session_token)) return false

  const [state, setState] = useState(false)

  const formData = new FormData()
  formData.set('username', username)
  formData.set('session_token', session_token)

  fetch(`${config.API_URL}/auth`, {
    method: 'POST',
    body: formData
  })
    .then(res => setState(res.status == 200))

  return state
}

const authenticate = async (username: string, password: string): Promise<UserType | null> => {
  const formData = new FormData()
  formData.set('username', username)
  formData.set('password', password)

  const res = await fetch(`${config.API_URL}/auth`, {
    method: 'POST',
    body: formData
  })
  if (res.status != 200) return null

  const user: UserType = await res.json()
  localStorage.setItem('username', user.username)
  localStorage.setItem('session_token', user.session_token)
  return user

}

export { isAuthenticated, authenticate }