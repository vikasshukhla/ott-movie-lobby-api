// movie.controller.ts
import { Request, Response } from 'express';
import MovieModel from '../models/movie.model';
import UserModel from '../models/user.model';

export const listMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await MovieModel.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMovie = async (req: Request, res: Response): Promise<any> => {
  try {
    // Extract movie details from request body
    const { title, genre, rating, streamingLink } = req.body;

    // Validate request body
    if (!title || !genre || !rating || !streamingLink) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new movie instance
    const newMovie = new MovieModel({
      title,
      genre,
      rating,
      streamingLink
    });

    // Save the new movie to the database
    const savedMovie = await newMovie.save();

    // Return success response with the saved movie details
    res.status(201).json(savedMovie);
  } catch (error) {
    // Handle any errors that occur during movie creation
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const updateMovie = async (req: Request, res: Response) => {
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
    const updatedMovie = await existingMovie.save();

    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete the movie
    const deletedMovie = await MovieModel.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchMovie = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    // Search movies by title or genre
    const movies = await MovieModel.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } }
      ]
    });

    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}