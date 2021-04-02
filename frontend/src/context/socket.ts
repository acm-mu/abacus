import { createContext } from "react"

const SocketContext = createContext<SocketIOClient.Socket | undefined>(undefined)

export default SocketContext