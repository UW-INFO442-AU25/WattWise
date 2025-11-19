function Flashcard({ card, isFlipped, onFlip }) {
  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFlip();
        }
      }}
      aria-label={isFlipped ? "Click to see question" : "Click to see answer"}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="flashcard-content">
            <h3 className="flashcard-question">{card.question}</h3>
            <div className="flip-hint">Click to see answer</div>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-content">
            <p className="flashcard-answer">{card.answer}</p>
            <div className="flip-hint">Click to see question</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;

