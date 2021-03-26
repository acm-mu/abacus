import { Settings, User } from 'abacus';
import { createContext } from 'react';

export interface AppContextType {
  user?: User;
  setUser: (user: User | undefined) => void;
  socket?: SocketIOClient.Socket;
  settings?: Settings;
}

const AppContext = createContext<AppContextType>({
  user: undefined,
  setUser: (user: User | undefined) => { console.log(user); return },
  settings: undefined,
  socket: undefined
})

export default AppContext
