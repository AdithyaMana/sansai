"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { isMobileDevice } from "./deviceDetection"
import { createLogger } from "./logger"

// Initialize module-specific logger
const logger = createLogger("useAutoScroll")

/**
 * Configuration options for auto-scrolling behavior
 */
interface AutoScrollOptions {
  /** Number of pixels to scroll per interval (default: 3 on desktop, 2 on mobile) */
  pixelsPerScroll?: number

  /** Interval in milliseconds between scroll actions (default: 16ms for ~60fps) */
  scrollInterval?: number

  /** Whether auto-scrolling is initially enabled (default: true) */
  initiallyEnabled?: boolean
}

/**
 * Hook return type with scroll container ref and control functions
 */
interface AutoScrollResult {
  /** Ref to attach to the scrollable container */
  scrollContainerRef: React.RefObject<HTMLDivElement>

  /** Whether the user is currently hovering over the scroll container */
  isHovering: boolean

  /** Set whether the user is hovering over the scroll container */
  setIsHovering: (isHovering: boolean) => void

  /** Manually enable or disable auto-scrolling */
  setAutoScrollEnabled: (enabled: boolean) => void
}

/**
 * Custom hook for implementing auto-scrolling behavior on containers
 *
 * @param options - Configuration options for the auto-scroll behavior
 * @returns Object containing the ref to attach to the container and control functions
 */
export function useAutoScroll(options: AutoScrollOptions = {}): AutoScrollResult {
  // Detect if we're on a mobile device for default settings
  const isMobile = typeof window !== "undefined" ? isMobileDevice() : false

  // Default values with device-specific adjustments
  const {
    pixelsPerScroll = isMobile ? 2 : 3, // Slightly slower on mobile
    scrollInterval = 16, // ~60fps for smooth scrolling
    initiallyEnabled = true,
  } = options

  // Reference to the scrollable container element
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  // State to track if user is hovering over the container (pauses scrolling)
  const [isHovering, setIsHovering] = useState(false)

  // State to track if auto-scrolling is enabled
  const [isAutoScrollEnabled, setAutoScrollEnabled] = useState(initiallyEnabled)

  // Set up the auto-scrolling interval
  useEffect(() => {
    const container = scrollContainerRef.current

    // Skip if container isn't available, user is hovering, or auto-scroll is disabled
    if (!container || isHovering || !isAutoScrollEnabled) {
      logger.debug("Auto-scroll inactive", {
        reason: !container ? "No container" : isHovering ? "User hovering" : "Disabled",
      })
      return
    }

    logger.debug("Auto-scroll active", { pixelsPerScroll, scrollInterval })

    // Set up interval for continuous scrolling
    const interval = setInterval(() => {
      // Check if we've reached the end of the scrollable content
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - pixelsPerScroll

      if (isAtEnd) {
        // Reset to start without animation for seamless looping
        logger.debug("Reached end of scroll content, resetting to start")
        container.scrollLeft = 0
      } else {
        // Smooth scrolling with configured speed
        container.scrollLeft += pixelsPerScroll
      }
    }, scrollInterval)

    // Clean up interval on unmount or when dependencies change
    return () => {
      clearInterval(interval)
      logger.debug("Auto-scroll interval cleared")
    }
  }, [isHovering, pixelsPerScroll, scrollInterval, isAutoScrollEnabled])

  return {
    scrollContainerRef,
    isHovering,
    setIsHovering,
    setAutoScrollEnabled,
  }
}
