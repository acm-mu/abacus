import { Dispatch, SetStateAction, useState } from "react"
import config from './environment'
import { UserType } from "./types"

const useAuth = (user: UserType | undefined): [_: boolean, _: Dispatch<SetStateAction<boolean>>] => {
  const [state, setState] = useState(false)

  if (user) {
    const formData = new FormData()
    formData.set('username', user.username)
    formData.set('session_token', user.session_token)

    fetch(`${config.API_URL}/auth`, {
      method: 'POST',
      body: formData
    }).then(res => { setState(res.status == 200) })
  }

  return [state, setState]
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

export { useAuth, authenticate }