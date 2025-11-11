import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

function EnvironmentImpact() {
  const impactRef = useIntersectionObserver()

  return (
    <section id="impact" className="impact-section" ref={impactRef}>
      <div className="container">
        <h2 className="section-titleimpact">Your Impact on the Environment</h2>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Small changes in your home can create ripple effects across our planet. Here's what the average Washington household can save annually through simple optimizations:
        </p>

        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">💨</div>
            <div className="impact-value">8,400 lbs</div>
            <div className="impact-label">CO₂ Emissions Reduced</div>
            <div className="impact-comparison">Equivalent to planting 140 trees or taking your car off the road for 9,300 miles</div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">💧</div>
            <div className="impact-value">18,000 gal</div>
            <div className="impact-label">Water Saved Annually</div>
            <div className="impact-comparison">That's enough to fill 3 dump trucks or take 360 five-minute showers</div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">⚡</div>
            <div className="impact-value">3,200 kWh</div>
            <div className="impact-label">Energy Conserved</div>
            <div className="impact-comparison">Enough electricity to power your refrigerator for 3 years straight</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EnvironmentImpact

