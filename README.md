## API Setup
  API for a movie lobby for OTT applications

Steps to set up API and run on local
- clone the git repository
- downlaod and copy the .env file provided in email to root folder

from the root folder, run the following script
- npm i
- npm run build
- npm start

Steps to run unit test and itegration test
from the root folder, run the following script
- npm run test

# Movie Lobby API

This API allows users to interact with a collection of movies, including listing all movies, searching for movies, adding new movies, updating existing movie information, and deleting movies.

## Endpoints

### List all movies
Retrieves a list of all movies in the lobby.

### Search for a movie
Searches for a movie by title or genre. The `q` query parameter should contain the search query.

### Add a new movie
Adds a new movie to the lobby. Requires the "admin" role.

### Update an existing movie
Updates an existing movie's information (title, genre, rating, or streaming link). Requires the "admin" role.

### Delete a movie
Deletes a movie from the lobby. Requires the "admin" role.

## Authentication
Some endpoints require authentication with a JWT token. To authenticate, include a valid JWT token in the request headers with the key "Authorization".

## Sample Requests

### List all movies
```http
GET /movies
```
### login to generate JWT for admin user
```http
POST /login
Content-Type: application/json

{
  "username": "admin"
}
```

### Search Movie
```http
GET /search?q=action
```

### Create Movie
```http
POST /movies
Content-Type: application/json

{
  "title": "New Movie",
  "genre": "Action",
  "rating": "8.5",
  "streamingLink": "https://example.com/movie"
}
```

### Update Movie
```http
PATCH /movies/123
Content-Type: application/json

{
  "title": "Updated Movie Title"
}
```
### Delete Movie
```http
DELETE /movies/123
```










