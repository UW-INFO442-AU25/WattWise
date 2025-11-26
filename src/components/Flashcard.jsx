import { useState, useRef, useEffect } from 'react';
import { findTermsInText } from './cardsData';

// Function to wrap terms with clickable spans
function wrapTerms(text) {
  const terms = findTermsInText(text);
  if (terms.length === 0) return text;

  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  let result = text;
  const usedIndices = new Set();
  
  sortedTerms.forEach(term => {
    // Create regex to find the term (case-insensitive, whole word)
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = [...result.matchAll(regex)];
    
    // Process matches in reverse order to maintain indices
    matches.reverse().forEach(match => {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;
      
      // Check if this position is already used
      let isUsed = false;
      for (let i = startIndex; i < endIndex; i++) {
        if (usedIndices.has(i)) {
          isUsed = true;
          break;
        }
      }
      
      if (!isUsed) {
        // Mark indices as used
        for (let i = startIndex; i < endIndex; i++) {
          usedIndices.add(i);
        }
        
        const before = result.substring(0, startIndex);
        const matched = match[0];
        const after = result.substring(endIndex);
        
        result = `${before}<span class="definable-term" data-term="${term}">${matched}</span>${after}`;
      }
    });
  });
  
  return result;
}

function Flashcard({ card, isFlipped, onFlip, onSwipeLeft, onSwipeRight, onTermClick, activeDefinition, onCloseDefinition }) {
  const [isDragging, setIsDragging] = useState(false);
  const flashcardRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dragOffset = useRef(0);

  const questionWithTerms = wrapTerms(card.question);
  const answerWithTerms = wrapTerms(card.answer);

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
    dragOffset.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Only allow horizontal swipes (if horizontal movement is greater than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      dragOffset.current = deltaX;
      // Apply visual feedback
      if (flashcardRef.current) {
        flashcardRef.current.style.transform = `translateX(${deltaX * 0.3}px)`;
        flashcardRef.current.style.opacity = `${1 - Math.abs(deltaX) / 300}`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const distance = dragOffset.current;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (distance < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Reset visual state
    if (flashcardRef.current) {
      flashcardRef.current.style.transform = '';
      flashcardRef.current.style.opacity = '';
    }

    setIsDragging(false);
    touchStartX.current = null;
    touchStartY.current = null;
    dragOffset.current = 0;
  };

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      
      // Check if clicked on a definable term
      if (target.classList.contains('definable-term')) {
        e.stopPropagation(); // Prevent card flip
        const term = target.getAttribute('data-term');
        if (term && onTermClick) {
          onTermClick(term);
        }
      }
    };

    const flashcard = flashcardRef.current;
    if (flashcard) {
      flashcard.addEventListener('click', handleClick, true);
    }

    return () => {
      if (flashcard) {
        flashcard.removeEventListener('click', handleClick, true);
      }
    };
  }, [card, onTermClick]);

  return (
    <div 
      ref={flashcardRef}
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
            <h3 
              className="flashcard-question"
              dangerouslySetInnerHTML={{ __html: questionWithTerms }}
            />
            {activeDefinition && (
              <div className="definition-panel" onClick={(e) => e.stopPropagation()}>
                <div className="definition-header">
                  <span className="definition-term">{activeDefinition.term}</span>
                  <button 
                    className="definition-close"
                    onClick={onCloseDefinition}
                    aria-label="Close definition"
                  >
                    ×
                  </button>
                </div>
                <div className="definition-body">
                  {activeDefinition.definition}
                </div>
              </div>
            )}
            <div className="flip-hint">Click to see answer</div>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-content">
            <p 
              className="flashcard-answer"
              dangerouslySetInnerHTML={{ __html: answerWithTerms }}
            />
            {activeDefinition && (
              <div className="definition-panel" onClick={(e) => e.stopPropagation()}>
                <div className="definition-header">
                  <span className="definition-term">{activeDefinition.term}</span>
                  <button 
                    className="definition-close"
                    onClick={onCloseDefinition}
                    aria-label="Close definition"
                  >
                    ×
                  </button>
                </div>
                <div className="definition-body">
                  {activeDefinition.definition}
                </div>
              </div>
            )}
            <div className="flip-hint">Click to see question</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
