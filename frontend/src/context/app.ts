import type { ISettings, IUser } from 'abacus'
import { createContext, Dispatch, SetStateAction } from 'react'

export interface AppContextType {
  user?: IUser
  setUser: Dispatch<SetStateAction<IUser | undefined>>
  settings?: ISettings
}

const AppContext = createContext<AppContextType>({
  user: undefined,
  setUser: () => {
    return
  },
  settings: undefined
})

export default AppContext
