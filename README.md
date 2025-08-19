# Mini Task Manager API

A lightweight backend-only API service built with **Express.js** and an **in-memory JSON store** using lowdb. This project serves as a sandbox for API testing with Bruno (and potential migration from Postman), focusing solely on the backend implementation.

## Features

- 🔐 **JWT Authentication** - User registration and login
- 📋 **Task Management** - Full CRUD operations for tasks
- 🔍 **Query Filtering** - Filter tasks by status
- 🛡️ **Authorization** - Users can only access their own tasks
- ✅ **Input Validation** - Comprehensive error handling
- 💾 **File Persistence** - Data persists to local JSON file
- 🚀 **No External Database** - Uses lowdb with file adapter

## Tech Stack

- **Backend**: Node.js + Express.js
- **Authentication**: JWT (HMAC secret)
- **Database**: lowdb with file adapter (JSON persistence)
- **Password Security**: bcrypt
- **Environment**: dotenv for configuration
- **Port**: 3000 (default)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kmmuntasir/bruno-collection-automation-test.git
   cd bruno-collection-automation-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Or create a `.env` file with:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   DB_PATH=./data/db.json
   ```

4. Start the server:
   ```bash
   # Production mode
   npm start

   # Development mode (with nodemon)
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Tasks (Protected Routes)
- `POST /tasks` - Create task
- `GET /tasks` - List tasks (with optional `?status=pending|done` filter)
- `GET /tasks/:id` - Get single task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## API Usage Examples

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2025-08-19T10:00:00Z"
}
```

### 2. Login user
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create a task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Buy milk","description":"2% fat","status":"pending"}'
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "title": "Buy milk",
  "description": "2% fat",
  "status": "pending",
  "createdAt": "2025-08-19T10:00:00Z",
  "updatedAt": "2025-08-19T10:00:00Z"
}
```

### 4. Get all tasks
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Filter tasks by status
```bash
curl -X GET "http://localhost:3000/tasks?status=pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Get single task
```bash
curl -X GET http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Update a task
```bash
curl -X PUT http://localhost:3000/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Buy organic milk","status":"done"}'
```

### 8. Delete a task
```bash
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Data Models

### User
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "passwordHash": "hashedSecret",
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

## Error Responses

The API returns consistent JSON error responses:

### Authentication Errors
- `401 Unauthorized` - Invalid or missing JWT token
- `401 Unauthorized` - Invalid credentials during login

### Authorization Errors
- `403 Forbidden` - Trying to access another user's task

### Validation Errors
- `422 Unprocessable Entity` - Invalid payload or missing required fields
- `409 Conflict` - Email already exists during registration

### Not Found Errors
- `404 Not Found` - Resource doesn't exist

### Example Error Response
```json
{
  "error": "Email and password are required"
}
```

## Project Structure

```
/
├── src/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── tasks.js         # Task CRUD routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── user.js          # User model and database operations
│   │   └── task.js          # Task model and database operations
│   └── utils/
│       ├── jwt.js           # JWT token utilities
│       ├── password.js      # Password hashing utilities
│       └── database.js      # Database initialization
├── data/
│   └── db.json              # JSON database file (auto-generated)
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── README.md
└── app.js                   # Main server file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `DB_PATH` | Database file path | `./data/db.json` |
| `NODE_ENV` | Environment mode | `development` |

## Development

### Scripts
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon for development

### Testing with Bruno
This API is designed to be tested with Bruno. Import the provided Bruno collection to test all endpoints with proper authentication flows.

## Security Notes

⚠️ **Important**: This is a development/testing API. For production use:

1. Change the default JWT secret
2. Use a proper database (PostgreSQL, MongoDB, etc.)
3. Add rate limiting
4. Implement proper logging
5. Add HTTPS support
6. Use environment-specific configurations

## License

MIT License
