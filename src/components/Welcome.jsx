function Welcome() {
  const handleLearnMore = () => {
    const rentingSection = document.getElementById('renting');
    if (rentingSection) {
      rentingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="hero" id="main-content">
      <h1>Empower Your Home's Energy Future</h1>
      <p>Discover how small changes can lead to significant savings and a healthier planet. Join Washington homeowners making smarter, sustainable choices every day—from Seattle to Spokane, Tacoma to Bellingham.</p>
      <button 
        className="learn-more-button" 
        onClick={handleLearnMore}
        aria-label="Learn more about energy savings"
      >
        Learn More
      </button>
      <div className="scroll-indicator" aria-hidden="true"></div>
    </section>
  )
}

export default Welcome

