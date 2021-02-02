import express, { Request, Response } from "express";
import path from 'path'
import api from './api'

const app = express();
const PORT = process.env.PORT || 80;

app.use('/api', api)
app.use(express.static("../frontend/build"));

// Everywhere else, but '/api'
app.get(/^(?!\/api).*/, (_req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "/../frontend/build/index.html"))
);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`);
});
