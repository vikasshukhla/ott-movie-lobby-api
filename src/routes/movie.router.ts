import express from 'express';
import { createMovie, deleteMovie, listMovies, searchMovie, updateMovie } from '../controllers/movie.controller';

const router = express.Router();

router.get('/', listMovies);

router.post('/create', createMovie);

router.patch('/update/:id', updateMovie);

router.delete('/delete/:id', deleteMovie);

router.get('/search', searchMovie);

export default router;