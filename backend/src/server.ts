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
    origin: 'https://abacus.cs.mu.edu', // Ensure frontend origin is allowed
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'], // Added polling as a fallback
  secure: true
})

if (process.env.REDIS_HOST) {
  try {
    const { REDIS_HOST: host, REDIS_PASS: auth_pass } = process.env
    const pubClient = new RedisClient({ host, port: 6379, auth_pass })
    const subClient = pubClient.duplicate()

    io.adapter(createAdapter({ pubClient, subClient }))
  } catch (error) {
    console.error('Redis connection failed:', error)
  }
}

app.use(cors()) 
app.use(express.json()) 
app.use(fileUpload()) 

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(api)

export function sendNotification({ header, to, content, type, context }: Notification): void {
  io.sockets.emit('notification', { id: uuidv4(), to, header, content, type, context })
}

io.on('connection', (socket: Socket) => {
  console.log('WebSocket connected:', socket.id)

  socket.on('broadcast', ({ ev, args }) => {
    io.sockets.emit(ev, args)
  })

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Server is running at https://abacus.cs.mu.edu`)
})

