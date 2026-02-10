/**
 * Logger utility for consistent logging across the application
 * Provides different log levels and formatting for better debugging
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogOptions {
  module?: string
  data?: any
}

/**
 * Determines if logging should be enabled based on environment
 * In production, only warnings and errors are logged by default
 */
const isLoggingEnabled = (level: LogLevel): boolean => {
  // In production, only log warnings and errors
  if (process.env.NODE_ENV === "production") {
    return ["warn", "error"].includes(level)
  }
  // In development, log everything
  return true
}

/**
 * Format log message with timestamp, module name, and optional data
 */
const formatLogMessage = (message: string, options?: LogOptions): string => {
  const timestamp = new Date().toISOString()
  const moduleName = options?.module ? `[${options.module}]` : ""
  return `${timestamp} ${moduleName} ${message}`
}

/**
 * Format data for logging, handling circular references
 */
const formatData = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2)
  } catch (error) {
    return `[Unserializable data: ${error instanceof Error ? error.message : String(error)}]`
  }
}

/**
 * Log a debug message
 */
export const logDebug = (message: string, options?: LogOptions): void => {
  if (!isLoggingEnabled("debug")) return

  console.debug(formatLogMessage(message, options))
  if (options?.data) {
    console.debug(formatData(options.data))
  }
}

/**
 * Log an info message
 */
export const logInfo = (message: string, options?: LogOptions): void => {
  if (!isLoggingEnabled("info")) return

  console.info(formatLogMessage(message, options))
  if (options?.data) {
    console.info(formatData(options.data))
  }
}

/**
 * Log a warning message
 */
export const logWarn = (message: string, options?: LogOptions): void => {
  if (!isLoggingEnabled("warn")) return

  console.warn(formatLogMessage(message, options))
  if (options?.data) {
    console.warn(formatData(options.data))
  }
}

/**
 * Log an error message
 */
export const logError = (message: string, error?: Error, options?: LogOptions): void => {
  if (!isLoggingEnabled("error")) return

  console.error(formatLogMessage(message, options))
  if (error) {
    console.error(error)
  }
  if (options?.data) {
    console.error(formatData(options.data))
  }
}

/**
 * Create a logger instance for a specific module
 */
export const createLogger = (moduleName: string) => {
  return {
    debug: (message: string, data?: any) => logDebug(message, { module: moduleName, data }),
    info: (message: string, data?: any) => logInfo(message, { module: moduleName, data }),
    warn: (message: string, data?: any) => logWarn(message, { module: moduleName, data }),
    error: (message: string, error?: Error, data?: any) => logError(message, error, { module: moduleName, data }),
  }
}

export default {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
  createLogger,
}
