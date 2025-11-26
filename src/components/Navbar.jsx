import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav>
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>WattWise</Link>
        <button 
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/impact" onClick={closeMenu}>Impact</Link></li>
          <li><Link to="/quiz" onClick={closeMenu}>Quiz</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          {loading ? (
            <li><span style={{ color: '#999' }}>Loading...</span></li>
          ) : user ? (
            <li><Link to="/profile" className="nav-profile-link" onClick={closeMenu}>My Profile</Link></li>
          ) : (
            <li><Link to="/login" className="nav-login-link" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </nav>
      {isMenuOpen && (
        <div className="nav-overlay" onClick={closeMenu}></div>
      )}
    </>
  )
}

export default Navbar
