import { useEffect, useRef } from "react";

function RentingVsHomeowning() {
  const rentingRef = useRef(null);
  const homeowningRef = useRef(null);
  const boxesRef = useRef([]);

  // Intersection Observer for highlight boxes
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    boxesRef.current.forEach((box) => box && observer.observe(box));

    return () => observer.disconnect();
  }, []);

  const rentingBoxes = [
    "Mysterious spikes and dips in your utility bills that you can't explain or control.",
    "Paying for your neighbors’ long showers or someone’s AC because the building doesn’t have separate meters.",
    "Landlords using old, inefficient systems that waste energy (and your money).",
    "No way to see how your daily habits affect your bill until it's too late."
  ];

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
            {rentingBoxes.map((text, index) => (
              <div
                key={index}
                className="highlight-box"
                ref={(el) => (boxesRef.current[index] = el)}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <p>{text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="big-statement text-center">
              You're doing your part, but the infrastructure isn't doing its part for you.
            </p>
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
  );
}

export default RentingVsHomeowning;
