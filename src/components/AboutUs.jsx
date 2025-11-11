import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

function AboutUs() {
  const aboutRef = useIntersectionObserver()

  return (
    <section id="about" className="about" ref={aboutRef}>
      <h2>About WattWise</h2>
      <div className="about-content">
        <div className="about-text">
          <p>WattWise was born from a simple question: How might we empower Washington homeowners to better understand and act on the financial savings and environmental benefits of optimizing their utility usage?</p>
          <br />
          <p>For homeowners eager to make a positive impact, WattWise offers a space to learn, reflect, and connect around sustainable living. Together, we explore practical ways to lower energy use, support greener communities, and build a more sustainable future- one home at a time.</p>
        </div>
        <div className="team">
          <h3>Meet Our Team</h3>
          <p style={{ marginBottom: '1rem' }}>A dedicated group of UW students passionate about sustainability and technology:</p>
          <div className="team-members">
            <span className="team-member">Mia</span>
            <span className="team-member">Anushka</span>
            <span className="team-member">Awo</span>
            <span className="team-member">Ethan</span>
            <span className="team-member">Eric</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs

