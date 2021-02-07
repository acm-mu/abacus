import express from "express";
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cors from 'cors'
import api from './api'
import authlib from './authlib'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app)
new Server(server, {
  serveClient: false
})
const PORT = process.env.PORT || 80;

app.use(cors())
app.use(fileUpload())
app.use(morgan('dev'))

app.get('/', (_, res) => res.status(200).send(' '))
app.use(api, authlib)

server.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`);
});
