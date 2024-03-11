import { listMovies, createMovie, updateMovie, deleteMovie, searchMovie } from '../../../src/controllers/movie.controller';
import { Request, Response } from 'express';
import MovieModel from '../../../src/models/movie.model';

jest.mock('../../../src/models/movie.model'); // Mocking the MovieModel module

describe('listMovies', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return list of movies', async () => {
        const movies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
        (MovieModel.find as jest.Mock).mockResolvedValueOnce(movies);

        await listMovies(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(movies);
        expect(MovieModel.find).toHaveBeenCalledTimes(1);
    });

    it('should handle error', async () => {
        const errorMessage = 'Internal server error';
        (MovieModel.find as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        await listMovies(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});

describe('createMovie', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                title: 'Sample Movie',
                genre: 'Action',
                rating: '7',
                streamingLink: 'https://example.com/sample-movie'
            }
        };
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        res = { status: mockStatus } as Partial<Response>;
    });

    it('should create a new movie', async () => {
        const savedMovie = {
            _id: 'mock-id',
            title: 'Sample Movie',
            genre: 'Action',
            rating: '7',
            streamingLink: 'https://example.com/sample-movie'
        };
        const mockSave = jest.fn().mockResolvedValue(savedMovie);
        const mockMovieModel = jest.spyOn(MovieModel.prototype, 'save').mockImplementation(mockSave);

        await createMovie(req as Request, res as Response);

        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith(savedMovie);

        mockMovieModel.mockRestore();
    });

    it('should handle missing required fields', async () => {
        const missingFieldsReq = {
            body: {
            }
        };
        await createMovie(missingFieldsReq as Request, res as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'All fields are required - title/genre/rating/streamingLink' });
    });

    it('should handle internal server error', async () => {
        const mockSave = jest.fn().mockRejectedValue(new Error('Mock error'));
        jest.spyOn(MovieModel.prototype, 'save').mockImplementation(mockSave);

        await createMovie(req as Request, res as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('updateMovie', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;
    let mockMovieModelFindById: jest.SpyInstance;

    beforeEach(() => {
        req = {
            params: { id: 'mock-id' },
            body: {
                title: 'Updated Movie',
                genre: 'Action',
                rating: '7',
                streamingLink: 'https://example.com/updated-movie'
            }
        };
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        res = { status: mockStatus, json: mockJson } as Partial<Response>;

        mockMovieModelFindById = jest.spyOn(MovieModel, 'findById').mockResolvedValue({
            _id: 'mock-id',
            title: 'Sample Movie',
            genre: 'Action',
            rating: '7',
            streamingLink: 'https://example.com/sample-movie',
            save: jest.fn().mockResolvedValue({
                _id: 'mock-id',
                title: 'Updated Movie',
                genre: 'Action',
                rating: '7',
                streamingLink: 'https://example.com/updated-movie'
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update an existing movie', async () => {
        await updateMovie(req as Request, res as Response);

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
            _id: 'mock-id',
            title: 'Updated Movie',
            genre: 'Action',
            rating: '7',
            streamingLink: 'https://example.com/updated-movie'
        });
    });

    it('should handle movie not found', async () => {
        mockMovieModelFindById.mockResolvedValueOnce(null);

        await updateMovie(req as Request, res as Response);

        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Movie not found' });
    });

    it('should handle internal server error', async () => {
        mockMovieModelFindById.mockRejectedValueOnce(new Error('Mock error'));

        await updateMovie(req as Request, res as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('deleteMovie', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = { params: { id: 'mock-id' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a movie and return success message', async () => {
        // Mock MovieModel.findByIdAndDelete to return a deleted movie
        const mockDeletedMovie = { _id: 'mock-id', title: 'Mock Movie' };
        jest.spyOn(MovieModel, 'findByIdAndDelete').mockResolvedValueOnce(mockDeletedMovie);

        await deleteMovie(req as Request, res as Response);

        expect(MovieModel.findByIdAndDelete).toHaveBeenCalledWith('mock-id');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Movie deleted successfully' });
    });

    it('should return 404 if movie not found', async () => {
        // Mock MovieModel.findByIdAndDelete to return null (movie not found)
        jest.spyOn(MovieModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

        await deleteMovie(req as Request, res as Response);

        expect(MovieModel.findByIdAndDelete).toHaveBeenCalledWith('mock-id');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Movie not found' });
    });

    it('should return 500 if an error occurs', async () => {
        // Mock MovieModel.findByIdAndDelete to throw an error
        jest.spyOn(MovieModel, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Database error'));

        await deleteMovie(req as Request, res as Response);

        expect(MovieModel.findByIdAndDelete).toHaveBeenCalledWith('mock-id');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('searchMovie', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = { query: { q: 'mock-query' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should search movies by title or genre and return the results', async () => {
        // Mock MovieModel.find to return a list of movies
        const mockMovies = [
            { _id: '1', title: 'Movie 1', genre: 'Action', rating: 4.5, streamingLink: 'link1' },
            { _id: '2', title: 'Movie 2', genre: 'Comedy', rating: 3.8, streamingLink: 'link2' },
        ];
        jest.spyOn(MovieModel, 'find').mockResolvedValueOnce(mockMovies);

        await searchMovie(req as Request, res as Response);

        expect(MovieModel.find).toHaveBeenCalledWith({
            $or: [
                { title: { $regex: 'mock-query', $options: 'i' } },
                { genre: { $regex: 'mock-query', $options: 'i' } }
            ]
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockMovies);
    });

    it('should return 500 if an error occurs', async () => {
        // Mock MovieModel.find to throw an error
        jest.spyOn(MovieModel, 'find').mockRejectedValueOnce(new Error('Database error'));

        await searchMovie(req as Request, res as Response);

        expect(MovieModel.find).toHaveBeenCalledWith({
            $or: [
                { title: { $regex: 'mock-query', $options: 'i' } },
                { genre: { $regex: 'mock-query', $options: 'i' } }
            ]
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});