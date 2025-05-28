# Loggerfy

> A simple and structured logging library for Node.js applications

## What is Loggerfy?

Loggerfy is a lightweight library that helps you create structured logs with a consistent format. Perfect for applications that need an organized and easy-to-implement logging system.

## Quick Installation

```bash
npm install loggerfy
```

## Quick Start Guide

### 1. Import the library

```js
// CommonJS
const { Loggerfy } = require('loggerfy');

// ES Modules
import { Loggerfy } from 'loggerfy';
```

### 2. Create a logger and use it

```js
// Create an instance
const logger = new Loggerfy();

// Log an error
logger.error()
  .setCode('AUTH_001')
  .setMessage('User authentication failed')
  .setDetail('Invalid credentials provided')
  .setMetadata({ userId: 123 })
  .write();
```

## Log Levels

Loggerfy offers three logging levels:

```js
// Information
logger.info()
  .setCode('APP_001')
  .setMessage('Application started')
  .setDetail('Server listening on port 3000')
  .write();

// Warning
logger.warn()
  .setCode('CONFIG_001')
  .setMessage('Using default configuration')
  .setDetail('Configuration file not found')
  .write();

// Error
logger.error()
  .setCode('DB_001')
  .setMessage('Database connection error')
  .setDetail('Timeout after 30 seconds')
  .write();
```

## Available Methods

| Method | Description | Required? |
|--------|-------------|-----------|
| `setCode(code)` | Sets a unique code for the log entry | Yes |
| `setMessage(message)` | Sets the main message | Yes |
| `setDetail(detail)` | Adds additional details | Yes |
| `setMetadata(object)` | Adds contextual data | No |
| `write()` | Writes the log to the console | Yes* |
| `getLog()` | Returns the log as a JSON string without printing | Yes* |

*Either `write()` or `getLog()` must be called to complete the logging operation.

## Getting Log as String

If you need the log as a string instead of printing it to the console:

```js
// Get log as JSON string
const logString = logger.error()
  .setCode('AUTH_001')
  .setMessage('User authentication failed')
  .setDetail('Invalid credentials provided')
  .setMetadata({ userId: 123 })
  .getLog();

// Now you can use the string however you want
sendToExternalService(logString);
```

## Output Format

All logs are generated in JSON format:

```json
{
  "timestamp": "2023-11-15T14:30:45.123Z",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "AUTH_001",
  "message": "User authentication failed",
  "detail": "Invalid credentials provided",
  "payload": { "userId": 123 },
  "level": "ERROR",
  "severity": "ERROR",
  "service": "my-service",
  "environment": "development"
}
```

## Environment Customization

Loggerfy automatically detects the environment and service name:

```js
// Configure environment variables
process.env.SERVICE_NAME = "user-api";
process.env.NODE_ENV = "production";

// Logs will include these values
```

## Implementation with Custom Repository

You can save logs to a custom repository:

```js
import { Loggerfy, LoggerfyRepository, LogEntry } from 'loggerfy';

// Implement your repository
class MyRepository implements LoggerfyRepository {
  async save(log: LogEntry): Promise<void> {
    // Save the log to your database
    await db.logs.insert(log);
  }
}

// Create the logger with your repository
const logger = new Loggerfy(new MyRepository());

// Use it normally
logger.info()
  .setCode('USER_001')
  .setMessage('User created')
  .setDetail('New record in database')
  .write();
```

## Complete Example

```js
import { Loggerfy } from 'loggerfy';

// Environment configuration
process.env.SERVICE_NAME = "payment-service";

const logger = new Loggerfy();

function processPayment(userId, amount) {
  try {
    // Payment processing logic
    
    // Success log
    logger.info()
      .setCode('PAYMENT_001')
      .setMessage('Payment processed successfully')
      .setDetail(`Payment of $${amount} processed`)
      .setMetadata({ userId, amount, timestamp: new Date() })
      .write();
      
    return true;
  } catch (error) {
    // Error log
    logger.error()
      .setCode('PAYMENT_ERR_001')
      .setMessage('Payment processing failed')
      .setDetail(error.message)
      .setMetadata({ userId, amount, errorStack: error.stack })
      .write();
      
    return false;
  }
}
```

## Tips for Effective Use

1. **Use consistent codes** - Create a coding system for your logs (e.g., AUTH_001, DB_001)
2. **Include context** - Use setMetadata to add relevant information for debugging
3. **Use the appropriate level** - Don't log everything as an error, use info and warn appropriately
4. **Choose the right output method** - Use `write()` for console output or `getLog()` when you need the log as a string

## Need Help?

Visit our [GitHub repository](https://github.com/juanbautista0/loggerfy) for more information or to report issues.
