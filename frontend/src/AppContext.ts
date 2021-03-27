import { Settings, User, Notification } from 'abacus';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface AppContextType {
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  sendNotification: (notification: Notification) => void;
  socket?: SocketIOClient.Socket;
  settings?: Settings;
}

const AppContext = createContext<AppContextType>({
  user: undefined,
  sendNotification: () => { return },
  setUser: () => { return },
  settings: undefined,
  socket: undefined
})

export default AppContext
