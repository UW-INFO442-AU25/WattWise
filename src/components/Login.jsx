import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      // Redirect to profile after successful login
      navigate('/profile')
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.'
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please register first.'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
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
      await signInWithPopup(auth, googleProvider)
      // Redirect to profile after successful login
      navigate('/profile')
    } catch (err) {
      let errorMessage = 'Google sign-in failed. Please try again.'
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.'
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
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-subtitle">
        Sign in to access your saved quiz results and energy savings!
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
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
            className="auth-input"
          />
        </div>

        {error && (
          <div className="auth-error">
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
          {loading ? 'Signing in...' : 'Log In'}
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
          style={{
            opacity: (loading || googleLoading) ? 0.7 : 1
          }}
        >
          {googleLoading ? (
            'Signing in...'
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div>

      <p className="auth-link-text">
        Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
      </p>
    </div>
  )
}

export default Login

