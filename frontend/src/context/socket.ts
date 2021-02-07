import { createContext } from 'react';
import io from 'socket.io-client';
import config from '../environment'

export const socket = io(config.API_URL)
export const SocketContext = createContext(socket)