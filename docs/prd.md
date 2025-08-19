# Mini Task Manager - Backend API (PRD)

> **Note**: This is a **backend-only** repository containing the API service and related configurations. There is no frontend implementation included.

## 1. Overview
The Mini Task Manager is a lightweight **backend-only** API service built with **Express.js** and an **in-memory JSON store**.  
It is designed to demonstrate and test API workflows with JWT authentication, CRUD operations, query params, path params, and error handling.  

This project serves as a **sandbox for API testing with Bruno** (and potential migration from Postman), focusing solely on the backend implementation.

---

## 2. Objectives
- Provide a small but complete API system with authentication and CRUD.
- Ensure coverage of common API interaction patterns:
  - Authentication flow (register → login → authorized actions).
  - Create, read, update, delete (CRUD) operations.
  - Query params, path params, and headers.
  - Error and edge cases.
- Be easy to set up, run, and reset (no external DB dependency).

---

## 3. Users & Roles
- **Anonymous User**
  - Can register (`/auth/register`).
  - Can login (`/auth/login`).
- **Authenticated User**
  - Must provide a valid JWT.
  - Can manage their own tasks (CRUD).
  - Cannot access or modify another user’s tasks.

---

## 4. Functional Requirements

### 4.1 Authentication
- **POST /auth/register**
  - Request: `{ "email": "user@example.com", "password": "secret" }`
  - Response: 201 Created, user object without password.
  - Error: 409 Conflict if email already exists.

- **POST /auth/login**
  - Request: `{ "email": "user@example.com", "password": "secret" }`
  - Response: 200 OK, `{ "token": "<jwt>" }`
  - Error: 401 Unauthorized if invalid credentials.

---

### 4.2 Tasks
- **POST /tasks**
  - Create a new task.
  - Request: `{ "title": "Buy milk", "description": "2% fat", "status": "pending" }`
  - Response: 201 Created, task object with auto-generated `id` and timestamps.

- **GET /tasks**
  - List all tasks of the authenticated user.
  - Optional query param: `?status=pending|done`
  - Response: 200 OK, array of task objects.

- **GET /tasks/:id**
  - Fetch a single task by ID.
  - Response: 200 OK, task object.
  - Error: 404 Not Found if ID does not exist or belongs to another user.

- **PUT /tasks/:id**
  - Update a task (title, description, status).
  - Request: partial or full task object.
  - Response: 200 OK, updated task.
  - Error: 403 Forbidden if not owner; 404 Not Found if ID doesn’t exist.

- **DELETE /tasks/:id**
  - Delete a task.
  - Response: 204 No Content.
  - Error: 403 Forbidden if not owner; 404 Not Found if ID doesn’t exist.

---

## 5. Non-Functional Requirements
- **Tech stack**: Node.js (Express), persistent JSON file store (e.g., `lowdb` with file adapter).
- **Authentication**: JWT (HMAC secret).
- **Error Handling**: Consistent error responses in JSON:  
  `{ "error": "message" }`
- **Port**: 3000 (default).
- **Stateful**: Data persists to local JSON file, survives process restarts.

---

## 6. Example Entities

### 6.1 User
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "passwordHash": "hashedSecret"
}
```

### 6.2 Task
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

## 7. API Error Cases to Cover

- Invalid or missing JWT → `401 Unauthorized`.
- Trying to access another user’s task → `403 Forbidden`.
- Invalid payload (e.g., missing title) → `422 Unprocessable Entity`.
- Non-existent resource → `404 Not Found`.

---

## 8. Acceptance Criteria (Backend Only)
- **User Authentication**
  - New users can register successfully via API
  - Registered users can authenticate and receive a valid JWT token

- **Task Management**
  - Authenticated users can perform CRUD operations on their tasks via API
  - API supports query parameters for task filtering (e.g., `?status=done`)
  - All operations properly validate user permissions

- **Error Handling**
  - Consistent error responses across all API endpoints
  - Errors are properly formatted in JSON and include appropriate HTTP status codes
  - All documented error cases are properly handled

- **Setup & Dependencies**
  ```bash
  # Install dependencies
  npm install
  
  # Start the backend server
  npm start
  ```
  - No external database required (uses in-memory storage with file persistence)
  - Environment variables can be configured via `.env` file

---

## 9. Future Extensions (Optional)

- Task due dates and sorting.
- User roles (admin to see all tasks).
- Rate limiting (to test 429 errors).
- Refresh tokens and logout flow.