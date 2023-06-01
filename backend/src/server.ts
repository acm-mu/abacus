import { Notification } from 'abacus'
import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import { createServer } from 'http'
import morgan from 'morgan'
import { Server, Socket } from 'socket.io'
import { createAdapter } from 'socket.io-redis'
import { RedisClient } from 'redis'
import { v4 as uuidv4 } from 'uuid'
import api from './api'
import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 80

const app = express()
const server = createServer(app)
export const io = new Server(server, {
  serveClient: false,
  cors: {
    origin: '*'
  },
  transports: ['websocket']
})

if (process.env.REDIS_HOST) {
  const { REDIS_HOST: host, REDIS_PASS: auth_pass } = process.env

  const pubClient = new RedisClient({ host, port: 6379, auth_pass })
  const subClient = pubClient.duplicate()

  io.adapter(createAdapter({ pubClient, subClient }))
}

// Enable CORS on all endpoints.
app.use(cors())

// Middleware to parse body of requests as JSON.
app.use(express.json())

// Middleware for uploading files to express(accessible in req.files)
// By default, useTempFiles is 'False', uploaded files will be loaded into RAM.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))
}

app.use(api)

export function sendNotification({ header, to, content, type, context }: Notification): void {
  io.sockets.emit('notification', { id: uuidv4(), to, header, content, type, context })
}

io.on('connection', (socket: Socket) => {
  socket.on('broadcast', ({ ev, args }) => {
    io.sockets.emit(ev, args)
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`)
})
