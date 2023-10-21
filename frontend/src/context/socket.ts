import type { INotification, ISubmission } from 'abacus'
import { createContext } from 'react'
import { Socket } from 'socket.io-client'

interface ClientToServerEvents {
  notification: (notification: INotification) => void
  new_submission: (submission: ISubmission) => void
  new_clarification: () => void;
  update_submission: (submission: ISubmission) => void
  delete_submission: (submission: ISubmission) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServerToClientEvents {}

const SocketContext = createContext<Socket<ClientToServerEvents, ServerToClientEvents> | undefined>(undefined)

export default SocketContext
