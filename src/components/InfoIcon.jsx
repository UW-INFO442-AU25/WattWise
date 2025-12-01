import { useState, useRef, useEffect } from 'react'

/**
 * InfoIcon component - displays an "i" icon that shows a tooltip on hover/click
 * @param {string} content - The tooltip text to display
 * @param {string} term - The term being explained (for accessibility)
 */
function InfoIcon({ content, term }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState('right')
  const tooltipRef = useRef(null)
  const iconRef = useRef(null)
  const timeoutRef = useRef(null)

  // Check if device supports hover
  const hasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  // Handle tooltip positioning
  useEffect(() => {
    if (isOpen && tooltipRef.current && iconRef.current) {
      const tooltip = tooltipRef.current
      const icon = iconRef.current
      const rect = icon.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      
      // Check available space
      const spaceRight = window.innerWidth - rect.right
      const spaceLeft = rect.left
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom

      // Position tooltip (prefer right, then left, then top/bottom)
      let newPosition = 'right'
      if (spaceRight < tooltipRect.width && spaceLeft > spaceRight) {
        newPosition = 'left'
      } else if (spaceBelow < tooltipRect.height && spaceAbove > spaceBelow) {
        newPosition = 'top'
      } else if (spaceBelow < tooltipRect.height) {
        newPosition = 'bottom'
      }

      setPosition(newPosition)

      // Calculate position
      let tooltipLeft, tooltipTop
      
      if (newPosition === 'right') {
        tooltipLeft = rect.right + 8
        tooltipTop = rect.top + (rect.height / 2) - (tooltipRect.height / 2)
      } else if (newPosition === 'left') {
        tooltipLeft = rect.left - tooltipRect.width - 8
        tooltipTop = rect.top + (rect.height / 2) - (tooltipRect.height / 2)
      } else if (newPosition === 'top') {
        tooltipLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        tooltipTop = rect.top - tooltipRect.height - 8
      } else {
        tooltipLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        tooltipTop = rect.bottom + 8
      }

      // Clamp to viewport with padding
      const padding = 10
      const clampedLeft = Math.max(padding, Math.min(tooltipLeft, window.innerWidth - tooltipRect.width - padding))
      const clampedTop = Math.max(padding, Math.min(tooltipTop, window.innerHeight - tooltipRect.height - padding))

      tooltip.style.left = `${clampedLeft}px`
      tooltip.style.top = `${clampedTop}px`
    }
  }, [isOpen])

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        iconRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      setIsOpen(false)
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true)
      document.addEventListener('touchstart', handleClickOutside, true)
    }, 0)

    window.addEventListener('scroll', handleScroll, true)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('touchstart', handleClickOutside, true)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  // Desktop: hover handlers
  const handleMouseEnter = () => {
    if (hasHover) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true)
      }, 200)
    }
  }

  const handleMouseLeave = () => {
    if (hasHover) {
      clearTimeout(timeoutRef.current)
      setIsOpen(false)
    }
  }

  // Mobile/Desktop: click/tap handler
  const handleClick = (e) => {
    // Stop propagation to prevent label click from selecting radio
    e.preventDefault()
    e.stopPropagation()
    
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span className="info-icon-wrapper">
      <button
        ref={iconRef}
        type="button"
        className="info-icon-button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label={`Information about ${term}`}
        aria-describedby={isOpen ? `info-tooltip-${term}` : undefined}
        aria-expanded={isOpen}
      >
        <span className="info-icon-text" aria-hidden="true">i</span>
      </button>
      {isOpen && (
        <span
          id={`info-tooltip-${term}`}
          ref={tooltipRef}
          className={`info-icon-tooltip info-icon-tooltip-${position}`}
          role="tooltip"
          aria-live="polite"
        >
          {content}
        </span>
      )}
    </span>
  )
}

export default InfoIcon

