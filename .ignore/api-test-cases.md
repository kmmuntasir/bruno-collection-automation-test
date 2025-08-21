# Mini Task Manager API - Test Cases

## Overview

This document contains comprehensive test cases for the Mini Task Manager API. Each test case has a unique identifier and is grouped by functionality for better organization.

**Test Case Naming Convention:**
- Group Identifier: `[GROUP_ID]`
- Test Case Identifier: `[TC_XXX]`

---

## Test Groups

1. **[TG_HEALTH]** Health Check Tests
2. **[TG_AUTH_REG]** User Registration Tests
3. **[TG_AUTH_LOGIN]** User Login Tests
4. **[TG_TASK_CREATE]** Task Creation Tests
5. **[TG_TASK_READ]** Task Retrieval Tests
6. **[TG_TASK_UPDATE]** Task Update Tests
7. **[TG_TASK_DELETE]** Task Deletion Tests
8. **[TG_AUTH_MIDDLEWARE]** Authentication Middleware Tests
9. **[TG_EDGE_CASES]** Edge Cases and Integration Tests
10. **[TG_GLOBAL_ERRORS]** Global Error Handling Tests

---

## [TG_HEALTH] Health Check Tests

### [TC_001] Successful Health Check
**Endpoint:** `GET /health`
**Description:** Verify health endpoint returns correct status
**Prerequisites:** None
**Request:**
```http
GET /health
```
**Expected Response:**
- Status Code: 200
- Body contains: `status: "healthy"`
- Body contains: `timestamp` (valid ISO date)
- Body contains: `uptime` (number)

### [TC_002] Health Check Response Format
**Endpoint:** `GET /health`
**Description:** Verify health endpoint response structure
**Prerequisites:** None
**Request:**
```http
GET /health
```
**Expected Response:**
- Content-Type: application/json
- Response time: < 100ms
- All required fields present

---

## [TG_AUTH_REG] User Registration Tests

### [TC_003] Successful User Registration
**Endpoint:** `POST /auth/register`
**Description:** Register a new user with valid data
**Prerequisites:** Email not already registered
**Request:**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 201
- Body contains: `id` (UUID format)
- Body contains: `email: "testuser@example.com"`
- Body contains: `createdAt` (ISO date)
- Body does NOT contain: `password` or `passwordHash`

### [TC_004] Registration - Missing Email
**Endpoint:** `POST /auth/register`
**Description:** Attempt registration without email
**Prerequisites:** None
**Request:**
```json
{
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Email and password are required"}`

### [TC_005] Registration - Missing Password
**Endpoint:** `POST /auth/register`
**Description:** Attempt registration without password
**Prerequisites:** None
**Request:**
```json
{
  "email": "testuser@example.com"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Email and password are required"}`

### [TC_006] Registration - Empty Request Body
**Endpoint:** `POST /auth/register`
**Description:** Attempt registration with empty body
**Prerequisites:** None
**Request:**
```json
{}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Email and password are required"}`

### [TC_007] Registration - Invalid Email Format
**Endpoint:** `POST /auth/register`
**Description:** Attempt registration with invalid email
**Prerequisites:** None
**Request:**
```json
{
  "email": "invalid-email",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Please provide a valid email address"}`

### [TC_008] Registration - Email Without Domain
**Endpoint:** `POST /auth/register`
**Description:** Attempt registration with incomplete email
**Prerequisites:** None
**Request:**
```json
{
  "email": "user@",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Please provide a valid email address"}`

### [TC_009] Registration - Password Too Short
**Endpoint:** `POST /auth/register`
**Description:** Attempt registration with password < 6 characters
**Prerequisites:** None
**Request:**
```json
{
  "email": "testuser@example.com",
  "password": "12345"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Password must be at least 6 characters long"}`

### [TC_010] Registration - Duplicate Email
**Endpoint:** `POST /auth/register`
**Description:** Attempt registration with existing email
**Prerequisites:** User with email already exists
**Request:**
```json
{
  "email": "existing@example.com",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 409
- Body: `{"error": "User with this email already exists"}`

### [TC_011] Registration - Email Case Sensitivity
**Endpoint:** `POST /auth/register`
**Description:** Verify email is stored in lowercase
**Prerequisites:** None
**Request:**
```json
{
  "email": "TestUser@Example.COM",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 201
- Body contains: `email: "testuser@example.com"`

### [TC_012] Registration - Email with Whitespace
**Endpoint:** `POST /auth/register`
**Description:** Verify email whitespace is trimmed
**Prerequisites:** None
**Request:**
```json
{
  "email": "  user@example.com  ",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 201
- Body contains: `email: "user@example.com"`

---

## [TG_AUTH_LOGIN] User Login Tests

### [TC_013] Successful Login
**Endpoint:** `POST /auth/login`
**Description:** Login with valid credentials
**Prerequisites:** User registered with email/password
**Request:**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 200
- Body contains: `token` (valid JWT format)
- Token can be decoded and contains user ID and email

### [TC_014] Login - Missing Email
**Endpoint:** `POST /auth/login`
**Description:** Attempt login without email
**Prerequisites:** None
**Request:**
```json
{
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Email and password are required"}`

### [TC_015] Login - Missing Password
**Endpoint:** `POST /auth/login`
**Description:** Attempt login without password
**Prerequisites:** None
**Request:**
```json
{
  "email": "testuser@example.com"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Email and password are required"}`

### [TC_016] Login - Invalid Email
**Endpoint:** `POST /auth/login`
**Description:** Attempt login with non-existent email
**Prerequisites:** None
**Request:**
```json
{
  "email": "nonexistent@example.com",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Invalid email or password"}`

### [TC_017] Login - Invalid Password
**Endpoint:** `POST /auth/login`
**Description:** Attempt login with wrong password
**Prerequisites:** User exists with different password
**Request:**
```json
{
  "email": "testuser@example.com",
  "password": "wrongpassword"
}
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Invalid email or password"}`

### [TC_018] Login - Email Case Insensitive
**Endpoint:** `POST /auth/login`
**Description:** Login with different email case
**Prerequisites:** User registered with lowercase email
**Request:**
```json
{
  "email": "TestUser@Example.COM",
  "password": "password123"
}
```
**Expected Response:**
- Status Code: 200
- Body contains: `token`

### [TC_019] Login - Empty Request Body
**Endpoint:** `POST /auth/login`
**Description:** Attempt login with empty body
**Prerequisites:** None
**Request:**
```json
{}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Email and password are required"}`

---

## [TG_TASK_CREATE] Task Creation Tests

### [TC_020] Successful Task Creation - Full Data
**Endpoint:** `POST /tasks`
**Description:** Create task with all fields
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, and eggs",
  "status": "pending"
}
```
**Expected Response:**
- Status Code: 201
- Body contains: `id` (UUID)
- Body contains: `userId` (matches token user)
- Body contains: `title: "Buy groceries"`
- Body contains: `description: "Milk, bread, and eggs"`
- Body contains: `status: "pending"`
- Body contains: `createdAt` and `updatedAt` (same value)

### [TC_021] Task Creation - Minimal Data
**Endpoint:** `POST /tasks`
**Description:** Create task with only required fields
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Simple task"
}
```
**Expected Response:**
- Status Code: 201
- Body contains: `title: "Simple task"`
- Body contains: `description: ""`
- Body contains: `status: "pending"`

### [TC_022] Task Creation - With Done Status
**Endpoint:** `POST /tasks`
**Description:** Create task with done status
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Completed task",
  "status": "done"
}
```
**Expected Response:**
- Status Code: 201
- Body contains: `status: "done"`

### [TC_023] Task Creation - Missing Title
**Endpoint:** `POST /tasks`
**Description:** Attempt to create task without title
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "description": "Task without title"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Title is required"}`

### [TC_024] Task Creation - Empty Title
**Endpoint:** `POST /tasks`
**Description:** Attempt to create task with empty title
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "",
  "description": "Task with empty title"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Title is required"}`

### [TC_025] Task Creation - Invalid Status
**Endpoint:** `POST /tasks`
**Description:** Attempt to create task with invalid status
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Task with invalid status",
  "status": "invalid"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Status must be either \"pending\" or \"done\""}`

### [TC_026] Task Creation - No Authentication
**Endpoint:** `POST /tasks`
**Description:** Attempt to create task without token
**Prerequisites:** None
**Request:**
```json
{
  "title": "Unauthorized task"
}
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Access denied. No token provided."}`

### [TC_027] Task Creation - Invalid Token
**Endpoint:** `POST /tasks`
**Description:** Attempt to create task with invalid token
**Prerequisites:** None
**Headers:**
```
Authorization: Bearer invalid_token
```
**Request:**
```json
{
  "title": "Task with invalid token"
}
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Invalid token."}`

### [TC_028] Task Creation - Title with Whitespace
**Endpoint:** `POST /tasks`
**Description:** Create task with title containing whitespace
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "  Task with spaces  ",
  "description": "  Description with spaces  "
}
```
**Expected Response:**
- Status Code: 201
- Body contains: `title: "Task with spaces"`
- Body contains: `description: "Description with spaces"`

---

## [TG_TASK_READ] Task Retrieval Tests

### [TC_029] Get All Tasks - Success
**Endpoint:** `GET /tasks`
**Description:** Retrieve all tasks for authenticated user
**Prerequisites:** Valid JWT token, user has tasks
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 200
- Body: Array of task objects
- Tasks sorted by creation date (newest first)
- Only tasks belonging to authenticated user

### [TC_030] Get All Tasks - Empty List
**Endpoint:** `GET /tasks`
**Description:** Retrieve tasks when user has none
**Prerequisites:** Valid JWT token, user has no tasks
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 200
- Body: `[]`

### [TC_031] Get Tasks - Filter by Pending
**Endpoint:** `GET /tasks?status=pending`
**Description:** Retrieve only pending tasks
**Prerequisites:** Valid JWT token, user has mixed status tasks
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 200
- Body: Array containing only tasks with `status: "pending"`

### [TC_032] Get Tasks - Filter by Done
**Endpoint:** `GET /tasks?status=done`
**Description:** Retrieve only completed tasks
**Prerequisites:** Valid JWT token, user has mixed status tasks
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 200
- Body: Array containing only tasks with `status: "done"`

### [TC_033] Get Tasks - Invalid Status Filter
**Endpoint:** `GET /tasks?status=invalid`
**Description:** Attempt to filter by invalid status
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Status filter must be either \"pending\" or \"done\""}`

### [TC_034] Get Tasks - No Authentication
**Endpoint:** `GET /tasks`
**Description:** Attempt to get tasks without token
**Prerequisites:** None
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Access denied. No token provided."}`

### [TC_035] Get Single Task - Success
**Endpoint:** `GET /tasks/:id`
**Description:** Retrieve specific task by ID
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 200
- Body: Task object with matching ID
- Task belongs to authenticated user

### [TC_036] Get Single Task - Not Found
**Endpoint:** `GET /tasks/:id`
**Description:** Attempt to get non-existent task
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Task not found"}`

### [TC_037] Get Single Task - Wrong User
**Endpoint:** `GET /tasks/:id`
**Description:** Attempt to get another user's task
**Prerequisites:** Valid JWT token, task exists but belongs to different user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Task not found"}`

### [TC_038] Get Single Task - Invalid ID Format
**Endpoint:** `GET /tasks/invalid-id`
**Description:** Attempt to get task with malformed ID
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Task not found"}`

---

## [TG_TASK_UPDATE] Task Update Tests

### [TC_039] Update Task - Full Update
**Endpoint:** `PUT /tasks/:id`
**Description:** Update all task fields
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "done"
}
```
**Expected Response:**
- Status Code: 200
- Body: Updated task object
- `updatedAt` field is newer than `createdAt`
- All specified fields are updated

### [TC_040] Update Task - Partial Update (Title Only)
**Endpoint:** `PUT /tasks/:id`
**Description:** Update only the title
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "New title only"
}
```
**Expected Response:**
- Status Code: 200
- Only title is updated
- Other fields remain unchanged
- `updatedAt` is updated

### [TC_041] Update Task - Partial Update (Status Only)
**Endpoint:** `PUT /tasks/:id`
**Description:** Update only the status
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "status": "done"
}
```
**Expected Response:**
- Status Code: 200
- Only status is updated
- Other fields remain unchanged

### [TC_042] Update Task - Empty Description
**Endpoint:** `PUT /tasks/:id`
**Description:** Set description to empty string
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "description": ""
}
```
**Expected Response:**
- Status Code: 200
- Description is set to empty string

### [TC_043] Update Task - Empty Title
**Endpoint:** `PUT /tasks/:id`
**Description:** Attempt to set title to empty
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": ""
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Title cannot be empty"}`

### [TC_044] Update Task - Whitespace Title
**Endpoint:** `PUT /tasks/:id`
**Description:** Attempt to set title to whitespace only
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "   "
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Title cannot be empty"}`

### [TC_045] Update Task - Invalid Status
**Endpoint:** `PUT /tasks/:id`
**Description:** Attempt to set invalid status
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "status": "invalid"
}
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Status must be either \"pending\" or \"done\""}`

### [TC_046] Update Task - Not Found
**Endpoint:** `PUT /tasks/:id`
**Description:** Attempt to update non-existent task
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Updated title"
}
```
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Task not found"}`

### [TC_047] Update Task - Wrong User
**Endpoint:** `PUT /tasks/:id`
**Description:** Attempt to update another user's task
**Prerequisites:** Valid JWT token, task exists but belongs to different user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Unauthorized update"
}
```
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Task not found"}`

### [TC_048] Update Task - No Authentication
**Endpoint:** `PUT /tasks/:id`
**Description:** Attempt to update task without token
**Prerequisites:** None
**Request:**
```json
{
  "title": "Unauthorized update"
}
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Access denied. No token provided."}`

---

## [TG_TASK_DELETE] Task Deletion Tests

### [TC_049] Delete Task - Success
**Endpoint:** `DELETE /tasks/:id`
**Description:** Successfully delete own task
**Prerequisites:** Valid JWT token, task exists and belongs to user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 204
- No response body
- Task is removed from database

### [TC_050] Delete Task - Not Found
**Endpoint:** `DELETE /tasks/:id`
**Description:** Attempt to delete non-existent task
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Task not found"}`

### [TC_051] Delete Task - Wrong User
**Endpoint:** `DELETE /tasks/:id`
**Description:** Attempt to delete another user's task
**Prerequisites:** Valid JWT token, task exists but belongs to different user
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Task not found"}`

### [TC_052] Delete Task - No Authentication
**Endpoint:** `DELETE /tasks/:id`
**Description:** Attempt to delete task without token
**Prerequisites:** None
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Access denied. No token provided."}`

### [TC_053] Delete Task - Invalid Token
**Endpoint:** `DELETE /tasks/:id`
**Description:** Attempt to delete task with invalid token
**Prerequisites:** None
**Headers:**
```
Authorization: Bearer invalid_token
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Invalid token."}`

---

## [TG_AUTH_MIDDLEWARE] Authentication Middleware Tests

### [TC_054] Token - Valid Bearer Token
**Endpoint:** Any protected endpoint
**Description:** Use correctly formatted Bearer token
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Expected Response:**
- Request proceeds normally
- User information available in request context

### [TC_055] Token - Missing Authorization Header
**Endpoint:** Any protected endpoint
**Description:** Request without Authorization header
**Prerequisites:** None
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Access denied. No token provided."}`

### [TC_056] Token - Invalid Bearer Format
**Endpoint:** Any protected endpoint
**Description:** Authorization header without Bearer prefix
**Prerequisites:** None
**Headers:**
```
Authorization: <jwt_token>
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Access denied. No token provided."}`

### [TC_057] Token - Empty Authorization Header
**Endpoint:** Any protected endpoint
**Description:** Empty Authorization header
**Prerequisites:** None
**Headers:**
```
Authorization: 
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Access denied. No token provided."}`

### [TC_058] Token - Malformed JWT
**Endpoint:** Any protected endpoint
**Description:** JWT with invalid format
**Prerequisites:** None
**Headers:**
```
Authorization: Bearer invalid.jwt.token
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Invalid token."}`

### [TC_059] Token - Expired JWT
**Endpoint:** Any protected endpoint
**Description:** JWT that has expired
**Prerequisites:** Expired JWT token
**Headers:**
```
Authorization: Bearer <expired_jwt>
```
**Expected Response:**
- Status Code: 401
- Body: `{"error": "Invalid token."}`

---

## [TG_EDGE_CASES] Edge Cases and Integration Tests

### [TC_060] Large Payload - Task Creation
**Endpoint:** `POST /tasks`
**Description:** Create task with very long title and description
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "<string of 1000 characters>",
  "description": "<string of 5000 characters>"
}
```
**Expected Response:**
- Status Code: 201
- Task created successfully with full content

### [TC_061] Special Characters - Task Fields
**Endpoint:** `POST /tasks`
**Description:** Create task with special characters
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "Task with émojis 🚀 and symbols @#$%",
  "description": "Special chars: <>&\"'\n\t\r"
}
```
**Expected Response:**
- Status Code: 201
- Special characters preserved correctly

### [TC_062] Unicode Support - Task Content
**Endpoint:** `POST /tasks`
**Description:** Create task with Unicode characters
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "תשימה עם עברית",
  "description": "中文描述 and العربية text"
}
```
**Expected Response:**
- Status Code: 201
- Unicode characters preserved correctly

### [TC_063] SQL Injection Attempt - Title Field
**Endpoint:** `POST /tasks`
**Description:** Attempt SQL injection in title
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "'; DROP TABLE tasks; --",
  "description": "SQL injection test"
}
```
**Expected Response:**
- Status Code: 201
- String treated as literal text, no SQL execution

### [TC_064] XSS Attempt - Task Fields
**Endpoint:** `POST /tasks`
**Description:** Attempt XSS in task fields
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
```
**Request:**
```json
{
  "title": "<script>alert('xss')</script>",
  "description": "<img src=x onerror=alert('xss')>"
}
```
**Expected Response:**
- Status Code: 201
- Script tags stored as literal text

### [TC_065] Concurrent Task Creation
**Endpoint:** `POST /tasks`
**Description:** Create multiple tasks simultaneously
**Prerequisites:** Valid JWT token
**Test Steps:**
1. Send 10 concurrent POST requests
2. Verify all tasks are created
3. Check for data corruption
**Expected Response:**
- All requests succeed
- No data corruption
- All tasks have unique IDs

### [TC_066] User Isolation Test
**Endpoint:** Various
**Description:** Verify complete user data isolation
**Prerequisites:** Two different users with tasks
**Test Steps:**
1. User A creates tasks
2. User B creates tasks
3. User A retrieves tasks
4. User B retrieves tasks
**Expected Response:**
- Each user only sees their own tasks
- No cross-user data leakage

### [TC_067] Task Lifecycle Integration
**Endpoint:** Multiple
**Description:** Complete task lifecycle test
**Prerequisites:** Valid JWT token
**Test Steps:**
1. Create task with `POST /tasks`
2. Retrieve task with `GET /tasks/:id`
3. Update task with `PUT /tasks/:id`
4. Retrieve updated task
5. Delete task with `DELETE /tasks/:id`
6. Verify task is deleted
**Expected Response:**
- All operations succeed in sequence
- Data consistency maintained throughout

---

## [TG_GLOBAL_ERRORS] Global Error Handling Tests

### [TC_068] Undefined Endpoint
**Endpoint:** `GET /nonexistent`
**Description:** Request to non-existent endpoint
**Prerequisites:** None
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Endpoint not found"}`

### [TC_069] Invalid HTTP Method
**Endpoint:** `PATCH /tasks`
**Description:** Use unsupported HTTP method
**Prerequisites:** None
**Expected Response:**
- Status Code: 404
- Body: `{"error": "Endpoint not found"}`

### [TC_070] Invalid Content-Type
**Endpoint:** `POST /auth/register`
**Description:** Send request with invalid content type
**Prerequisites:** None
**Headers:**
```
Content-Type: text/plain
```
**Request:** `email=test&password=test`
**Expected Response:**
- Status Code: 422 or 400
- Appropriate error message

### [TC_071] Malformed JSON
**Endpoint:** `POST /auth/register`
**Description:** Send malformed JSON in request body
**Prerequisites:** None
**Headers:**
```
Content-Type: application/json
```
**Request:** `{"email": "test@example.com", "password": }`
**Expected Response:**
- Status Code: 400
- Error message about invalid JSON

### [TC_072] Empty Request Body (POST)
**Endpoint:** `POST /tasks`
**Description:** Send POST request with no body
**Prerequisites:** Valid JWT token
**Headers:**
```
Authorization: Bearer <valid_jwt>
Content-Type: application/json
```
**Expected Response:**
- Status Code: 422
- Body: `{"error": "Title is required"}`

### [TC_073] Server Error Handling
**Endpoint:** Any endpoint
**Description:** Verify server error responses don't leak sensitive info
**Prerequisites:** Simulated server error condition
**Expected Response:**
- Status Code: 500
- Body: `{"error": "Internal server error"}`
- No sensitive information in response
- Error logged server-side

---

## Test Execution Guidelines

### Prerequisites Setup
1. **Test Environment:** Clean database state
2. **Test Data:** Create test users and tasks as needed
3. **Authentication:** Generate valid JWT tokens for protected endpoints
4. **Cleanup:** Reset database state between test groups

### Test Categories Priority
1. **P0 (Critical):** Success paths for all endpoints
2. **P1 (High):** Authentication and authorization
3. **P2 (Medium):** Validation and error handling
4. **P3 (Low):** Edge cases and special scenarios

### Expected Test Coverage
- **Functional Coverage:** 100% of API endpoints
- **Error Coverage:** All documented error scenarios
- **Security Coverage:** Authentication, authorization, input validation
- **Edge Case Coverage:** Boundary conditions and special inputs

### Test Automation Recommendations
- Group tests by functionality for better organization
- Use setup/teardown for database state management
- Implement test data factories for consistent test data
- Add performance assertions where appropriate
- Include integration tests for complete workflows

---

*Total Test Cases: 73*
*Last Updated: 2025-08-19*
