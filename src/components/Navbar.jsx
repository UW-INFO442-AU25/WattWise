import { Link } from 'react-router-dom'

function Navbar() {
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
        <li><Link to="/about">About</Link></li>
        <li><Link to="/profile">My Profile</Link></li>
        <li><Link to="/impact">Impact</Link></li>
        <li><Link to="/quiz">Quiz</Link></li>
        {/* <li><a href="#quiz" onClick={(e) => handleNavClick(e, 'quiz')}>Quiz</a></li> */}
      </ul>
    </nav>
  )
}

export default Navbar
