// movie.controller.ts
import { Request, Response } from 'express';
import MovieModel, { Movie } from '../models/movie.model';
import { ResponseObject } from '../types/type';

/**
 * @param req 
 * @param res 
 * @returns list of all movies
 */
export const listMovies = async (req: Request, res: Response): Promise<ResponseObject> => {
  try {
    const movies: ResponseObject[] = await MovieModel.find();
    return res.json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @param req 
 * @param res 
 * @returns created movie from Mongo
 */
export const createMovie = async (req: Request, res: Response): Promise<ResponseObject> => {
  let savedMovie!: ResponseObject;
  try {
    const { title, genre, rating, streamingLink } = req.body;

    if (!title || !genre || !rating || !streamingLink) {
      return res.status(400).json({ error: 'All fields are required - title/genre/rating/streamingLink' });
    }

    const newMovie: Movie = new MovieModel({
      title,
      genre,
      rating,
      streamingLink
    });

    savedMovie = await newMovie.save();
    return res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Using PATCH instead for PUT as it fits more with the requirement
 * @param req movie fields to be updated
 * @param res 
 * @returns updated movie
 */
export const updateMovie = async (req: Request, res: Response): Promise<ResponseObject> => {
  try {
    const { id } = req.params;
    const { title, genre, rating, streamingLink } = req.body;

    console.log(id);
    // Check if movie exists
    const existingMovie = await MovieModel.findById(id);
    if (!existingMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Update movie details
    existingMovie.title = title || existingMovie.title;
    existingMovie.genre = genre || existingMovie.genre;
    existingMovie.rating = rating || existingMovie.rating;
    existingMovie.streamingLink = streamingLink || existingMovie.streamingLink;

    // Save the updated movie
    const updatedMovie: ResponseObject = await existingMovie.save();

    return res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 
 * @param req id of the movie
 * @param res 
 * @returns messsage on successful deletion
 */
export const deleteMovie = async (req: Request, res: Response): Promise<ResponseObject> => {
  try {
    const { id } = req.params;

    // Delete the movie
    const deletedMovie = await MovieModel.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    return res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 
 * @param req query param 
 * @param res 
 * @returns the list of fetch movie based on params
 */
export const searchMovie = async (req: Request, res: Response): Promise<ResponseObject> => {
  try {
    const { q } = req.query;

    // Search movies by title or genre
    const movies: ResponseObject = await MovieModel.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } }
      ]
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}