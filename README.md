## Loggerfy - A Flexible and Structured Logging Library for Node.js

Loggerfy is a lightweight and customizable logging library designed to provide structured logs with rich metadata. It simplifies the process of logging errors, warnings, and information while ensuring consistency across your application.

Features:
✅ Structured Logs – Each log entry includes a timestamp, unique ID, severity level, and custom metadata.
✅ Fluent API – Easily chain methods to build logs dynamically.
✅ Customizable – Add details such as error codes, messages, and contextual data.
✅ JSON Output – Logs are formatted in a machine-readable JSON structure, making them ideal for logging systems.

### Installation
Install Loggerfy using npm:

```bash
npm install loggerfy

```

### Importing
For CommonJS:

```js
const { Loggerfy } = require('loggerfy');

```

For ES Modules:

```js
import { Loggerfy } from 'loggerfy';

```

### Usage Example:

```js

const log = new Loggerfy();
log.error()
  .setCode('AUTH_001')
  .setDetail('Invalid credentials provided')
  .setMessage('User authentication failed')
  .setMetadata({ userId: 123, ip: '192.168.1.10' })
  .write();

```

### Sample Output:

```json
{
   "timestamp": "2025-03-06T12:34:56.789Z",
   "id": "c8b7e6a4-1234-5678-9101-abcdef123456",
   "code": "AUTH_001",
   "message": "User authentication failed",
   "detail": "Invalid credentials provided",
   "metadata": { "userId": 123, "ip": "192.168.1.10" },
   "level": "ERROR",
   "severity": "ERROR",
   "service": "fleet-management",
   "environment": "production"
}

```

### Log Levels
Loggerfy supports multiple log levels:

```js
const log = new Loggerfy();

log.info()
  .setCode('APP_001')
  .setMessage('Application started')
  .write();

log.warn()
  .setCode('CONFIG_001')
  .setDetail('Using default configuration')
  .write();

log.error()
  .setCode('DB_001')
  .setMessage('Database connection failed')
  .write();

```

### Why Use Loggerfy?

Loggerfy provides a simple, structured, and scalable approach to logging in Node.js applications. It ensures consistency in logs, making debugging and monitoring more efficient. Whether you need logs for local debugging or integration with log management systems, Loggerfy has you covered! 🚀