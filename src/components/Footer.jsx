import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Footer() {
  const { user } = useAuth()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Quick Links Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/impact">Impact</Link></li>
              <li><Link to="/quiz">Quiz</Link></li>
              <li><Link to="/about">About</Link></li>
              {user ? (
                <li><Link to="/profile">My Profile</Link></li>
              ) : (
                <li><Link to="/login">Login</Link></li>
              )}
            </ul>
          </div>

          {/* About/Information Section */}
          <div className="footer-section">
            <h3 className="footer-heading">About WattWise</h3>
            <p className="footer-description">
              Empowering Washington homeowners to save energy and money through 
              personalized recommendations and actionable insights.
            </p>
            <p className="footer-sdg">
              Supporting <strong>UN SDG 12</strong>: Responsible Consumption & Production
            </p>
            <Link to="/about" className="footer-learn-more">Learn more →</Link>
          </div>

          {/* Resources Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li>
                <a 
                  href="https://www.un.org/sustainabledevelopment/sustainable-consumption-production/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-external-link"
                >
                  UN SDG 12
                  <span className="external-icon" aria-label="External link">↗</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.commerce.wa.gov/energy-office" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-external-link"
                >
                  WA Energy Office
                  <span className="external-icon" aria-label="External link">↗</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.energystar.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-external-link"
                >
                  Energy Star
                  <span className="external-icon" aria-label="External link">↗</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.epa.gov/energy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-external-link"
                >
                  EPA Energy Resources
                  <span className="external-icon" aria-label="External link">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Credits Section */}
        <div className="footer-bottom">
          <div className="footer-credits">
            <p className="footer-copyright">
              © {new Date().getFullYear()} WattWise. Built by UW students passionate about sustainability.
            </p>
            <p className="footer-course">Part of INFO 442</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

