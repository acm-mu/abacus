import express from "express";
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authlib from './authlib'
import contest from "./api/contest";
import problems from "./api/problems";
import standings from "./api/standings";
import submissions from "./api/submissions";
import users from "./api/users";

const PORT = process.env.PORT || 80;

const app = express();
const server = createServer(app);
new Server(server, { serveClient: false });

app.use(cors()); // Enables CORS on all endpoints
app.use(bodyParser.json()); // Middleware to parse body of requests as JSON
app.use(fileUpload()); // Middleware for uploading files to express (accessible in req.files)
app.use(morgan('dev'));

app.use(contest, users, submissions, problems, standings, authlib);
app.get('/', (_, res) => res.status(200).send(' ')); // Sends 200 OK when AWS EBS pings server for health check

server.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`);
});
