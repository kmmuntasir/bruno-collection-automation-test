# Mini Task Manager API - Bruno Collection

This Bruno collection provides comprehensive testing coverage for the Mini Task Manager API, including all endpoints, error scenarios, and validation testing.

## Collection Overview

The collection is organized into the following folders:

### 📊 **health/** 
- Health check endpoint testing
- Server availability verification

### 🔐 **auth/**
- User registration testing
- User authentication testing
- JWT token management

### 📋 **tasks/**
- Complete CRUD operations for tasks
- Task filtering by status
- User authorization testing

### ❌ **error-scenarios/**
- Unauthorized access testing
- Invalid credentials testing
- Input validation error testing

## Environment Configuration

The collection includes three pre-configured environments:

### **Development** (`environments/development.bru`)
- Local development server (`http://localhost:3000`)
- Test user credentials
- Shorter timeouts for quick testing

### **Staging** (`environments/staging.bru`)
- Staging server configuration
- Staging-specific test credentials
- Medium timeout values

### **Production** (`environments/production.bru`)
- Production server configuration
- Production test credentials
- Longer timeout values for stability

## Request Sequence

The collection is designed to run in sequence, with each request building on the previous ones:

1. **Health Check** (seq: 1) - Verify server is running
2. **Register User** (seq: 2) - Create test user account
3. **Login User** (seq: 3) - Authenticate and get JWT token
4. **Create Task** (seq: 4) - Create a test task
5. **Get All Tasks** (seq: 5) - Retrieve user's tasks
6. **Get Tasks by Status** (seq: 6) - Test filtering functionality
7. **Get Single Task** (seq: 7) - Retrieve specific task
8. **Update Task** (seq: 8) - Modify task details
9. **Delete Task** (seq: 9) - Remove task
10. **Error Scenarios** (seq: 10-12) - Test error handling

## Variables and Data Flow

The collection uses a sophisticated variable system to pass data between requests:

### Environment Variables
- `baseUrl` - API server base URL
- `authToken` - JWT authentication token (auto-populated)
- `testUserEmail` - Test user email address
- `testUserPassword` - Test user password
- `testUserId` - User ID (auto-populated after registration)
- `testTaskId` - Task ID (auto-populated after task creation)

### Dynamic Variables
- `{{$timestamp}}` - Current timestamp
- `{{$uuid}}` - Random UUID for unique data generation

## Running the Collection

### Using Bruno GUI
1. Open Bruno
2. Import the collection from this folder
3. Select the desired environment (development, staging, or production)
4. Run the entire collection or individual requests

### Using Bruno CLI
```bash
# Install Bruno CLI
npm install -g @usebruno/cli

# Run entire collection
bruno run docs/bruno-collection --env development

# Run specific folder
bruno run docs/bruno-collection --folder tasks --env development

# Run with custom variables
bruno run docs/bruno-collection --env development --env-var baseUrl=http://localhost:3000
```

## Test Coverage

### Authentication Testing
- ✅ User registration with validation
- ✅ Successful user login
- ✅ JWT token generation and storage
- ✅ Invalid credentials handling
- ✅ Email format validation
- ✅ Password strength validation

### Task Management Testing
- ✅ Task creation with authentication
- ✅ Task retrieval (all tasks)
- ✅ Task retrieval (single task by ID)
- ✅ Task filtering by status
- ✅ Task updates with validation
- ✅ Task deletion
- ✅ User authorization (own tasks only)

### Error Handling Testing
- ✅ Unauthorized access (401)
- ✅ Invalid credentials (401)
- ✅ Validation errors (422)
- ✅ Resource not found (404)
- ✅ Proper error message formatting

### Performance Testing
- ✅ Response time validation for all endpoints
- ✅ Server health monitoring
- ✅ Reasonable timeout handling

## Advanced Features

### Pre-request Scripts
- Dynamic email generation to avoid conflicts
- Authentication token validation
- Request logging and debugging

### Post-response Scripts
- Automatic variable extraction and storage
- Response validation and logging
- Error handling and reporting

### Comprehensive Testing
- Both programmatic tests (JavaScript) and declarative assertions
- Response structure validation
- Data format validation (emails, timestamps, UUIDs)
- Performance benchmarks

## Automation and CI/CD

This collection is designed for automation and can be easily integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run API Tests
  run: bruno run docs/bruno-collection --env ci
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
```

## Troubleshooting

### Common Issues

**Authentication Token Not Found**
- Ensure you run the login request before protected endpoints
- Check that the login was successful and returned a token

**Task ID Not Found**
- Make sure to create a task before trying to update/delete
- Check that task creation was successful

**Environment Variables**
- Verify the correct environment is selected
- Ensure all required variables are set in the environment file

### Debugging

Enable request/response logging by checking the scripts in each request. The collection includes comprehensive logging for debugging purposes.

## Contributing

To add new test cases:

1. Create new `.bru` files following the existing naming convention
2. Use appropriate sequence numbers
3. Include comprehensive tests and error handling
4. Add logging for debugging purposes
5. Update this README with new test coverage

## Best Practices

1. **Always run health check first** to ensure server availability
2. **Use unique data** when possible to avoid conflicts
3. **Handle both success and error scenarios** in tests
4. **Include performance assertions** for response times
5. **Clean up test data** when appropriate (e.g., delete created tasks)
6. **Use descriptive test names** and error messages
7. **Validate response structure** not just status codes
