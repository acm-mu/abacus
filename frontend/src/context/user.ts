import { createContext } from 'react'
import { UserType } from '../types'

const UserContext = createContext<{ user: UserType | undefined; setUser: (user: UserType | undefined) => void }>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user: undefined, setUser: (_user: UserType | undefined) => { ; }
})

const reloadFromLocalStorage = (): UserType | undefined => {
  const tempUser = localStorage.getItem('user')
  if (tempUser)
    return JSON.parse(tempUser)
  return undefined
}

const saveToLocalStorage = (user: UserType | undefined): void => {
  if (user)
    localStorage.setItem('user', JSON.stringify(user))
  else
    localStorage.removeItem('user')
}

export { UserContext, reloadFromLocalStorage, saveToLocalStorage }