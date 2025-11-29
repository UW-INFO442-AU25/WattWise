import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { saveUserProfile, saveQuizResults } from '../services/userService'

function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  // Check if coming from quiz results page
  const quizResults = location.state?.results
  const quizAnswers = location.state?.quizAnswers
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      
      // Update the user's display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: formData.name
      })
      
      // Save user profile to Firestore
      await saveUserProfile(userCredential.user.uid, {
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString()
      })
      
      // Save quiz results if coming from quiz results page
      if (quizResults && quizResults.length > 0) {
        try {
          await saveQuizResults(userCredential.user.uid, quizResults, quizAnswers || {})
          console.log('Quiz results saved after registration')
        } catch (error) {
          console.error('Error saving quiz results after registration:', error)
          // Don't block registration if quiz save fails
        }
      }
      
      // Redirect to profile after successful registration
      navigate('/profile')
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.'
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in instead.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.'
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)

    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      const user = userCredential.user
      
      // Save/update user profile to Firestore (for both new and existing users)
      await saveUserProfile(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || null
      })
      
      // Save quiz results if coming from quiz results page
      if (quizResults && quizResults.length > 0) {
        try {
          await saveQuizResults(user.uid, quizResults, quizAnswers || {})
          console.log('Quiz results saved after Google registration')
        } catch (error) {
          console.error('Error saving quiz results after Google registration:', error)
          // Don't block registration if quiz save fails
        }
      }
      
      // Redirect to profile after successful registration/login
      navigate('/profile')
    } catch (err) {
      let errorMessage = 'Google sign-in failed. Please try again.'
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.'
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please log in instead.'
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">Create Your Account</h1>
      <p className="auth-subtitle">
        Sign up to save your quiz results and track your energy savings!
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="name" className="auth-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="auth-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="auth-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="auth-input"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="auth-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="auth-input"
          />
        </div>

        {error && (
          <div className="auth-error" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="cta-button auth-button"
          style={{
            opacity: (loading || googleLoading) ? 0.7 : 1,
            cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="auth-divider">
        <div className="auth-divider-line">
          <span className="auth-divider-text">OR</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="auth-google-button"
          aria-label="Sign up with Google"
          style={{
            opacity: (loading || googleLoading) ? 0.7 : 1
          }}
        >
          {googleLoading ? (
            'Signing up...'
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </>
          )}
        </button>
      </div>

      <p className="auth-link-text">
        Already have an account? <Link to="/login" className="auth-link">Log in</Link>
      </p>
    </div>
  )
}

export default Register

