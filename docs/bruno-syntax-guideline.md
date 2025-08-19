# Bruno: The Git-Friendly API Client

## Table of Contents
1. [Overview](#overview)
2. [Core Philosophy](#core-philosophy)
3. [File Format and Structure](#file-format-and-structure)
4. [Variables and Environment Management](#variables-and-environment-management)
5. [Authentication Support](#authentication-support)
6. [Scripting and Testing](#scripting-and-testing)
7. [Collection Organization](#collection-organization)
8. [Import/Export Capabilities](#importexport-capabilities)
9. [CLI and Automation](#cli-and-automation)
10. [Migration from Postman](#migration-from-postman)

## Overview

**Bruno** is a fast, open-source, git-friendly API client designed as an alternative to Postman. Unlike traditional API clients that store data in proprietary formats or cloud services, Bruno stores collections as plain text files using a custom `.bru` format, making it inherently version control friendly.

### Key Characteristics:
- **Open Source**: MIT licensed, community-driven development
- **Privacy-First**: No account required, completely offline
- **Git-Native**: Text-based format designed for version control
- **Cross-Platform**: Available on Windows, macOS, and Linux
- **Lightweight**: Fast startup and low resource consumption

## Core Philosophy

Bruno was built with several core principles:

1. **Git Integration**: Collections are stored as text files that work seamlessly with git
2. **Privacy**: No data leaves your machine unless you explicitly share it
3. **Simplicity**: Clean, intuitive interface without unnecessary complexity
4. **Collaboration**: Easy team sharing through version control systems
5. **Developer-Centric**: Built by developers, for developers

## File Format and Structure

### Collection Structure
```
my-api-collection/
├── bruno.json                 # Collection metadata
├── environments/
│   ├── development.bru        # Development environment variables
│   ├── staging.bru           # Staging environment variables
│   └── production.bru        # Production environment variables
├── authentication/
│   ├── login.bru
│   └── refresh-token.bru
├── users/
│   ├── get-users.bru
│   ├── create-user.bru
│   ├── update-user.bru
│   └── delete-user.bru
└── posts/
    ├── get-posts.bru
    ├── create-post.bru
    └── update-post.bru
```

### Bruno Collection Metadata (bruno.json)
```json
{
  "version": "1",
  "name": "My API Collection",
  "type": "collection",
  "ignore": [
    "node_modules",
    ".git",
    "*.log"
  ]
}
```

### Request File Format (.bru)

Bruno uses a human-readable, structured text format for API requests:

```bru
meta {
  name: Create New User
  type: http
  seq: 1
}

post {
  url: {{baseUrl}}/api/users
  body: json
  auth: bearer
}

headers {
  Content-Type: application/json
  Accept: application/json
  X-API-Version: v1
}

auth:bearer {
  token: {{authToken}}
}

params:query {
  include: profile,settings
  limit: 10
}

body:json {
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }
}

vars:pre-request {
  timestamp: {{$timestamp}}
  uuid: {{$uuid}}
}

script:pre-request {
  // Generate dynamic values
  bru.setVar("requestId", Math.random().toString(36));
  
  // Set authentication if needed
  if (!bru.getEnvVar("authToken")) {
    throw new Error("Authentication token not found");
  }
  
  console.log("Sending request at:", new Date().toISOString());
}

script:post-response {
  // Log response details
  console.log("Response status:", res.status);
  console.log("Response time:", res.responseTime + "ms");
  
  // Extract data for subsequent requests
  if (res.status === 201 && res.body.id) {
    bru.setVar("newUserId", res.body.id);
  }
  
  // Handle errors
  if (res.status >= 400) {
    console.error("Request failed:", res.body.message);
  }
}

tests {
  test("Should create user successfully", () => {
    expect(res.status).to.equal(201);
  });
  
  test("Should return user object", () => {
    expect(res.body).to.have.property("id");
    expect(res.body).to.have.property("name");
    expect(res.body).to.have.property("email");
  });
  
  test("Should have valid email format", () => {
    expect(res.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
  
  test("Response time should be reasonable", () => {
    expect(res.responseTime).to.be.below(2000);
  });
}

assert {
  res.status: eq 201
  res.body.name: eq {{userName}}
  res.responseTime: lt 1000
}
```

### Environment Files
Environment variables are stored in separate `.bru` files:

```bru
vars {
  baseUrl: https://api.development.example.com
  authToken: dev_token_12345
  dbHost: localhost
  dbPort: 5432
  debugMode: true
  timeout: 30000
}
```


## Variables and Environment Management

Bruno provides a comprehensive variable system with multiple scopes:

### Variable Hierarchy (Higher priority overrides lower)
1. **Runtime Variables** (Highest priority)
2. **Request Variables**
3. **Folder Variables**
4. **Collection Variables**
5. **Environment Variables**
6. **Global Environment Variables**
7. **Process Environment Variables** (Lowest priority)

### Variable Types

#### Environment Variables
```bru
# environments/development.bru
vars {
  baseUrl: https://api.dev.example.com
  authToken: dev_token_123
  timeout: 5000
}
```

#### Collection Variables
```bru
# At collection level
vars {
  apiVersion: v2
  defaultLimit: 50
}
```

#### Dynamic Variables
Bruno supports several built-in dynamic variables:
- `{{$timestamp}}` - Current Unix timestamp
- `{{$uuid}}` - Random UUID v4
- `{{$randomInt}}` - Random integer
- `{{$randomString}}` - Random string

#### Secret Variables
For sensitive data, Bruno integrates with external secret managers:

```bru
# Using HashiCorp Vault
vars {
  apiKey: {{vault:secret/myapp:apiKey}}
  dbPassword: {{vault:secret/myapp:dbPassword}}
}

# Using AWS Secrets Manager
vars {
  apiSecret: {{aws:secretsmanager:prod/myapp/api:secret}}
}

# Using .env file
vars {
  dbUrl: {{process.env.DATABASE_URL}}
}
```

## Authentication Support

Bruno supports all major authentication methods:

### Bearer Token
```bru
auth:bearer {
  token: {{authToken}}
}
```

### Basic Authentication
```bru
auth:basic {
  username: {{username}}
  password: {{password}}
}
```

### API Key
```bru
auth:apikey {
  key: X-API-Key
  value: {{apiKey}}
  placement: header
}
```

### OAuth 2.0
```bru
auth:oauth2 {
  grant_type: authorization_code
  callback_url: http://localhost:8080/callback
  authorization_url: {{authUrl}}
  access_token_url: {{tokenUrl}}
  client_id: {{clientId}}
  client_secret: {{clientSecret}}
  scope: read write
}
```

### Custom Authentication
```bru
script:pre-request {
  // Custom authentication logic
  const signature = generateSignature(req.url, req.body);
  req.setHeader('X-Signature', signature);
}
```

## Scripting and Testing

### Pre-request Scripts
Execute JavaScript before sending the request:

```javascript
script:pre-request {
  // Set dynamic variables
  bru.setVar("timestamp", Date.now());
  bru.setVar("nonce", Math.random().toString(36));
  
  // Conditional logic
  if (bru.getEnvVar("environment") === "production") {
    req.setHeader("X-Environment", "prod");
  }
  
  // Generate authentication signature
  const message = req.method + req.url + req.body;
  const signature = CryptoJS.HmacSHA256(message, bru.getEnvVar("secretKey"));
  req.setHeader("X-Signature", signature.toString());
  
  // Log request details
  console.log("Sending", req.method, "request to", req.url);
}
```

### Post-response Scripts
Execute JavaScript after receiving the response:

```javascript
script:post-response {
  // Log response metrics
  console.log("Status:", res.status);
  console.log("Response time:", res.responseTime + "ms");
  
  // Extract authentication token
  if (res.status === 200 && res.body.token) {
    bru.setEnvVar("authToken", res.body.token);
    console.log("Auth token updated");
  }
  
  // Set variables for next request
  if (res.body.userId) {
    bru.setVar("currentUserId", res.body.userId);
  }
  
  // Handle pagination
  if (res.body.pagination && res.body.pagination.nextPage) {
    bru.setVar("nextPageUrl", res.body.pagination.nextPage);
  }
  
  // Error handling
  if (res.status >= 400) {
    console.error("Request failed:", res.body.error);
    throw new Error(`API Error: ${res.body.error}`);
  }
}
```

### Testing Framework
Bruno provides a comprehensive testing framework with both programmatic and declarative approaches:

#### Programmatic Tests
```javascript
tests {
  test("Authentication should be successful", () => {
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    expect(res.body.token).to.be.a("string");
    expect(res.body.token).to.have.length.above(10);
  });
  
  test("Response should contain user data", () => {
    expect(res.body.user).to.exist;
    expect(res.body.user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(res.body.user.role).to.be.oneOf(["admin", "user", "moderator"]);
  });
  
  test("Response time should be acceptable", () => {
    expect(res.responseTime).to.be.below(1000);
  });
  
  test("Security headers should be present", () => {
    expect(res.headers["x-frame-options"]).to.exist;
    expect(res.headers["x-content-type-options"]).to.equal("nosniff");
  });
}
```

#### Declarative Assertions
```bru
assert {
  res.status: eq 200
  res.body.success: eq true
  res.body.data.length: gt 0
  res.responseTime: lt 500
  res.headers.content-type: contains application/json
}
```

## Collection Organization

### Folder Structure Best Practices
```
api-collection/
├── bruno.json
├── environments/
│   ├── local.bru
│   ├── development.bru
│   ├── staging.bru
│   └── production.bru
├── auth/
│   ├── login.bru
│   ├── logout.bru
│   └── refresh-token.bru
├── users/
│   ├── list-users.bru
│   ├── get-user.bru
│   ├── create-user.bru
│   ├── update-user.bru
│   └── delete-user.bru
├── posts/
│   ├── list-posts.bru
│   ├── get-post.bru
│   ├── create-post.bru
│   └── update-post.bru
└── admin/
    ├── system-status.bru
    └── analytics.bru
```

### Request Sequencing
Use the `seq` property to control execution order:

```bru
meta {
  name: Step 1 - Login
  type: http
  seq: 1
}
```

### Folder-level Configuration
Each folder can have its own variables and scripts:

```bru
# users/folder.bru
vars {
  basePath: /api/v1/users
  defaultPageSize: 25
}

script:pre-request {
  // Common setup for all user requests
  req.setHeader("X-Resource", "users");
}
```

## Import/Export Capabilities

### Importing from Postman
Bruno can import Postman collections and automatically convert them:

```bash
# Using Bruno CLI
bruno import --format postman --source collection.json --destination ./bruno-collection

# Supported Postman features in conversion:
# ✅ Requests and folders
# ✅ Environment variables
# ✅ Pre-request and test scripts
# ✅ Authentication settings
# ✅ Request headers and body
# ❌ Postman-specific features (monitors, mocks)
```

### Export Options
```bash
# Export to various formats
bruno export --format postman --source ./collection --destination exported.json
bruno export --format openapi --source ./collection --destination api-spec.yaml
bruno export --format curl --source ./collection --destination commands.sh
```

### Script Translation
Bruno includes a script translator for converting Postman scripts:

```javascript
// Postman script
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
pm.environment.set("userId", pm.response.json().id);

// Converted Bruno script
test("Status code is 200", () => {
    expect(res.status).to.equal(200);
});
bru.setEnvVar("userId", res.body.id);
```

## CLI and Automation

### Bruno CLI Installation
```bash
npm install -g @usebruno/cli
```

### Running Collections
```bash
# Run entire collection
bruno run collection-folder

# Run specific environment
bruno run collection-folder --env production

# Run specific folder
bruno run collection-folder --folder users

# Run with custom variables
bruno run collection-folder --env-var baseUrl=https://api.example.com

# Generate reports
bruno run collection-folder --output junit --out-file results.xml
```

### CI/CD Integration
```yaml
# GitHub Actions example
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Bruno CLI
        run: npm install -g @usebruno/cli
      
      - name: Run API tests
        run: bruno run ./api-tests --env ci
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
          
      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: results.xml
```

### Automated Testing Scripts
```bash
#!/bin/bash
# test-api.sh

# Set environment variables
export API_BASE_URL="https://api.staging.example.com"
export API_TOKEN="$STAGING_API_TOKEN"

# Run smoke tests
echo "Running smoke tests..."
bruno run ./collections/smoke-tests --env staging

# Run regression tests
echo "Running regression tests..."
bruno run ./collections/regression-tests --env staging

# Generate report
echo "Generating test report..."
bruno run ./collections/full-suite --env staging --output html --out-file test-report.html

echo "API testing complete!"
```


## Migration from Postman

### Step-by-Step Migration Process

#### 1. Export from Postman
```bash
# Export collection from Postman UI or use Newman
newman export-collection "My Collection" --out collection.json
```

#### 2. Import to Bruno
```bash
# Install Bruno CLI
npm install -g @usebruno/cli

# Import Postman collection
bruno import --format postman --source collection.json --destination ./bruno-collection
```

#### 3. Review and Update
- Verify request conversion accuracy
- Update any Postman-specific script functions
- Test environment variable mappings
- Validate authentication settings

#### 4. Version Control Setup
```bash
cd bruno-collection
git init
git add .
git commit -m "Initial Bruno collection import from Postman"
git remote add origin https://github.com/your-org/api-collection.git
git push -u origin main
```

### Common Migration Issues and Solutions

#### Script Compatibility
```javascript
// Postman specific functions that need updating:

// ❌ Postman
pm.environment.set("var", value)
pm.globals.set("var", value)
pm.test("test name", function() {...})

// ✅ Bruno
bru.setEnvVar("var", value)
bru.setVar("var", value)
test("test name", () => {...})
```

#### Variable Syntax
```javascript
// ❌ Postman dynamic variables
{{$guid}}
{{$timestamp}}
{{$randomInt}}

// ✅ Bruno dynamic variables
{{$uuid}}
{{$timestamp}}
{{$randomInt}}
```

#### Environment Management
```json
// Postman environments need to be converted to .bru format
// From JSON to structured text format
```

### Best Practices for New Bruno Users

#### 1. Collection Structure
- Use meaningful folder names
- Group related requests logically
- Maintain consistent naming conventions
- Use sequence numbers for dependent requests

#### 2. Variable Management
- Use environment-specific variables
- Leverage variable hierarchy effectively
- Document variable purposes
- Use secret management for sensitive data

#### 3. Testing Strategy
- Write comprehensive tests for critical endpoints
- Use both assertions and programmatic tests
- Test error scenarios
- Validate response schemas

#### 4. Team Collaboration
- Establish git workflow for collections
- Use branch protection for production collections
- Code review API changes
- Document collection usage

#### 5. Automation
- Set up CI/CD pipelines for API testing
- Use Bruno CLI for automated testing
- Generate test reports
- Monitor test results

