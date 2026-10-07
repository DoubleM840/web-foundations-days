# Library Books API Design

A RESTful API for managing a library's book collection. All endpoints return JSON and require authentication via `Authorization: Bearer <token>` header.

## Endpoints

### List All Books
- Method: GET
- Path: /api/books
- Description: Returns a paginated list of all books in the library.
- Query Parameters: ?page=1&limit=20, ?author=Tolkien (filter by author name)
- Success Status: 200 OK
- Response Example:
[
  {
    "id": 1,
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "isbn": "978-0547928227",
    "year": 1937,
    "available": true
  }
]

### Get Single Book
- Method: GET
- Path: /api/books/{id}
- Description: Returns detailed information for a specific book by its ID.
- Success Status: 200 OK
- Response Example:
{
  "id": 42,
  "title": "Dune",
  "author": "Frank Herbert",
  "isbn": "978-0441172719",
  "year": 1965,
  "available": false
}

### Create New Book
- Method: POST
- Path: /api/books
- Description: Adds a new book to the library catalog.
- Request Body:
{
  "title": "Dune",
  "author": "Frank Herbert",
  "isbn": "978-0441172719",
  "year": 1965
}
- Success Status: 201 Created

### Update Book (Full Replace)
- Method: PUT
- Path: /api/books/{id}
- Description: Completely replaces an existing book's data. All fields required.
- Request Body: Same structure as POST
- Success Status: 200 OK

### Partially Update Book
- Method: PATCH
- Path: /api/books/{id}
- Description: Updates only specified fields of an existing book.
- Request Body:
{
  "available": false
}
- Success Status: 200 OK

### Delete Book
- Method: DELETE
- Path: /api/books/{id}
- Description: Permanently removes a book from the catalog.
- Success Status: 204 No Content

### List Books by Author
- Method: GET
- Path: /api/books?author={name}
- Description: Filters books by exact or partial author name match.
- Example: GET /api/books?author=Tolkien
- Success Status: 200 OK

## Error Codes

### 400 Bad Request
Returned when the request body is malformed or missing required fields.
- Example: Sending a POST to /api/books without a title field, or providing an invalid ISBN format.
- Response Example:
{
  "error": "Bad Request",
  "message": "Field 'title' is required"
}

### 404 Not Found
Returned when the requested resource does not exist.
- Example: GET /api/books/9999 when no book with ID 9999 exists in the database.
- Response Example:
{
  "error": "Not Found",
  "message": "Book with id 9999 does not exist"
}