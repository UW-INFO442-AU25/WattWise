import { useEffect, useRef } from 'react'

export function useIntersectionObserver(threshold = 0.2, rootMargin = '0px 0px -100px 0px') {
  const elementRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      threshold,
      rootMargin
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin])

  return elementRef
}

