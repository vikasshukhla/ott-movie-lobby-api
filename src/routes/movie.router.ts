// movie.router.ts
import express from 'express';
import { createMovie, deleteMovie, listMovies, searchMovie, updateMovie } from '../controllers/movie.controller';
import { authenticateJwt, isAdmin } from '../middlewares/auth.middleware';

export const router = express.Router();

router.get('/', listMovies);

router.post('/', authenticateJwt, isAdmin, createMovie);

router.patch('/:id', authenticateJwt, isAdmin, updateMovie);

router.delete('/:id', authenticateJwt, isAdmin,  deleteMovie);

router.get('/search', searchMovie);

export default router;
