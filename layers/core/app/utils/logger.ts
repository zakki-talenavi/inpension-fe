/**
 * Logger levels
 */
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

/**
 * Logger interface
 */
interface LogEntry {
    level: LogLevel
    message: string
    timestamp: string
    context?: Record<string, unknown>
}

/**
 * Centralized logging utility
 * 
 * Features:
 * - Structured logging
 * - Log levels
 * - Context support
 * - Can be extended to send logs to external services
 */
export function useLogger() {
    const isDevelopment = process.env.NODE_ENV === 'development'

    /**
     * Create a log entry
     */
    function createLogEntry(
        level: LogLevel,
        message: string,
        context?: Record<string, unknown>,
    ): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
        }
    }

    /**
     * Log a message
     */
    function log(entry: LogEntry): void {
        // In development, use console
        if (isDevelopment) {
            const contextStr = entry.context ? JSON.stringify(entry.context, null, 2) : ''
            const logMessage = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`

            switch (entry.level) {
                case LogLevel.DEBUG:
                    console.debug(logMessage, contextStr)
                    break
                case LogLevel.INFO:
                    console.info(logMessage, contextStr)
                    break
                case LogLevel.WARN:
                    console.warn(logMessage, contextStr)
                    break
                case LogLevel.ERROR:
                    console.error(logMessage, contextStr)
                    break
            }
        }

        // In production, send to logging service (e.g., Sentry, LogRocket)
        // TODO: Implement production logging
    }

    /**
     * Log debug message
     */
    function debug(message: string, context?: Record<string, unknown>): void {
        log(createLogEntry(LogLevel.DEBUG, message, context))
    }

    /**
     * Log info message
     */
    function info(message: string, context?: Record<string, unknown>): void {
        log(createLogEntry(LogLevel.INFO, message, context))
    }

    /**
     * Log warning message
     */
    function warn(message: string, context?: Record<string, unknown>): void {
        log(createLogEntry(LogLevel.WARN, message, context))
    }

    /**
     * Log error message
     */
    function error(message: string, context?: Record<string, unknown>): void {
        log(createLogEntry(LogLevel.ERROR, message, context))
    }

    return {
        debug,
        info,
        warn,
        error,
    }
}
