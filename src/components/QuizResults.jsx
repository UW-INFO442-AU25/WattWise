import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { saveQuizResults } from '../services/userService'

function QuizResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const results = location.state?.results || []
  const quizAnswers = location.state?.quizAnswers || {}
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Auto-save results if user is logged in
  useEffect(() => {
    if (!authLoading && user && results.length > 0) {
      const saveResults = async () => {
        setSaving(true)
        try {
          // Save quiz results, overwriting any previous results (most recent only)
          await saveQuizResults(user.uid, results, quizAnswers)
          setSaveSuccess(true)
          console.log('Quiz results saved successfully')
        } catch (error) {
          console.error('Error saving quiz results:', error)
          // Don't show error to user, just log it
        } finally {
          setSaving(false)
        }
      }
      saveResults()
    }
  }, [user, authLoading, results, quizAnswers])

  // If no results, redirect to quiz
  if (results.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '6rem auto 3rem', padding: '2rem', textAlign: 'center' }}>
        <h2>No results found</h2>
        <p style={{ marginBottom: '2rem' }}>It looks like you haven't completed the quiz yet.</p>
        <Link to="/quiz" className="cta-button">Take the Quiz</Link>
      </div>
    )
  }

  // Categorize recommendations
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

  const categorized = results.reduce((acc, rec) => {
    const category = categorizeRecommendation(rec)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(rec)
    return acc
  }, {})

  // Extract savings estimates from recommendations
  const extractSavings = (rec) => {
    const dollarMatch = rec.match(/\$(\d+)/g)
    if (dollarMatch) {
      const amounts = dollarMatch.map(m => parseInt(m.replace('$', '')))
      return Math.max(...amounts)
    }
    return null
  }

  const totalSavings = results.reduce((sum, rec) => {
    const savings = extractSavings(rec)
    return sum + (savings || 0)
  }, 0)

  const categoryIcons = {
    'Lighting': '💡',
    'Energy Efficiency': '⚡',
    'Water Conservation': '💧',
    'Appliances': '🏠',
    'Heating & Cooling': '🌡️',
    'General': '✨',
    'Other': '📋'
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '6rem auto 3rem', padding: '2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#7FAFCA', marginBottom: '1rem' }}>
          Your Personalized Recommendations
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#2F3A3D', marginBottom: '2rem' }}>
          Based on your quiz responses, here are your opportunities to save money and reduce your environmental impact.
        </p>
      </div>

      {/* Summary Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #7FAFCA 0%, #7BA88F 100%)',
        padding: '2rem',
        borderRadius: '20px',
        color: 'white',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {results.length}
            </div>
            <div style={{ fontSize: '1.1rem' }}>Recommendations</div>
          </div>
          {totalSavings > 0 && (
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ${totalSavings}+
              </div>
              <div style={{ fontSize: '1.1rem' }}>Estimated Annual Savings</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {Object.keys(categorized).length}
            </div>
            <div style={{ fontSize: '1.1rem' }}>Impact Areas</div>
          </div>
        </div>
      </div>

      {/* Registration/Login Prompt - Only show if user is not logged in */}
      {!authLoading && !user && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(127, 175, 202, 0.1) 0%, rgba(123, 168, 143, 0.1) 100%)',
          padding: '2rem',
          borderRadius: '15px',
          border: '2px solid #7FAFCA',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#2F3A3D', marginBottom: '1.5rem', fontWeight: '600' }}>
            Want to save your results and view checklist? Log in!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/login" 
              state={{ results, quizAnswers }}
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'white',
                color: '#7FAFCA',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                border: '2px solid #7FAFCA',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(127, 175, 202, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              Login Here!
            </Link>
            <Link 
              to="/register" 
              state={{ results, quizAnswers }}
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #7FAFCA 0%, #7BA88F 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(127, 175, 202, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              Register Here!
            </Link>
          </div>
        </div>
      )}

      {/* Save Success Message - Show if user is logged in and results were saved */}
      {!authLoading && user && saveSuccess && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(123, 168, 143, 0.2) 0%, rgba(127, 175, 202, 0.2) 100%)',
          padding: '1.5rem',
          borderRadius: '15px',
          border: '2px solid #7BA88F',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#2F3A3D', fontWeight: '600' }}>
            ✓ Your quiz results have been saved to your profile!
          </p>
        </div>
      )}

      {/* View Checklist Prompt - Show if user is logged in */}
      {!authLoading && user && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(127, 175, 202, 0.1) 0%, rgba(123, 168, 143, 0.1) 100%)',
          padding: '2rem',
          borderRadius: '15px',
          border: '2px solid #7FAFCA',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#2F3A3D', marginBottom: '1.5rem', fontWeight: '600' }}>
            Want to take action?
          </p>
          <Link
            to="/profile?view=checklist"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #7FAFCA 0%, #7BA88F 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(127, 175, 202, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
            View checklist!
          </Link>
        </div>
      )}

      {/* Categorized Recommendations */}
      <div style={{ marginBottom: '3rem' }}>
        {Object.entries(categorized).map(([category, recs]) => (
          <div key={category} style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            marginBottom: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '2px solid #E9E4DC'
          }}>
            <h2 style={{
              color: '#7FAFCA',
              fontSize: '1.8rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '2rem' }}>{categoryIcons[category] || '📋'}</span>
              {category}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recs.map((rec, index) => {
                const savings = extractSavings(rec)
                return (
                  <li key={index} style={{
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    background: '#E9E4DC',
                    borderRadius: '10px',
                    borderLeft: '4px solid #7BA88F',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}>
                    <p style={{ margin: 0, flex: 1, fontSize: '1.05rem', lineHeight: '1.6', color: '#2F3A3D' }}>
                      {rec}
                    </p>
                    {savings && (
                      <div style={{
                        background: 'linear-gradient(135deg, #7FAFCA 0%, #7BA88F 100%)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}>
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

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '3rem'
      }}>
        <button
          onClick={() => navigate('/quiz')}
          className="cta-button"
          style={{ minWidth: '200px' }}
        >
          Retake Quiz
        </button>
        <Link
          to="/"
          className="cta-button"
          style={{
            display: 'inline-block',
            textAlign: 'center',
            minWidth: '200px',
            textDecoration: 'none'
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default QuizResults

