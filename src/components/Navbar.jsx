import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuizResults } from '../hooks/useQuizResults'
import QuizConfirmationModal from './QuizConfirmationModal'

function Navbar() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { hasResults, loading: resultsLoading } = useQuizResults(user?.uid)
  const [showModal, setShowModal] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const handleQuizClick = (e) => {
    e.preventDefault()
    closeMenu()
    // Show modal if user is logged in and has results
    if (user && hasResults) {
      setShowModal(true)
    } else {
      navigate('/quiz')
    }
  }

  const handleConfirm = () => {
    setShowModal(false)
    navigate('/quiz')
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav>
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="WattWise Home">WattWise</Link>
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
          <li>
            {user && !resultsLoading && hasResults ? (
              <a href="/quiz" onClick={handleQuizClick} style={{ cursor: 'pointer' }}>Quiz</a>
            ) : (
              <Link to="/quiz" onClick={closeMenu}>Quiz</Link>
            )}
          </li>
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
      <QuizConfirmationModal 
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}

export default Navbar
