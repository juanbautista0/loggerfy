import { randomUUID, UUID, } from 'node:crypto';

export const LoggerLevel = {
    INFO: 'INFO',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
} as const;

export type LoggerLevelType = (typeof LoggerLevel)[keyof typeof LoggerLevel];

export interface LogEntry {
    timestamp?: string;
    id?: UUID;
    code?: string;
    message?: string;
    detail?: string;
    payload?: Record<string, any>;
    level?: LoggerLevelType;
    severity?: string;
    service?: string;
    environment?: string;
}

export interface LoggerfyRepository {
    save(log: LogEntry): Promise<void>
    getById?(logId: UUID): Promise<LogEntry>
    getAll?(criteria: Partial<LogEntry>): Promise<LogEntry>
}

const NULL_UUID = "00000000-0000-0000-0000-000000000000";

class LoggerfyBase {
    private id: UUID = NULL_UUID;
    private code: string = '';
    private message: string = '';
    private detail: string = '';
    private metadata: Record<string, any> = {};
    private level: LoggerLevelType;
    private service: string;
    private environment: string;

    constructor(level: LoggerLevelType, readonly repositoryImpl?: LoggerfyRepository) {
        this.level = level;
        this.service = process.env.SERVICE_NAME || 'default-service';
        this.environment = process.env.NODE_ENV || 'development';
    }

    setCode(code: string): this {
        this.code = code;
        return this;
    }

    setMessage(message: string): this {
        this.message = message;
        return this;
    }

    setDetail(detail: string): this {
        this.detail = detail;
        return this;
    }

    setMetadata<T>(metadata: Record<string, T>): this {
        this.metadata = metadata;
        return this;
    }

    getLog(): string {
        this.id = randomUUID();

        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            id: this.id,
            code: this.code,
            message: this.message,
            detail: this.detail,
            payload: this.metadata,
            level: this.level,
            severity: this.level,
            service: this.service,
            environment: this.environment
        };

        const log = JSON.stringify(logEntry)

        this.reset();
        return log
    }

    write(customId?: UUID): void {
        if (!this.code || !this.message || !this.detail) {
            return;
        }

        this.id = customId ?? randomUUID();

        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            id: this.id,
            code: this.code,
            message: this.message,
            detail: this.detail,
            payload: this.metadata,
            level: this.level,
            severity: this.level,
            service: this.service,
            environment: this.environment
        };

        console.log(JSON.stringify(logEntry));

        if (typeof this.repositoryImpl !== 'undefined') {
            this.repositoryImpl.save(logEntry);
        }
        this.reset();
    }

    private reset(): void {
        this.id = NULL_UUID;
        this.code = '';
        this.message = '';
        this.detail = '';
        this.metadata = {};
    }
}

/**
 * Main application Loggerfy.
 *
 * ### Usage example:
 * ```js
 * const log = new Loggerfy();
 * log.error()
 *   .setCode('AUTH_001')
 *   .setDetail('Invalid credentials provided')
 *   .setMessage('User authentication failed')
 *   .setMetadata({ userId: 123, ip: '192.168.1.10' })
 *   .write();
 * ```
 * ### Output example:
 * ```json
 * {
 *    "timestamp": "2025-03-06T12:34:56.789Z",
 *    "id": "c8b7e6a4-1234-5678-9101-abcdef123456",
 *    "code": "AUTH_001",
 *    "message": "User authentication failed",
 *    "detail": "Invalid credentials provided",
 *    "metadata": { "userId": 123, "ip": "192.168.1.10" },
 *    "level": "ERROR",
 *    "severity": "ERROR",
 *    "service": "fleet-management",
 *    "environment": "production"
 * }
 * ```
 */
export class Loggerfy {
    public constructor(readonly repository?: LoggerfyRepository) { }
    info(): LoggerfyBase {
        return new LoggerfyBase(LoggerLevel.INFO, this.repository);
    }
    warn(): LoggerfyBase {
        return new LoggerfyBase(LoggerLevel.WARNING, this.repository);
    }
    error(): LoggerfyBase {
        return new LoggerfyBase(LoggerLevel.ERROR, this.repository);
    }
}
