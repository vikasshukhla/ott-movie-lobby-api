// server.ts
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import movieRouter from './routes/movie.router';
import loginRouter from './routes/login.router';
import dotenv from 'dotenv';
dotenv.config();

export const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTION_STRING as string)
  .then(() => console.log("Database Connected"))
  .catch((err: any) => console.log(err));

app.use('/movies', movieRouter);
app.use('/', loginRouter);

const PORT: number = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});