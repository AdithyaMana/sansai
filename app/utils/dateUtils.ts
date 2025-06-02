import { createLogger } from "./logger"

// Initialize module-specific logger
const logger = createLogger("DateUtils")

/**
 * Default date format options
 */
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
}

/**
 * Default date-time format options
 */
const DEFAULT_DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  ...DEFAULT_DATE_OPTIONS,
  hour: "numeric",
  minute: "numeric",
}

/**
 * Default time format options
 */
const DEFAULT_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
}

/**
 * Format a date to a readable string (e.g., "Jan 1, 2023")
 *
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param options - Optional Intl.DateTimeFormatOptions to customize formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
): string {
  try {
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }

    return dateObj.toLocaleDateString("en-US", options)
  } catch (error) {
    logger.error("Error formatting date", error instanceof Error ? error : new Error(String(error)), { date })
    // Return fallback value
    return "Invalid date"
  }
}

/**
 * Format a date with time (e.g., "Jan 1, 2023, 3:30 PM")
 *
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param options - Optional Intl.DateTimeFormatOptions to customize formatting
 * @returns Formatted date-time string
 */
export function formatDateTime(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATETIME_OPTIONS,
): string {
  try {
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }

    return dateObj.toLocaleDateString("en-US", options)
  } catch (error) {
    logger.error("Error formatting date-time", error instanceof Error ? error : new Error(String(error)), { date })
    // Return fallback value
    return "Invalid date"
  }
}

/**
 * Format time only (e.g., "3:30 PM")
 *
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param options - Optional Intl.DateTimeFormatOptions to customize formatting
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = DEFAULT_TIME_OPTIONS,
): string {
  try {
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }

    return dateObj.toLocaleTimeString("en-US", options)
  } catch (error) {
    logger.error("Error formatting time", error instanceof Error ? error : new Error(String(error)), { date })
    // Return fallback value
    return "Invalid time"
  }
}

/**
 * Get current year (for copyright notices)
 * @returns Current year as a number
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * Check if a date is today
 *
 * @param date - Date to check (Date object, ISO string, or timestamp)
 * @returns Boolean indicating if the date is today
 */
export function isToday(date: Date | string | number): boolean {
  try {
    const today = new Date()
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }

    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    )
  } catch (error) {
    logger.error("Error checking if date is today", error instanceof Error ? error : new Error(String(error)), { date })
    return false
  }
}

/**
 * Add days to a date
 *
 * @param date - Base date (Date object, ISO string, or timestamp)
 * @param days - Number of days to add (can be negative)
 * @returns New Date object with days added
 */
export function addDays(date: Date | string | number, days: number): Date {
  try {
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }

    const result = new Date(dateObj)
    result.setDate(result.getDate() + days)
    return result
  } catch (error) {
    logger.error("Error adding days to date", error instanceof Error ? error : new Error(String(error)), { date, days })
    // Return current date as fallback
    return new Date()
  }
}

/**
 * Subtract days from a date
 *
 * @param date - Base date (Date object, ISO string, or timestamp)
 * @param days - Number of days to subtract (can be negative)
 * @returns New Date object with days subtracted
 */
export function subtractDays(date: Date | string | number, days: number): Date {
  return addDays(date, -days)
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to format relative to now (Date object, ISO string, or timestamp)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  try {
    const now = new Date()
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }

    const diffMs = dateObj.getTime() - now.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 0) {
      // Past
      if (diffSec > -60) return `${-diffSec} seconds ago`
      if (diffMin > -60) return `${-diffMin} minutes ago`
      if (diffHour > -24) return `${-diffHour} hours ago`
      if (diffDay > -30) return `${-diffDay} days ago`
      return formatDate(date)
    } else {
      // Future
      if (diffSec < 60) return `in ${diffSec} seconds`
      if (diffMin < 60) return `in ${diffMin} minutes`
      if (diffHour < 24) return `in ${diffHour} hours`
      if (diffDay < 30) return `in ${diffDay} days`
      return formatDate(date)
    }
  } catch (error) {
    logger.error("Error formatting relative time", error instanceof Error ? error : new Error(String(error)), { date })
    // Return fallback value
    return "Unknown time"
  }
}
