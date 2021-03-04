import bodyParser from 'body-parser'
import cors from 'cors'
import express from "express";
import fileUpload from 'express-fileupload';
import { createServer } from 'http'
import morgan from 'morgan';
import { Server } from 'socket.io'

import api from "./api";

import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 80;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  serveClient: false,
  cors: {
    origin: "*"
  }
});

app.use(cors()); // Enables CORS on all endpoints
app.use(bodyParser.json()); // Middleware to parse body of requests as JSON
app.use(fileUpload()); // Middleware for uploading files to express (accessible in req.files)
app.use(morgan('dev'));

app.use(api);
app.get('/', (_, res) => res.status(200).send(' ')); // Sends 200 OK when AWS EBS pings server for health check

io.on('connection', (socket) => {
  console.log('Client connected...')
  socket.on('ping', () => {
    socket.emit('pong')
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`);
});
