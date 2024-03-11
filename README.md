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

## Authentication(for create/delete/update)
These endpoints require authentication with a JWT token for admin role. To authenticate: On Postman follow below step
- Call the /login api provided in postman collection to genrate the jwt token.
- Copy the token from reponse
- while making create/delete/update call, paste the token in "Authorization" -> Bearer Token

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
{
  "Authorization": "Bearer <Token>"
}
```

### Update Movie
```http
PATCH /movies/123
Content-Type: application/json

{
  "title": "Updated Movie Title"
}
{
  "Authorization": "Bearer <Token>"
}
```
### Delete Movie
```http
DELETE /movies/123
{
  "Authorization": "Bearer <Token>"
}
```










