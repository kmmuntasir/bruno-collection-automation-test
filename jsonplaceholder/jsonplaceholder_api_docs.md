# API Documentation: JSONPlaceholder

## Introduction

This documentation provides a comprehensive guide to using the JSONPlaceholder API, a free-to-use fake REST API that is ideal for testing, prototyping, and educational purposes. It supports all standard HTTP methods and provides a realistic set of data resources.

**Base URL**: `https://jsonplaceholder.typicode.com`

---

## Authentication

No authentication is required to use the JSONPlaceholder API. All endpoints are open and accessible.

---

## Rate Limiting

There are no formal rate limits for this API. However, it is intended for development and testing purposes, so please avoid sending excessive requests.

---

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

*   `200 OK`: The request was successful.
*   `201 Created`: The resource was successfully created (used with POST).
*   `404 Not Found`: The requested resource could not be found.
*   `500 Internal Server Error`: An unexpected server error occurred.

---

## Resources & Endpoints

The API provides the following resources:

1.  **Posts**: `/posts`
2.  **Comments**: `/comments`
3.  **Albums**: `/albums`
4.  **Photos**: `/photos`
5.  **Todos**: `/todos`
6.  **Users**: `/users`

Below are detailed examples for each resource and its endpoints.

---

### 1. Posts

A resource representing blog posts.

#### GET /posts
*   **Description**: Retrieves a list of all posts.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      },
      {
        "userId": 1,
        "id": 2,
        "title": "qui est esse",
        "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
      }
    ]
    ```

#### GET /posts/{id}
*   **Description**: Retrieves a single post by its ID.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {
      "userId": 1,
      "id": 1,
      "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    }
    ```
*   **Error Response** (`404 Not Found`):
    ```json
    {}
    ```

#### POST /posts
*   **Description**: Creates a new post.
*   **Request Body**:
    ```json
    {
      "title": "foo",
      "body": "bar",
      "userId": 1
    }
    ```
*   **Successful Response** (`201 Created`):
    ```json
    {
      "id": 101,
      "title": "foo",
      "body": "bar",
      "userId": 1
    }
    ```

#### PUT /posts/{id}
*   **Description**: Updates an existing post entirely.
*   **Request Body**:
    ```json
    {
      "id": 1,
      "title": "updated title",
      "body": "updated body",
      "userId": 1
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "title": "updated title",
      "body": "updated body",
      "userId": 1
    }
    ```

#### PATCH /posts/{id}
*   **Description**: Partially updates an existing post.
*   **Request Body**:
    ```json
    {
      "title": "patched title"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "title": "patched title",
      "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
      "userId": 1
    }
    ```

#### DELETE /posts/{id}
*   **Description**: Deletes a post.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {}
    ```

---

### 2. Comments

A resource representing comments on posts.

#### GET /comments
*   **Description**: Retrieves a list of all comments.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "postId": 1,
        "id": 1,
        "name": "id labore ex et quam laborum",
        "email": "Eliseo@gardner.biz",
        "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
      }
    ]
    ```

#### GET /comments/{id}
*   **Description**: Retrieves a single comment by its ID.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {
      "postId": 1,
      "id": 1,
      "name": "id labore ex et quam laborum",
      "email": "Eliseo@gardner.biz",
      "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
    }
    ```

#### GET /comments?postId={id}
*   **Description**: Retrieves all comments for a specific post.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "postId": 1,
        "id": 1,
        "name": "id labore ex et quam laborum",
        "email": "Eliseo@gardner.biz",
        "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
      }
    ]
    ```

#### POST /comments
*   **Description**: Creates a new comment.
*   **Request Body**:
    ```json
    {
      "postId": 1,
      "name": "Sample comment name",
      "email": "user@example.com",
      "body": "This is a sample comment body"
    }
    ```
*   **Successful Response** (`201 Created`):
    ```json
    {
      "id": 501,
      "postId": 1,
      "name": "Sample comment name",
      "email": "user@example.com",
      "body": "This is a sample comment body"
    }
    ```

#### PUT /comments/{id}
*   **Description**: Updates an existing comment entirely.
*   **Request Body**:
    ```json
    {
      "id": 1,
      "postId": 1,
      "name": "Updated comment name",
      "email": "updated@example.com",
      "body": "Updated comment body"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "postId": 1,
      "name": "Updated comment name",
      "email": "updated@example.com",
      "body": "Updated comment body"
    }
    ```

#### PATCH /comments/{id}
*   **Description**: Partially updates an existing comment.
*   **Request Body**:
    ```json
    {
      "body": "Partially updated comment body"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "postId": 1,
      "name": "id labore ex et quam laborum",
      "email": "Eliseo@gardner.biz",
      "body": "Partially updated comment body"
    }
    ```

#### DELETE /comments/{id}
*   **Description**: Deletes a comment.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {}
    ```

---

### 3. Albums

A resource representing photo albums.

#### GET /albums
*   **Description**: Retrieves a list of all albums.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "userId": 1,
        "id": 1,
        "title": "quidem molestiae enim"
      },
      {
        "userId": 1,
        "id": 2,
        "title": "sunt qui excepturi placeat culpa"
      }
    ]
    ```

#### GET /albums/{id}
*   **Description**: Retrieves a single album by its ID.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {
      "userId": 1,
      "id": 1,
      "title": "quidem molestiae enim"
    }
    ```

#### GET /albums/{id}/photos
*   **Description**: Retrieves all photos in a specific album.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "albumId": 1,
        "id": 1,
        "title": "accusamus beatae ad facilis cum similique qui sunt",
        "url": "https://via.placeholder.com/600/92c952",
        "thumbnailUrl": "https://via.placeholder.com/150/92c952"
      }
    ]
    ```

#### POST /albums
*   **Description**: Creates a new album.
*   **Request Body**:
    ```json
    {
      "userId": 1,
      "title": "New Album Title"
    }
    ```
*   **Successful Response** (`201 Created`):
    ```json
    {
      "id": 101,
      "userId": 1,
      "title": "New Album Title"
    }
    ```

#### PUT /albums/{id}
*   **Description**: Updates an existing album entirely.
*   **Request Body**:
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Updated Album Title"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Updated Album Title"
    }
    ```

#### PATCH /albums/{id}
*   **Description**: Partially updates an existing album.
*   **Request Body**:
    ```json
    {
      "title": "Patched Album Title"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Patched Album Title"
    }
    ```

#### DELETE /albums/{id}
*   **Description**: Deletes an album.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {}
    ```

---

### 4. Photos

A resource representing photos within albums.

#### GET /photos
*   **Description**: Retrieves a list of all photos.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "albumId": 1,
        "id": 1,
        "title": "accusamus beatae ad facilis cum similique qui sunt",
        "url": "https://via.placeholder.com/600/92c952",
        "thumbnailUrl": "https://via.placeholder.com/150/92c952"
      },
      {
        "albumId": 1,
        "id": 2,
        "title": "reprehenderit est deserunt velit ipsam",
        "url": "https://via.placeholder.com/600/771796",
        "thumbnailUrl": "https://via.placeholder.com/150/771796"
      }
    ]
    ```

#### GET /photos/{id}
*   **Description**: Retrieves a single photo by its ID.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {
      "albumId": 1,
      "id": 1,
      "title": "accusamus beatae ad facilis cum similique qui sunt",
      "url": "https://via.placeholder.com/600/92c952",
      "thumbnailUrl": "https://via.placeholder.com/150/92c952"
    }
    ```

#### POST /photos
*   **Description**: Creates a new photo.
*   **Request Body**:
    ```json
    {
      "albumId": 1,
      "title": "New Photo Title",
      "url": "https://via.placeholder.com/600/sample",
      "thumbnailUrl": "https://via.placeholder.com/150/sample"
    }
    ```
*   **Successful Response** (`201 Created`):
    ```json
    {
      "id": 5001,
      "albumId": 1,
      "title": "New Photo Title",
      "url": "https://via.placeholder.com/600/sample",
      "thumbnailUrl": "https://via.placeholder.com/150/sample"
    }
    ```

#### PUT /photos/{id}
*   **Description**: Updates an existing photo entirely.
*   **Request Body**:
    ```json
    {
      "id": 1,
      "albumId": 1,
      "title": "Updated Photo Title",
      "url": "https://via.placeholder.com/600/updated",
      "thumbnailUrl": "https://via.placeholder.com/150/updated"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "albumId": 1,
      "title": "Updated Photo Title",
      "url": "https://via.placeholder.com/600/updated",
      "thumbnailUrl": "https://via.placeholder.com/150/updated"
    }
    ```

#### PATCH /photos/{id}
*   **Description**: Partially updates an existing photo.
*   **Request Body**:
    ```json
    {
      "title": "Patched Photo Title"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "albumId": 1,
      "title": "Patched Photo Title",
      "url": "https://via.placeholder.com/600/92c952",
      "thumbnailUrl": "https://via.placeholder.com/150/92c952"
    }
    ```

#### DELETE /photos/{id}
*   **Description**: Deletes a photo.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {}
    ```

---

### 5. Todos

A resource representing todo items.

#### GET /todos
*   **Description**: Retrieves a list of all todos.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
      },
      {
        "userId": 1,
        "id": 2,
        "title": "quis ut nam facilis et officia qui",
        "completed": false
      }
    ]
    ```

#### GET /todos/{id}
*   **Description**: Retrieves a single todo by its ID.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {
      "userId": 1,
      "id": 1,
      "title": "delectus aut autem",
      "completed": false
    }
    ```

#### POST /todos
*   **Description**: Creates a new todo.
*   **Request Body**:
    ```json
    {
      "userId": 1,
      "title": "New Todo Item",
      "completed": false
    }
    ```
*   **Successful Response** (`201 Created`):
    ```json
    {
      "id": 201,
      "userId": 1,
      "title": "New Todo Item",
      "completed": false
    }
    ```

#### PUT /todos/{id}
*   **Description**: Updates an existing todo entirely.
*   **Request Body**:
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Updated Todo Item",
      "completed": true
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Updated Todo Item",
      "completed": true
    }
    ```

#### PATCH /todos/{id}
*   **Description**: Partially updates an existing todo.
*   **Request Body**:
    ```json
    {
      "completed": true
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "delectus aut autem",
      "completed": true
    }
    ```

#### DELETE /todos/{id}
*   **Description**: Deletes a todo.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {}
    ```

---

### 6. Users

A resource representing users.

#### GET /users
*   **Description**: Retrieves a list of all users.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "address": {
          "street": "Kulas Light",
          "suite": "Apt. 556",
          "city": "Gwenborough",
          "zipcode": "92998-3874",
          "geo": {
            "lat": "-37.3159",
            "lng": "81.1496"
          }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
          "name": "Romaguera-Crona",
          "catchPhrase": "Multi-layered client-server neural-net",
          "bs": "harness real-time e-markets"
        }
      }
    ]
    ```

#### GET /users/{id}
*   **Description**: Retrieves a single user by their ID.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }
    ```

#### GET /users/{id}/posts
*   **Description**: Retrieves all posts created by a specific user.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      }
    ]
    ```

#### GET /users/{id}/albums
*   **Description**: Retrieves all albums created by a specific user.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "userId": 1,
        "id": 1,
        "title": "quidem molestiae enim"
      }
    ]
    ```

#### GET /users/{id}/todos
*   **Description**: Retrieves all todos created by a specific user.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    [
      {
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
      }
    ]
    ```

#### POST /users
*   **Description**: Creates a new user.
*   **Request Body**:
    ```json
    {
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "suite": "Apt. 1",
        "city": "Anytown",
        "zipcode": "12345",
        "geo": {
          "lat": "40.7128",
          "lng": "-74.0060"
        }
      },
      "phone": "555-123-4567",
      "website": "johndoe.com",
      "company": {
        "name": "Doe Enterprises",
        "catchPhrase": "Innovative solutions",
        "bs": "cutting-edge technology"
      }
    }
    ```
*   **Successful Response** (`201 Created`):
    ```json
    {
      "id": 11,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "suite": "Apt. 1",
        "city": "Anytown",
        "zipcode": "12345",
        "geo": {
          "lat": "40.7128",
          "lng": "-74.0060"
        }
      },
      "phone": "555-123-4567",
      "website": "johndoe.com",
      "company": {
        "name": "Doe Enterprises",
        "catchPhrase": "Innovative solutions",
        "bs": "cutting-edge technology"
      }
    }
    ```

#### PUT /users/{id}
*   **Description**: Updates an existing user entirely.
*   **Request Body**:
    ```json
    {
      "id": 1,
      "name": "Updated Name",
      "username": "updatedusername",
      "email": "updated@example.com",
      "address": {
        "street": "Updated Street",
        "suite": "Updated Suite",
        "city": "Updated City",
        "zipcode": "54321",
        "geo": {
          "lat": "41.0000",
          "lng": "-75.0000"
        }
      },
      "phone": "555-987-6543",
      "website": "updated.com",
      "company": {
        "name": "Updated Company",
        "catchPhrase": "Updated catchphrase",
        "bs": "updated business"
      }
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "name": "Updated Name",
      "username": "updatedusername",
      "email": "updated@example.com",
      "address": {
        "street": "Updated Street",
        "suite": "Updated Suite",
        "city": "Updated City",
        "zipcode": "54321",
        "geo": {
          "lat": "41.0000",
          "lng": "-75.0000"
        }
      },
      "phone": "555-987-6543",
      "website": "updated.com",
      "company": {
        "name": "Updated Company",
        "catchPhrase": "Updated catchphrase",
        "bs": "updated business"
      }
    }
    ```

#### PATCH /users/{id}
*   **Description**: Partially updates an existing user.
*   **Request Body**:
    ```json
    {
      "email": "patched@example.com",
      "phone": "555-000-1234"
    }
    ```
*   **Successful Response** (`200 OK`):
    ```json
    {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "patched@example.com",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "555-000-1234",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }
    ```

#### DELETE /users/{id}
*   **Description**: Deletes a user.
*   **Request**: No request body is required.
*   **Successful Response** (`200 OK`):
    ```json
    {}
    ```

---

## Additional Notes

### Nested Resource Routes

JSONPlaceholder also supports accessing nested resources through these additional routes:

- `GET /posts/{id}/comments` - Get all comments for a specific post
- `GET /albums/{id}/photos` - Get all photos for a specific album
- `GET /users/{id}/posts` - Get all posts by a specific user
- `GET /users/{id}/albums` - Get all albums by a specific user
- `GET /users/{id}/todos` - Get all todos by a specific user

### Query Parameters

You can filter results using query parameters:

- `GET /comments?postId=1` - Get comments filtered by postId
- `GET /photos?albumId=1` - Get photos filtered by albumId
- `GET /posts?userId=1` - Get posts filtered by userId
- `GET /albums?userId=1` - Get albums filtered by userId
- `GET /todos?userId=1` - Get todos filtered by userId

This documentation provides comprehensive coverage of all JSONPlaceholder API resources and operations.

