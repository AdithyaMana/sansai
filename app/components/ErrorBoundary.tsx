"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { createLogger } from "../utils/logger"

// Initialize module-specific logger
const logger = createLogger("ErrorBoundary")

interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode

  /** Optional custom fallback UI component */
  fallback?: ReactNode

  /** Optional error handler function */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean

  /** The error that was caught */
  error: Error | null
}

/**
 * Component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  /**
   * Update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * Log error information when component catches an error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    logger.error("Component error caught by boundary", error, { componentStack: errorInfo.componentStack })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * Reset error state to allow recovery
   */
  resetErrorBoundary = (): void => {
    logger.info("Resetting error boundary")
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or default error message
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary-fallback">
          <h2>Something went wrong</h2>
          <p>We apologize for the inconvenience. Please try again later.</p>
          {process.env.NODE_ENV !== "production" && this.state.error && (
            <details>
              <summary>Error details (development only)</summary>
              <pre>{this.state.error.toString()}</pre>
            </details>
          )}
          <button onClick={this.resetErrorBoundary}>Try again</button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
