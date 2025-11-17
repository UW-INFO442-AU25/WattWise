import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

function MyProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        // Redirect to register page if not logged in
        navigate('/register')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show loading state
  if (loading) {
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

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-card">
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="profile-photo"
          />
        )}
        <p className="profile-info">
          <strong>Name:</strong> {user.displayName || 'Not set'}
        </p>
        <p className="profile-info">
          <strong>Email:</strong> {user.email}
        </p>
        <button
          onClick={handleSignOut}
          className="profile-signout-button"
        >
          Sign Out
        </button>
      </div>
      <p className="profile-footer-text">Your saved quiz results and energy savings will appear here!</p>
    </div>
  )
}

export default MyProfile

