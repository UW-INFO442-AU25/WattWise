import { useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

function RentingVsHomeowning() {
  const rentingRef = useIntersectionObserver()
  const homeowningRef = useIntersectionObserver()

  return (
    <>
      {/* Renting Section */}
      <section className="renting-section" id="renting" ref={rentingRef}>
        <div className="renting-content">
          <div className="text-center mb-5">
            <span className="section-icon">🏢</span>
            <h2 className="section-title">The Renter's Reality</h2>
          </div>
          
          <div className="big-statement text-center">
            When you're renting, energy feels like something that just <em>happens</em> to you.
          </div>

          <div className="highlight-boxes">
            <div className="highlight-box">
              <p><strong>Mysterious spikes and dips</strong> in your utility bills that you can't explain or control.</p>
            </div>
            <div className="highlight-box">
              <p><strong>Old heating systems</strong> that sound like exhaust engines, but fixing them isn't your call.</p>
            </div>
          </div>

          <div className="text-center">
            <p className="story-text">
              You're doing your part, but the infrastructure isn't doing its part for you.
            </p>
            {/* Journey Connector */}
          <div className="journey-connector">
            <div className="journey-arrow">↓</div>
      </div>
          </div>
        </div>
      </section>

      {/* Homeowning Section */}
      <section className="homeowning-section" id="homeowning" ref={homeowningRef}>
        <div className="homeowning-content">
          <div className="text-center">
            <span className="section-icon">🏡</span>
            <h2 className="section-title">The Homeowner's Opportunity</h2>
          </div>
          
          <div className="big-statement text-center mb-5">
            But then something changes.<br />
            You get the keys.
          </div>

          <div className="text-center mb-5">
            <p className="story-text">
              Suddenly—<strong>it's your home</strong>. Yours to control. Yours to change.
            </p>
          </div>

          <div className="highlight-box text-center">
            <p style={{ fontSize: '1.1rem' }}>
              This is your chance to build the environment-conscious home you always wanted.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default RentingVsHomeowning