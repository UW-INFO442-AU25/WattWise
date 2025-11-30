import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

function AboutUs() {
  const aboutRef = useIntersectionObserver()

  const teamMembers = [
    {
      name: 'Mia',
      initials: 'M'
    },
    {
      name: 'Anushka',
      initials: 'A'
    },
    {
      name: 'Awo',
      initials: 'A',
      image: 'public/awo-photo.jpg' //make sure to add the image to the public folder using the same titling 
    },
    {
      name: 'Ethan',
      initials: 'E',
      image: 'public/ethan-photo.jpg'
    },
    {
      name: 'Eric',
      initials: 'E'
    }
  ]

  return (
    <section id="about" className="about" ref={aboutRef}>
      <div className="about-header">
        <div className="about-header-overlay"></div>
        <h2 className="about-title">About WattWise</h2>
      </div>
      <div className="about-content">
        <div className="about-text">
          <div className="about-question-container">
            <h3 className="about-question-title">How might we empower Washington homeowners?</h3>
            <div className="question-cards">
              <div className="question-card">
                <div className="question-icon question-icon-dollar">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg">
                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="url(#dollarGradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                      <linearGradient id="dollarGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6BA3C7"/>
                        <stop offset="100%" stopColor="#7AB89A"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h4>Financial Savings</h4>
                <p>Better understand utility costs and optimize spending</p>
              </div>
              <div className="question-card">
                <div className="question-icon question-icon-plant">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg">
                    {/* Tall stick tree trunk - thicker */}
                    <rect x="10.5" y="16" width="3" height="6" rx="1" fill="url(#treeGradient)"/>
                    {/* Tree foliage - top section */}
                    <path d="M12 2 L8 10 L12 10 L16 10 Z" fill="url(#treeGradient)" opacity="0.9"/>
                    {/* Tree foliage - middle section */}
                    <path d="M12 6 L9 12 L12 12 L15 12 Z" fill="url(#treeGradient)" opacity="0.85"/>
                    {/* Tree foliage - bottom section (sits on top of trunk) */}
                    <path d="M12 10 L10 16 L12 16 L14 16 Z" fill="url(#treeGradient)" opacity="0.8"/>
                    <defs>
                      <linearGradient id="treeGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#7AB89A"/>
                        <stop offset="100%" stopColor="#6B9A7F"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h4>Environmental Benefits</h4>
                <p>Reduce energy waste and environmental impact</p>
              </div>
              <div className="question-card">
                <div className="question-icon question-icon-power">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg">
                    <path d="M18.36 6.64C19.6184 7.89879 20.4753 9.50244 20.8223 11.2482C21.1693 12.994 20.9969 14.8034 20.3269 16.4638C19.6569 18.1241 18.5202 19.5622 17.0501 20.5979C15.58 21.6336 13.8399 22.2227 12.055 22.2227C10.2701 22.2227 8.53003 21.6336 7.05992 20.5979C5.58981 19.5622 4.45309 18.1241 3.78311 16.4638C3.11313 14.8034 2.9407 12.994 3.28768 11.2482C3.63466 9.50244 4.49159 7.89879 5.75 6.64" stroke="url(#powerGradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 2V12" stroke="url(#powerGradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                      <linearGradient id="powerGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6BA3C7"/>
                        <stop offset="100%" stopColor="#5B8FA8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h4>Optimize Usage</h4>
                <p>Make informed decisions about utility consumption</p>
              </div>
            </div>
          </div>
          <p>WattWise was born from this question, addressing <strong>UN Sustainable Development Goal 12: Responsible Consumption and Production</strong>. We focus on the lack of awareness around everyday household practices and their environmental and financial impact—especially for new homeowners across Washington state.</p>
          <p style={{ marginTop: '2rem' }}>Many Washington homeowners don't realize that leaving appliances plugged in or running inefficient lightbulbs can rack up costs while wasting energy. Despite having access to some of the nation's cleanest and most affordable electricity, simple inefficiencies can still add up. By educating people on how simple fixes—like unplugging appliances or switching to eco-friendly alternatives—can save money and reduce environmental impact, we motivate people to shift their daily practices and take full advantage of Washington's clean energy advantage.</p>
        </div>

        <div className="sdg-highlight">
          <a 
            href="https://www.un.org/sustainabledevelopment/sustainable-consumption-production/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sdg-badge-link"
            title="Learn more about SDG 12 on the UN website"
          >
            <div className="sdg-badge">
              <div className="sdg-icon">SDG 12</div>
              <h3>Responsible Consumption & Production</h3>
              <span className="sdg-tooltip">Click to learn more about SDG 12</span>
            </div>
          </a>
          <p className="sdg-description">
            Our project aligns with SDG 12 by promoting awareness of resource consumption. We also connect to SDG 7 (Affordable and Clean Energy), SDG 13 (Climate Action), and SDG 11 (Sustainable Cities and Communities) by fostering sustainable practices in community living.
          </p>
        </div>

        <div className="team">
          <h3>Meet Our Team</h3>
          <p className="team-subtitle">A dedicated group of UW students passionate about sustainability and technology</p>
          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="team-member-card"
              >
                <div className="team-member-avatar">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="avatar-image"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'avatar-circle';
                        fallback.textContent = member.initials;
                        e.target.parentNode.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="avatar-circle">{member.initials}</div>
                  )}
                </div>
                <div className="team-member-name">{member.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs

