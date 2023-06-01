import { Submission, Notification } from 'abacus'
import { createContext } from 'react'
import { Socket } from 'socket.io-client'

interface ClientToServerEvents {
  notification: (notification: Notification) => void
  new_submission: (submission: Submission) => void
  new_clarification: () => void;
  update_submission: (submission: Submission) => void
  delete_submission: (submission: Submission) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServerToClientEvents {}

const SocketContext = createContext<Socket<ClientToServerEvents, ServerToClientEvents> | undefined>(undefined)

export default SocketContext
