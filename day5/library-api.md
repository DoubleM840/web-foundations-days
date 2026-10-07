# Library Books API Design

A RESTful API for managing a library's book collection. All endpoints return JSON and require authentication via `Authorization: Bearer <token>` header.

## Endpoints

### List All Books
- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Returns a paginated list of all books in the library.
- **Query Parameters:** `?page=1&limit=20`, `?author=Tolkien` (filter by author name)
- **Success Status:** `200 OK`
- **Response Example:**
```json
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