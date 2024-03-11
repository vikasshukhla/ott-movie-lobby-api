// movie.router.ts
import express from 'express';
import { createMovie, deleteMovie, listMovies, searchMovie, updateMovie } from '../controllers/movie.controller';
import { authenticateJwt, isAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', listMovies);

router.post('/create', authenticateJwt, isAdmin, createMovie);

router.patch('/update/:id', authenticateJwt, isAdmin, updateMovie);

router.delete('/delete/:id', authenticateJwt, isAdmin,  deleteMovie);

router.get('/search', searchMovie);

export default router;