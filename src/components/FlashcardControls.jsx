function FlashcardControls({ onPrevious, onNext, currentIndex, totalCards }) {
  return (
    <div className="flashcard-controls">
      <button
        className="flashcard-nav-button"
        onClick={onPrevious}
        aria-label="Previous card"
        disabled={currentIndex === 0}
      >
        <span className="nav-arrow">‹</span>
      </button>
      <div className="flashcard-counter">
        {currentIndex + 1} / {totalCards}
      </div>
      <button
        className="flashcard-nav-button"
        onClick={onNext}
        aria-label="Next card"
        disabled={currentIndex === totalCards - 1}
      >
        <span className="nav-arrow">›</span>
      </button>
    </div>
  );
}

export default FlashcardControls;

