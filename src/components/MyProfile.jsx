import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { getLatestQuizResults } from '../services/userService'

function MyProfile() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [quizResults, setQuizResults] = useState(null)
  const [loadingQuiz, setLoadingQuiz] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to register page if not logged in
        navigate('/register')
      } else {
        // Fetch quiz results
        const fetchQuizResults = async () => {
          try {
            const latestResults = await getLatestQuizResults(user.uid)
            setQuizResults(latestResults)
          } catch (error) {
            console.error('Error fetching quiz results:', error)
          } finally {
            setLoadingQuiz(false)
          }
        }
        fetchQuizResults()
      }
    }
  }, [user, authLoading, navigate])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show loading state
  if (authLoading || loadingQuiz) {
    return (
      <div className="profile-loading">
        <p>Loading...</p>
      </div>
    )
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null
  }

  // Helper functions for displaying quiz results (same as QuizResults component)
  const categorizeRecommendation = (rec) => {
    const lowerRec = rec.toLowerCase()
    if (lowerRec.includes('led') || lowerRec.includes('bulb') || lowerRec.includes('lighting')) {
      return 'Lighting'
    }
    if (lowerRec.includes('power strip') || lowerRec.includes('phantom') || lowerRec.includes('plugged')) {
      return 'Energy Efficiency'
    }
    if (lowerRec.includes('shower') || lowerRec.includes('water') || lowerRec.includes('low-flow') || lowerRec.includes('gallon')) {
      return 'Water Conservation'
    }
    if (lowerRec.includes('oven') || lowerRec.includes('washer') || lowerRec.includes('dishwasher') || lowerRec.includes('appliance')) {
      return 'Appliances'
    }
    if (lowerRec.includes('heating') || lowerRec.includes('heat pump') || lowerRec.includes('thermostat')) {
      return 'Heating & Cooling'
    }
    if (lowerRec.includes('optimize') || lowerRec.includes('discover') || lowerRec.includes('energy star')) {
      return 'General'
    }
    return 'Other'
  }

  const extractSavings = (rec) => {
    const dollarMatch = rec.match(/\$(\d+)/g)
    if (dollarMatch) {
      const amounts = dollarMatch.map(m => parseInt(m.replace('$', '')))
      return Math.max(...amounts)
    }
    return null
  }

  const categoryIcons = {
    'Lighting': '💡',
    'Energy Efficiency': '⚡',
    'Water Conservation': '💧',
    'Appliances': '🏠',
    'Heating & Cooling': '🌡️',
    'General': '✨',
    'Other': '📋'
  }

  // Process quiz results if available
  const results = quizResults?.results || []
  const categorized = results.reduce((acc, rec) => {
    const category = categorizeRecommendation(rec)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(rec)
    return acc
  }, {})

  const totalSavings = results.reduce((sum, rec) => {
    const savings = extractSavings(rec)
    return sum + (savings || 0)
  }, 0)

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-card">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="profile-photo"
          />
        ) : (
          <div className="profile-photo" style={{
            background: 'linear-gradient(135deg, #6BA3C7 0%, #7AB89A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            fontWeight: '700'
          }}>
            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="profile-info">
          <div className="profile-info-item">
            <strong>Name:</strong>
            <span>{user.displayName || 'Not set'}</span>
          </div>
          <div className="profile-info-item">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="profile-signout-button"
        >
          Sign Out
        </button>
      </div>
      
      {/* Quiz Results Section */}
      {quizResults && results.length > 0 ? (
        <div className="profile-quiz-results">
          <h2 className="profile-title profile-quiz-results-title">
            Your Quiz Results
          </h2>
          {quizResults.completedAt && (
            <p className="profile-quiz-date">
              Completed on {new Date(quizResults.completedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}

          {/* Summary Section */}
          <div className="profile-quiz-summary">
            <div className="profile-quiz-summary-grid">
              <div>
                <div className="profile-quiz-summary-item">
                  {results.length}
                </div>
                <div className="profile-quiz-summary-label">Recommendations</div>
              </div>
              {totalSavings > 0 && (
                <div>
                  <div className="profile-quiz-summary-item">
                    ${totalSavings}+
                  </div>
                  <div className="profile-quiz-summary-label">Estimated Annual Savings</div>
                </div>
              )}
              <div>
                <div className="profile-quiz-summary-item">
                  {Object.keys(categorized).length}
                </div>
                <div className="profile-quiz-summary-label">Impact Areas</div>
              </div>
            </div>
          </div>

          {/* Categorized Recommendations */}
          <div className="profile-quiz-categories">
            {Object.entries(categorized).map(([category, recs]) => (
              <div key={category} className="profile-quiz-category-card">
                <h3 className="profile-quiz-category-title">
                  <span className="profile-quiz-category-icon">{categoryIcons[category] || '📋'}</span>
                  {category}
                </h3>
                <ul className="profile-quiz-category-list">
                  {recs.map((rec, index) => {
                    const savings = extractSavings(rec)
                    return (
                      <li key={index} className="profile-quiz-recommendation">
                        <p className="profile-quiz-recommendation-text">
                          {rec}
                        </p>
                        {savings && (
                          <div className="profile-quiz-savings-badge">
                            ${savings}/yr
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="profile-quiz-actions">
            <Link
              to="/quiz"
              className="cta-button"
            >
              Retake Quiz
            </Link>
          </div>
        </div>
      ) : (
        <div className="profile-no-quiz">
          <p className="profile-footer-text profile-no-quiz-text">
            You haven't completed the quiz yet. Take the quiz to see your personalized recommendations!
          </p>
          <Link
            to="/quiz"
            className="cta-button"
          >
            Take the Quiz
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyProfile

