import { createLogger } from "./logger"

// Initialize module-specific logger
const logger = createLogger("ApiUtils")

/**
 * API response structure
 */
interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
  ok: boolean
}

/**
 * Options for API requests
 */
interface ApiRequestOptions extends RequestInit {
  /** Request timeout in milliseconds */
  timeout?: number
}

/**
 * Default request options
 */
const DEFAULT_OPTIONS: ApiRequestOptions = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
}

/**
 * Handles API requests with consistent error handling and logging
 *
 * @param url - API endpoint URL
 * @param options - Request options including method, body, headers, etc.
 * @returns Promise resolving to a structured API response
 */
export async function apiRequest<T = any>(url: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  // Merge default options with provided options
  const requestOptions: ApiRequestOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers,
    },
  }

  // Extract timeout from options
  const { timeout } = requestOptions
  delete requestOptions.timeout

  try {
    logger.debug("API request initiated", {
      url,
      method: requestOptions.method || "GET",
    })

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null

    // Add signal to request options
    const fetchOptions = {
      ...requestOptions,
      signal: controller.signal,
    }

    // Execute fetch request
    const response = await fetch(url, fetchOptions)

    // Clear timeout if it was set
    if (timeoutId) clearTimeout(timeoutId)

    // Parse response data
    let data
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Log response details
    logger.debug("API response received", {
      url,
      status: response.status,
      ok: response.ok,
    })

    // Return structured response
    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.error || "Unknown error occurred",
      status: response.status,
      ok: response.ok,
    }
  } catch (error) {
    // Handle network errors, timeouts, etc.
    const isAbortError = error instanceof DOMException && error.name === "AbortError"
    const errorMessage = isAbortError
      ? `Request timeout after ${timeout}ms`
      : error instanceof Error
        ? error.message
        : String(error)

    logger.error("API request failed", error instanceof Error ? error : new Error(String(error)), {
      url,
      method: requestOptions.method || "GET",
    })

    // Return structured error response
    return {
      error: errorMessage,
      status: isAbortError ? 408 : 0, // 408 Request Timeout
      ok: false,
    }
  }
}

/**
 * Shorthand for GET requests
 */
export function get<T = any>(url: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: "GET" })
}

/**
 * Shorthand for POST requests
 */
export function post<T = any>(url: string, data: any, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Shorthand for PUT requests
 */
export function put<T = any>(url: string, data: any, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Shorthand for DELETE requests
 */
export function del<T = any>(url: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: "DELETE" })
}

export default {
  request: apiRequest,
  get,
  post,
  put,
  delete: del,
}
