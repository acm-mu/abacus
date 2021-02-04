import express from "express";
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import api from './v1'

const app = express();
const PORT = process.env.PORT || 80;

app.use(fileUpload())
app.use(morgan('dev'))

app.get('/', (_, res) => res.status(200))
app.use('/v1', api)

app.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`);
});
