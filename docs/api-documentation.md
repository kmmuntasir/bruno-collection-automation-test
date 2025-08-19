# Mini Task Manager API Documentation

## Overview

The Mini Task Manager is a RESTful API service built with Express.js that provides user authentication and task management functionality. It uses JWT for authentication and an in-memory JSON store for persistence.

**Base URL**: `http://localhost:3000`

---

## Authentication

All task-related endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Data Models

### User
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2025-08-19T10:00:00Z"
}
```

### Task
```json
{
  "id": "uuid",
  "userId": "uuid-of-owner",
  "title": "Buy milk",
  "description": "2% fat",
  "status": "pending",
  "createdAt": "2025-08-19T10:00:00Z",
  "updatedAt": "2025-08-19T10:00:00Z"
}
```

---

## Endpoints

### Health Check

#### [HC001] Get Health Status
**GET** `/health`

Returns the API health status.

**Request**
- No authentication required
- No parameters

**Response: 200 OK**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-19T11:13:17.000Z",
  "uptime": 123.456
}
```

---

## Authentication Endpoints

### [AUTH001] Register User
**POST** `/auth/register`

Register a new user account.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Validation Rules**
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Response: 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "createdAt": "2025-08-19T10:00:00.000Z"
}
```

**Error Responses**

**422 Unprocessable Entity** - Validation errors
```json
{
  "error": "Email and password are required"
}
```
```json
{
  "error": "Please provide a valid email address"
}
```
```json
{
  "error": "Password must be at least 6 characters long"
}
```

**409 Conflict** - Email already exists
```json
{
  "error": "User with this email already exists"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

### [AUTH002] Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Validation Rules**
- `email`: Required
- `password`: Required

**Response: 200 OK**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

**422 Unprocessable Entity** - Missing fields
```json
{
  "error": "Email and password are required"
}
```

**401 Unauthorized** - Invalid credentials
```json
{
  "error": "Invalid email or password"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## Task Management Endpoints

> **Note**: All task endpoints require authentication via JWT token in Authorization header.

### [TASK001] Create Task
**POST** `/tasks`

Create a new task for the authenticated user.

**Headers**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "Buy milk",
  "description": "2% fat milk from the store",
  "status": "pending"
}
```

**Field Requirements**
- `title`: Required, non-empty string
- `description`: Optional, string (defaults to empty string)
- `status`: Optional, must be "pending" or "done" (defaults to "pending")

**Response: 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy milk",
  "description": "2% fat milk from the store",
  "status": "pending",
  "createdAt": "2025-08-19T10:00:00.000Z",
  "updatedAt": "2025-08-19T10:00:00.000Z"
}
```

**Error Responses**

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Access denied. No token provided."
}
```

**422 Unprocessable Entity** - Validation errors
```json
{
  "error": "Title is required"
}
```
```json
{
  "error": "Status must be either \"pending\" or \"done\""
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

### [TASK002] Get All Tasks
**GET** `/tasks`

Retrieve all tasks for the authenticated user with optional status filtering.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**
- `status` (optional): Filter by status ("pending" or "done")

**Examples**
- `GET /tasks` - Get all tasks
- `GET /tasks?status=pending` - Get only pending tasks
- `GET /tasks?status=done` - Get only completed tasks

**Response: 200 OK**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy milk",
    "description": "2% fat milk from the store",
    "status": "pending",
    "createdAt": "2025-08-19T10:00:00.000Z",
    "updatedAt": "2025-08-19T10:00:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Walk the dog",
    "description": "Take Rex for a 30-minute walk",
    "status": "done",
    "createdAt": "2025-08-19T09:30:00.000Z",
    "updatedAt": "2025-08-19T10:15:00.000Z"
  }
]
```

**Note**: Tasks are sorted by creation date (newest first).

**Error Responses**

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Access denied. No token provided."
}
```

**422 Unprocessable Entity** - Invalid status filter
```json
{
  "error": "Status filter must be either \"pending\" or \"done\""
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

### [TASK003] Get Single Task
**GET** `/tasks/:id`

Retrieve a specific task by ID for the authenticated user.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters**
- `id`: Task ID (UUID)

**Example**
```
GET /tasks/550e8400-e29b-41d4-a716-446655440001
```

**Response: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy milk",
  "description": "2% fat milk from the store",
  "status": "pending",
  "createdAt": "2025-08-19T10:00:00.000Z",
  "updatedAt": "2025-08-19T10:00:00.000Z"
}
```

**Error Responses**

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Access denied. No token provided."
}
```

**404 Not Found** - Task not found or doesn't belong to user
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

### [TASK004] Update Task
**PUT** `/tasks/:id`

Update an existing task. Only the task owner can update their tasks.

**Headers**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters**
- `id`: Task ID (UUID)

**Request Body** (all fields optional for partial updates)
```json
{
  "title": "Buy organic milk",
  "description": "2% fat organic milk from Whole Foods",
  "status": "done"
}
```

**Field Validation**
- `title`: If provided, cannot be empty
- `description`: Optional, string (can be empty)
- `status`: If provided, must be "pending" or "done"

**Example**
```
PUT /tasks/550e8400-e29b-41d4-a716-446655440001
```

**Response: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy organic milk",
  "description": "2% fat organic milk from Whole Foods",
  "status": "done",
  "createdAt": "2025-08-19T10:00:00.000Z",
  "updatedAt": "2025-08-19T10:30:00.000Z"
}
```

**Error Responses**

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Access denied. No token provided."
}
```

**404 Not Found** - Task not found or doesn't belong to user
```json
{
  "error": "Task not found"
}
```

**422 Unprocessable Entity** - Validation errors
```json
{
  "error": "Title cannot be empty"
}
```
```json
{
  "error": "Status must be either \"pending\" or \"done\""
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

### [TASK005] Delete Task
**DELETE** `/tasks/:id`

Delete a task. Only the task owner can delete their tasks.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters**
- `id`: Task ID (UUID)

**Example**
```
DELETE /tasks/550e8400-e29b-41d4-a716-446655440001
```

**Response: 204 No Content**
- No response body
- HTTP status 204 indicates successful deletion

**Error Responses**

**401 Unauthorized** - Invalid or missing token
```json
{
  "error": "Access denied. No token provided."
}
```

**404 Not Found** - Task not found or doesn't belong to user
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## Global Error Responses

### 404 Not Found
Any undefined endpoint will return:
```json
{
  "error": "Endpoint not found"
}
```

### 401 Unauthorized - Authentication Errors
```json
{
  "error": "Access denied. No token provided."
}
```
```json
{
  "error": "Invalid token."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

In development mode, additional error details may be included:
```json
{
  "error": "Internal server error",
  "details": "Detailed error message"
}
```

---

## Status Codes Summary

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT operations |
| 201 | Created | Successful POST operations (user, task creation) |
| 204 | No Content | Successful DELETE operations |
| 401 | Unauthorized | Authentication failures, invalid tokens |
| 404 | Not Found | Resource not found or access denied |
| 409 | Conflict | Resource already exists (duplicate email) |
| 422 | Unprocessable Entity | Validation errors, malformed requests |
| 500 | Internal Server Error | Server-side errors |

---

## Authentication Flow Example

1. **Register a new user**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Login to get JWT token**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Use token for authenticated requests**
   ```bash
   curl -X GET http://localhost:3000/tasks \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

---

## Rate Limiting

Currently, there are no rate limiting mechanisms implemented. This may be added in future versions.

---

## CORS

The API includes CORS headers for development purposes, allowing cross-origin requests from any domain (`*`).

---

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `JWT_SECRET`: Secret key for JWT token generation

---

## Testing Notes

- The API uses an in-memory JSON store that persists data to disk
- Data survives server restarts but can be reset by clearing the database file
- All timestamps are in ISO 8601 format (UTC)
- UUIDs are generated using the uuid v4 standard
- Passwords are hashed using bcrypt

---

*Last updated: 2025-08-19*
