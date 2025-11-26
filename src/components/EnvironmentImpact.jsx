import { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import FlashcardControls from './FlashcardControls';
import { sustainabilityCards, termDefinitions } from './cardsData';

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function EnvironmentImpact() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeDefinition, setActiveDefinition] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Shuffle cards once on component mount
  useEffect(() => {
    const shuffled = shuffleArray(sustainabilityCards);
    setCards(shuffled);
  }, []);

  // Reset flip state when navigating to a new card
  useEffect(() => {
    setIsFlipped(false);
    setActiveDefinition(null);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleTermClick = (term) => {
    if (term && termDefinitions[term]) {
      setActiveDefinition({
        term: term,
        definition: termDefinitions[term]
      });
    }
  };

  const closeDefinition = () => {
    setActiveDefinition(null);
  };

  if (cards.length === 0) {
    return (
      <section id="impact" className="impact-section">
        <div className="impact-header">
          <div className="impact-header-overlay"></div>
          <h2 className="impact-title">Your Impact on the Environment</h2>
        </div>
        <div className="flashcard-container">
          <div className="loading-message">Loading flashcards...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="impact" className="impact-section">
      <div className="impact-header">
        <div className="impact-header-overlay"></div>
        <h2 className="impact-title">Your Impact on the Environment</h2>
      </div>
      <div className="flashcard-container">
        <p className="flashcard-subtitle">
          Test your knowledge about household sustainability. Click each card to flip and learn!
        </p>
        
        <div className="flashcard-wrapper">
          <Flashcard
            card={cards[currentIndex]}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onSwipeLeft={handleNext}
            onSwipeRight={handlePrevious}
            onTermClick={handleTermClick}
            activeDefinition={!isMobile ? activeDefinition : null}
            onCloseDefinition={closeDefinition}
          />
        </div>

        {/* Mobile: Definition bottom sheet overlay */}
        {isMobile && activeDefinition && (
          <>
            <div className="definition-overlay" onClick={closeDefinition}></div>
            <div className="definition-bottom-sheet">
              <div className="definition-drag-handle"></div>
              <div className="definition-header">
                <span className="definition-term">{activeDefinition.term}</span>
                <button 
                  className="definition-close"
                  onClick={closeDefinition}
                  aria-label="Close definition"
                >
                  ×
                </button>
              </div>
              <div className="definition-body">
                {activeDefinition.definition}
              </div>
            </div>
          </>
        )}

        <FlashcardControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          currentIndex={currentIndex}
          totalCards={cards.length}
        />
      </div>
    </section>
  );
}

export default EnvironmentImpact;
