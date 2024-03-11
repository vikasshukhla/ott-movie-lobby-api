import { Request, Response } from 'express';
import MovieModel from '../models/movie.model';

export const listMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await MovieModel.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
