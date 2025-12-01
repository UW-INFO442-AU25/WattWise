import { useState, useRef, useEffect } from 'react'

/**
 * Tooltip component that works on both desktop (hover) and mobile (tap)
 * @param {ReactNode} children - The content that triggers the tooltip
 * @param {string} content - The tooltip text to display
 * @param {string} term - The term being explained (for accessibility)
 */
function Tooltip({ children, content, term }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState('top')
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)
  const timeoutRef = useRef(null)

  // Check if device supports hover
  const hasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  // Handle tooltip positioning
  useEffect(() => {
    if (isOpen && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current
      const trigger = triggerRef.current
      const rect = trigger.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      
      // Check available space
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceLeft = rect.left
      const spaceRight = window.innerWidth - rect.right

      // Position tooltip
      let newPosition = 'top'
      if (spaceBelow < tooltipRect.height && spaceAbove > spaceBelow) {
        newPosition = 'bottom'
      } else if (spaceRight < tooltipRect.width / 2 && spaceLeft > spaceRight) {
        newPosition = 'left'
      } else if (spaceLeft < tooltipRect.width / 2) {
        newPosition = 'right'
      }

      setPosition(newPosition)

      // Adjust tooltip position to stay within viewport
      let tooltipLeft, tooltipTop
      
      if (newPosition === 'bottom' || newPosition === 'top') {
        // Center horizontally above/below trigger
        tooltipLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        tooltipTop = newPosition === 'bottom' 
          ? rect.bottom + 8 
          : rect.top - tooltipRect.height - 8
      } else {
        // Position to left/right of trigger
        tooltipLeft = newPosition === 'right'
          ? rect.right + 8
          : rect.left - tooltipRect.width - 8
        tooltipTop = rect.top + (rect.height / 2) - (tooltipRect.height / 2)
      }

      // Clamp to viewport with padding
      const padding = 10
      const clampedLeft = Math.max(padding, Math.min(tooltipLeft, window.innerWidth - tooltipRect.width - padding))
      const clampedTop = Math.max(padding, Math.min(tooltipTop, window.innerHeight - tooltipRect.height - padding))

      tooltip.style.left = `${clampedLeft}px`
      tooltip.style.top = `${clampedTop}px`
    }
  }, [isOpen])

  // Close tooltip when clicking outside (mobile)
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      const target = event.target
      
      // Don't close if clicking on a radio button - let that selection happen
      if (target.type === 'radio') {
        // Close tooltip after a brief delay to allow radio selection
        setTimeout(() => setIsOpen(false), 100)
        return
      }
      
      // Don't close if clicking on the label (but not the tooltip trigger)
      const label = target.closest('label.quiz-radio-label')
      if (label && !triggerRef.current?.contains(target)) {
        // Allow label click to proceed, close tooltip
        setTimeout(() => setIsOpen(false), 50)
        return
      }

      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(target) &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    // Close on scroll (mobile)
    const handleScroll = () => {
      setIsOpen(false)
    }

    // Use capture phase and slight delay to allow radio clicks to register first
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
      }, 200) // Small delay to avoid accidental triggers
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
    // Check if we're inside a label - if so, don't interfere with radio button selection
    const isInsideLabel = e.target.closest('label.quiz-radio-label')
    
    if (isInsideLabel) {
      // Inside labels, we only use hover (desktop) - don't handle clicks
      // This allows the label to handle radio button selection normally
      // On mobile, users can still see tooltips via hover simulation or we skip click handling
      return
    }
    
    // For non-label contexts (like in questions), handle normally
    if (!hasHover) {
      // Only toggle on mobile when not in a label
      if (isOpen) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span className="tooltip-wrapper">
      <span
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-describedby={isOpen ? `tooltip-${term}` : undefined}
        role="button"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            handleClick(e)
          } else if (e.key === 'Escape' && isOpen) {
            setIsOpen(false)
          }
        }}
      >
        {children}
      </span>
      {isOpen && (
        <span
          id={`tooltip-${term}`}
          ref={tooltipRef}
          className={`tooltip-content tooltip-${position}`}
          role="tooltip"
          aria-live="polite"
        >
          {content}
        </span>
      )}
    </span>
  )
}

export default Tooltip

