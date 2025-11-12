import { useState, useRef, useEffect } from "react";

function RentingVsHomeowning() {
  const rentingRef = useRef(null);
  const homeowningRef = useRef(null);
  const carouselWrapperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const rentingBoxes = [
    "Mysterious spikes and dips in your utility bills that you can't explain or control.",
    "Paying for your neighbors' long showers or someone's AC because the building doesn't have separate meters.",
    "Landlords using old, inefficient systems that waste energy (and your money).",
    "\"Utilities included\" rent that hides higher-than-average rates.",
    "No way to see how your daily habits affect your bill until it's too late."
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate max index: showing cardsPerView at a time
  const cardsPerView = isMobile ? 1 : 2;
  const maxIndex = isMobile 
    ? Math.max(0, rentingBoxes.length - 1) 
    : Math.max(0, rentingBoxes.length - cardsPerView); 

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Calculate transform value in pixels for accurate positioning with gap
  const getTransformValue = () => {
    if (!carouselWrapperRef.current) return 0;
    const wrapperWidth = carouselWrapperRef.current.offsetWidth;
    if (isMobile) {
      // On mobile, move by 100% of wrapper width
      return currentIndex * wrapperWidth;
    } else {
      const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return currentIndex * (wrapperWidth / 2 + 0.75 * remInPixels);
    }
  };

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

          <div className="carousel-container">
            <button 
              className="carousel-button carousel-button-prev" 
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ‹
            </button>
            
            <div className="carousel-wrapper" ref={carouselWrapperRef}>
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${getTransformValue()}px)` }}
              >
                {rentingBoxes.map((text, index) => (
                  <div
                    key={index}
                    className="highlight-box carousel-slide"
                  >
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="carousel-button carousel-button-next" 
              onClick={nextSlide}
              aria-label="Next slide"
            >
              ›
            </button>

            <div className="carousel-dots">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="story-text">
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
