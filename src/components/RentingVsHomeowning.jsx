import { useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

function RentingVsHomeowning() {
  const [currentView, setCurrentView] = useState('renting')
  const infoRef = useIntersectionObserver()

  const toggleView = (view) => {
    setCurrentView(view)
  }

  return (
    <section id="info" className="info-section" ref={infoRef}>
      <div className="container">
        <h2 className="section-title">Understanding Your Savings Potential</h2>

        <div className="toggle-container">
          <div className="toggle-switch">
            <button 
              className={`toggle-btn ${currentView === 'renting' ? 'active' : ''}`}
              onClick={() => toggleView('renting')}
            >
              Renting
            </button>
            <button 
              className={`toggle-btn ${currentView === 'homeowning' ? 'active' : ''}`}
              onClick={() => toggleView('homeowning')}
            >
              Homeowning
            </button>
          </div>
        </div>

        <div id="comparison-content">
          {currentView === 'renting' ? (
            <div className="comparison-table">
              <div className="plan-card">
                <div className="plan-header">
                  <h3 className="plan-title">Current Habits</h3>
                  <p className="plan-subtitle">Your typical rental experience</p>
                </div>
                <ul className="plan-features">
                  <li>Standard apartment appliances</li>
                  <li>Limited control over major systems</li>
                  <li>Traditional lighting throughout</li>
                  <li>Basic thermostat settings</li>
                  <li>Standard shower fixtures</li>
                </ul>
                <div className="plan-stat">
                  <div className="stat-value">$145/mo</div>
                  <div className="stat-label">Average Utility Cost</div>
                </div>
              </div>

              <div className="plan-card featured">
                <div className="plan-header">
                  <h3 className="plan-title">Optimized Living</h3>
                  <p className="plan-subtitle">With WattWise recommendations</p>
                </div>
                <ul className="plan-features">
                  <li>LED bulb upgrades (renter-friendly)</li>
                  <li>Smart power strips for phantom loads</li>
                  <li>Low-flow showerhead installation</li>
                  <li>Mindful appliance usage patterns</li>
                  <li>Optimized heating/cooling schedules</li>
                </ul>
                <div className="plan-stat">
                  <div className="stat-value">$108/mo</div>
                  <div className="stat-label">Potential Utility Cost</div>
                </div>
                <div className="plan-stat">
                  <div className="stat-value">$444/yr</div>
                  <div className="stat-label">Annual Savings</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="comparison-table">
              <div className="plan-card">
                <div className="plan-header">
                  <h3 className="plan-title">Current Setup</h3>
                  <p className="plan-subtitle">Traditional homeowner approach</p>
                </div>
                <ul className="plan-features">
                  <li>Standard HVAC system</li>
                  <li>Traditional water heater</li>
                  <li>Mixed lighting (incandescent/CFL)</li>
                  <li>Older appliances (10+ years)</li>
                  <li>Manual thermostat control</li>
                  <li>Standard insulation</li>
                </ul>
                <div className="plan-stat">
                  <div className="stat-value">$215/mo</div>
                  <div className="stat-label">Average Utility Cost</div>
                </div>
              </div>

              <div className="plan-card featured">
                <div className="plan-header">
                  <h3 className="plan-title">Smart Home</h3>
                  <p className="plan-subtitle">With WattWise optimizations</p>
                </div>
                <ul className="plan-features">
                  <li>Energy Star certified appliances</li>
                  <li>LED lighting throughout (100%)</li>
                  <li>Smart thermostat with scheduling</li>
                  <li>Tankless or hybrid water heater</li>
                  <li>Enhanced insulation & weatherproofing</li>
                  <li>Solar panel consideration (long-term)</li>
                </ul>
                <div className="plan-stat">
                  <div className="stat-value">$142/mo</div>
                  <div className="stat-label">Potential Utility Cost</div>
                </div>
                <div className="plan-stat">
                  <div className="stat-value">$876/yr</div>
                  <div className="stat-label">Annual Savings</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="data-source">Data sources: Puget Sound Energy, U.S. Department of Energy, and Washington State utilities data (2024)</p>
      </div>
    </section>
  )
}

export default RentingVsHomeowning

