import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import { createServer } from 'http'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

import routes from './routes'

dotenv.config()

const PORT = 8080

const app = express()
const server = createServer(app)

app.use(cors()) // Enables CORS on all endpoints
app.use(express.json()) // Middleware to parse body of requests as JSON
app.use(fileUpload()) // Middleware for uploading files to express (accessible in req.files)

mongoose.connect('mongodb://localhost:27017/abacus')

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))
}

app.use('/v2', routes)

server.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`)
})
