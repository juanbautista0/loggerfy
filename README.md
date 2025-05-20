# Loggerfy

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A flexible, structured, and developer-friendly logging library for Node.js applications.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Log Levels](#log-levels)
  - [Methods](#methods)
  - [Custom Repository](#custom-repository)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [With Custom Repository](#with-custom-repository)
  - [Environment Configuration](#environment-configuration)
- [Output Format](#output-format)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Structured Logging** - Consistent JSON format for all logs
- **Fluent API** - Intuitive chainable methods for building logs
- **Custom Metadata** - Add rich contextual data to your logs
- **Unique IDs** - Automatic UUID generation for each log entry
- **Environment Awareness** - Automatically includes service name and environment
- **Extensible** - Implement custom repositories for log storage
- **TypeScript Support** - Full type definitions included
- **Lightweight** - Zero external dependencies

## 🚀 Installation

```bash
# Using npm
npm install loggerfy

# Using yarn
yarn add loggerfy

# Using pnpm
pnpm add loggerfy
```

## 🏁 Quick Start

```typescript
import { Loggerfy } from 'loggerfy';

// Create a logger instance
const logger = new Loggerfy();

// Log an error
logger.error()
  .setCode('AUTH_001')
  .setMessage('User authentication failed')
  .setDetail('Invalid credentials provided')
  .setMetadata({ userId: 123, ip: '192.168.1.10' })
  .write();

// Log an informational message
logger.info()
  .setCode('APP_001')
  .setMessage('Application started successfully')
  .setDetail('Server listening on port 3000')
  .write();
```

## 📘 API Reference

### Log Levels

Loggerfy supports three log levels:

- `info()` - For general information and successful operations
- `warn()` - For non-critical issues that might require attention
- `error()` - For errors and exceptions that need immediate attention

### Methods

Each log level returns a `LoggerfyBase` instance with the following chainable methods:

| Method | Description | Required |
|--------|-------------|----------|
| `setCode(code: string)` | Sets a unique code for the log entry | Yes |
| `setMessage(message: string)` | Sets the main message of the log | Yes |
| `setDetail(detail: string)` | Sets additional details about the log | Yes |
| `setMetadata(metadata: Record<string, any>)` | Sets additional contextual data | No |
| `write(customId?: UUID)` | Writes the log entry (optionally with a custom UUID) | Yes |

### Custom Repository

You can implement a custom repository to store logs in a database or external service:

```typescript
import { Loggerfy, LoggerfyRepository, LogEntry, UUID } from 'loggerfy';

class MongoDBRepository implements LoggerfyRepository {
  async save(log: LogEntry): Promise<void> {
    // Store log in MongoDB
    await db.collection('logs').insertOne(log);
  }
  
  async getById(logId: UUID): Promise<LogEntry> {
    // Retrieve log by ID
    return await db.collection('logs').findOne({ id: logId });
  }
  
  async getAll(criteria: Partial<LogEntry>): Promise<LogEntry[]> {
    // Retrieve logs by criteria
    return await db.collection('logs').find(criteria).toArray();
  }
}

// Create logger with custom repository
const logger = new Loggerfy(new MongoDBRepository());
```

## 💡 Examples

### Basic Usage

```typescript
import { Loggerfy } from 'loggerfy';

const logger = new Loggerfy();

// Log an error
logger.error()
  .setCode('DB_001')
  .setMessage('Database connection failed')
  .setDetail('Could not connect to PostgreSQL database')
  .setMetadata({
    host: 'db.example.com',
    port: 5432,
    attempts: 3
  })
  .write();

// Log a warning
logger.warn()
  .setCode('CACHE_001')
  .setMessage('Cache miss')
  .setDetail('Item not found in cache, fetching from database')
  .setMetadata({ key: 'user:1234', source: 'redis' })
  .write();

// Log info
logger.info()
  .setCode('API_001')
  .setMessage('API request received')
  .setDetail('GET /api/users')
  .setMetadata({ 
    requestId: '5f8d3a9c',
    clientIp: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  })
  .write();
```

### With Custom Repository

```typescript
import { Loggerfy, LoggerfyRepository, LogEntry } from 'loggerfy';

// Simple in-memory repository example
class InMemoryRepository implements LoggerfyRepository {
  private logs: LogEntry[] = [];
  
  async save(log: LogEntry): Promise<void> {
    this.logs.push(log);
    console.log(`Log saved to memory. Total logs: ${this.logs.length}`);
  }
}

const repository = new InMemoryRepository();
const logger = new Loggerfy(repository);

logger.info()
  .setCode('TEST_001')
  .setMessage('Testing custom repository')
  .setDetail('This log will be saved to the in-memory repository')
  .write();
```

### Environment Configuration

Loggerfy automatically uses environment variables for service name and environment:

```typescript
// Set environment variables
process.env.SERVICE_NAME = 'user-service';
process.env.NODE_ENV = 'production';

const logger = new Loggerfy();

logger.info()
  .setCode('ENV_001')
  .setMessage('Environment configured')
  .setDetail('Using production settings')
  .write();

// Output will include:
// "service": "user-service",
// "environment": "production"
```

## 📋 Output Format

All logs are formatted as JSON with the following structure:

```json
{
  "timestamp": "2025-03-06T12:34:56.789Z",
  "id": "c8b7e6a4-1234-5678-9101-abcdef123456",
  "code": "AUTH_001",
  "message": "User authentication failed",
  "detail": "Invalid credentials provided",
  "payload": { "userId": 123, "ip": "192.168.1.10" },
  "level": "ERROR",
  "severity": "ERROR",
  "service": "fleet-management",
  "environment": "production"
}
```

## 🔧 TypeScript Support

Loggerfy is written in TypeScript and includes full type definitions:

```typescript
import { Loggerfy, LoggerLevelType, LogEntry, UUID } from 'loggerfy';

// Use types in your application
const customLogHandler = (entry: LogEntry, level: LoggerLevelType) => {
  // Custom log handling logic
};
```

## 🌟 Best Practices

1. **Use consistent error codes** - Create a coding system for your logs (e.g., AUTH_001, DB_001)
2. **Include contextual data** - Add relevant metadata to make debugging easier
3. **Be specific with messages** - Write clear, concise messages that explain what happened
4. **Use appropriate log levels** - Don't log everything as errors
5. **Implement a custom repository** - For production environments, store logs in a database or log management system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.