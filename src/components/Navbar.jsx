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
      <div className="logo">WattWise</div>
      <ul className="nav-links">
        <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
        <li><a href="#info" onClick={(e) => handleNavClick(e, 'info')}>Savings</a></li>
        <li><a href="#impact" onClick={(e) => handleNavClick(e, 'impact')}>Impact</a></li>
        <li><a href="#quiz" onClick={(e) => handleNavClick(e, 'quiz')}>Quiz</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
