// server.ts
import express from 'express';
import bodyParser from 'body-parser';
import movieRouter from './routes/movie.router';
import loginRouter from './routes/login.router';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use('/movies', movieRouter);
app.use('/', loginRouter);

export default app;
