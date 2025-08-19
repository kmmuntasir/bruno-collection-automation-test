# Mini Task Manager - Project Todo List

## High Priority Tasks 🔴

- [x] **Set up project structure and package.json** with Express.js dependencies
  - Initialize npm project
  - Install express, jsonwebtoken, bcrypt, lowdb, uuid, dotenv
  - Configure basic project structure

- [x] **Configure environment variables and .env file setup**
  - Create .env file with JWT_SECRET
  - Set up environment configuration for port, database file path

- [x] **Implement JWT authentication middleware and utilities**
  - Create JWT token generation and verification functions
  - Build authentication middleware for protected routes

- [x] **Set up lowdb with file adapter for JSON data persistence**
  - Configure lowdb with file adapter
  - Initialize database structure for users and tasks

- [x] **Create user model and authentication routes**
  - POST /auth/register endpoint
  - POST /auth/login endpoint
  - User data validation and error handling

- [x] **Create task model and CRUD routes**
  - POST /tasks - Create new task
  - GET /tasks - List user's tasks
  - GET /tasks/:id - Get single task
  - PUT /tasks/:id - Update task
  - DELETE /tasks/:id - Delete task

- [x] **Implement user authorization middleware**
  - Ensure users can only access their own tasks
  - Add ownership validation for all task operations

- [x] **Create main server file (app.js/index.js)**
  - Express app configuration
  - Route mounting
  - Server startup logic

## Medium Priority Tasks 🟡

- [x] **Implement password hashing with bcrypt**
  - Hash passwords on registration
  - Compare hashed passwords on login

- [x] **Add query parameter support for task filtering**
  - Support ?status=pending|done query parameter
  - Filter tasks based on status

- [x] **Implement comprehensive error handling**
  - Consistent JSON error responses
  - Proper HTTP status codes (401, 403, 404, 422, etc.)

- [x] **Add input validation and sanitization**
  - Validate email format, password requirements
  - Sanitize task title and description inputs
  - Handle missing required fields

- [x] **Add npm scripts for start, dev, and test commands**
  - Configure package.json scripts
  - Add nodemon for development

- [x] **Test all API endpoints and error cases manually**
  - Test authentication flow
  - Test CRUD operations
  - Verify error handling and edge cases

## Low Priority Tasks 🟢

- [x] **Create README.md with setup and usage instructions**
  - Installation steps
  - API endpoint documentation
  - Example requests and responses

## API Endpoints to Implement

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Tasks (Protected Routes)
- `POST /tasks` - Create task
- `GET /tasks` - List tasks (with optional ?status filter)
- `GET /tasks/:id` - Get single task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Error Cases to Handle

- Invalid or missing JWT → `401 Unauthorized`
- Trying to access another user's task → `403 Forbidden`
- Invalid payload (e.g., missing title) → `422 Unprocessable Entity`
- Non-existent resource → `404 Not Found`
- Email already exists → `409 Conflict`

## Tech Stack

- **Backend**: Node.js + Express.js
- **Authentication**: JWT (HMAC secret)
- **Database**: lowdb with file adapter (JSON persistence)
- **Password Security**: bcrypt
- **Environment**: dotenv for configuration
- **Port**: 3000 (default)

## Project Structure
```
/
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── user.js
│   │   └── task.js
│   └── utils/
│       ├── jwt.js
│       └── database.js
├── data/
│   └── db.json
├── .env
├── .gitignore
├── package.json
├── README.md
└── app.js
```
