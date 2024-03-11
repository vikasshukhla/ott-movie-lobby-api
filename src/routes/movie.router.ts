import express from 'express';
import { listMovies } from '../controllers/movie.controller';

const router = express.Router();

router.get('/', listMovies);
// Define other routes here

export default router;