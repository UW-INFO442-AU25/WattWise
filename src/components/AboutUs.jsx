import { useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

function AboutUs() {
  const aboutRef = useIntersectionObserver()
  const [activeMember, setActiveMember] = useState(null)

  const teamMembers = [
    {
      name: 'Mia',
      initials: 'M',
      description: '...'
    },
    {
      name: 'Anushka',
      initials: 'A',
      description: '...'
    },
    {
      name: 'Awo',
      initials: 'A',
      description: '...'
    },
    {
      name: 'Ethan',
      initials: 'E',
      description: '...'
    },
    {
      name: 'Eric',
      initials: 'E',
      description: '...'
    }
  ]

  const handleMemberClick = (index) => {
    setActiveMember(activeMember === index ? null : index)
  }

  return (
    <section id="about" className="about" ref={aboutRef}>
      <h2>About WattWise</h2>
      <div className="about-content">
        <div className="about-text">
          <p className="about-question">How might we empower Washington homeowners to better understand and act on the financial savings and environmental benefits of optimizing their utility usage?</p>
          <p>WattWise was born from this question, addressing <strong>UN Sustainable Development Goal 12: Responsible Consumption and Production</strong>. We focus on the lack of awareness around everyday household practices and their environmental and financial impact.</p>
          <p>Many homeowners don't realize that leaving appliances plugged in or running inefficient lightbulbs can rack up costs while wasting energy. By educating people on how simple fixes—like unplugging appliances or switching to eco-friendly alternatives—can save money and reduce environmental impact, we motivate people to shift their daily practices.</p>
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
                className={`team-member-card ${activeMember === index ? 'active' : ''}`}
                onClick={() => handleMemberClick(index)}
                onMouseEnter={() => setActiveMember(index)}
                onMouseLeave={() => setActiveMember(null)}
              >
                <div className="team-member-avatar">
                  <div className="avatar-circle">{member.initials}</div>
                </div>
                <div className="team-member-name">{member.name}</div>
                {activeMember === index && (
                  <div className="team-member-description">
                    <p>{member.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="team-hint">Hover or click on a team member to learn more!</p>
        </div>
      </div>
    </section>
  )
}

export default AboutUs

