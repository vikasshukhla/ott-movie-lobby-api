import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import movieRouter from './routes/movie.router';

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://vikasshukhla:qeVcbyLbDdrVOZYh@test-movie-db.6j6rd4s.mongodb.net/?retryWrites=true&w=majority&appName=test-movie-db")
    .then(() => console.log("Database Connected"))
    .catch((err: any) => console.log(err));

app.use('/movies', movieRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});