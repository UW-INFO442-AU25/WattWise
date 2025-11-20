import { useState, useEffect } from 'react'
import { getLatestQuizResults } from '../services/userService'

export function useQuizResults(userId) {
  const [hasResults, setHasResults] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setHasResults(false)
      setLoading(false)
      return
    }

    const checkResults = async () => {
      try {
        const results = await getLatestQuizResults(userId)
        setHasResults(results !== null && results.results && results.results.length > 0)
      } catch (error) {
        console.error('Error checking quiz results:', error)
        setHasResults(false)
      } finally {
        setLoading(false)
      }
    }

    checkResults()
  }, [userId])

  return { hasResults, loading }
}

