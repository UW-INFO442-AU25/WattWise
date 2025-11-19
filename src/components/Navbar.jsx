import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <nav>
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>WattWise</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/impact">Impact</Link></li>
        <li><Link to="/quiz">Quiz</Link></li>
        <li><Link to="/about">About</Link></li>
        {loading ? (
          <li><span style={{ color: '#999' }}>Loading...</span></li>
        ) : user ? (
          <li><Link to="/profile" className="nav-profile-link">My Profile</Link></li>
        ) : (
          <li><Link to="/login" className="nav-login-link">Login</Link></li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
