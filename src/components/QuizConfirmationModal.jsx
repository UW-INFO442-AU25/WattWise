import { useEffect, useRef } from 'react'

function QuizConfirmationModal({ isOpen, onConfirm, onCancel }) {
  const modalRef = useRef(null)
  const confirmButtonRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      
      // Focus trap: focus the confirm button when modal opens
      if (confirmButtonRef.current) {
        confirmButtonRef.current.focus()
      }
      
      // Handle Escape key to close modal
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onCancel()
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <h2 className="modal-title" id="modal-title">Retake Quiz?</h2>
        <div id="modal-description">
          <p className="modal-message">
            You already have saved quiz results. Taking the quiz again will replace your current results with new ones.
          </p>
          <p className="modal-message">
            Are you sure you want to continue?
          </p>
        </div>
        <div className="modal-actions">
          <button 
            className="modal-button modal-button-cancel" 
            onClick={onCancel}
            aria-label="Cancel and keep current quiz results"
          >
            Cancel
          </button>
          <button 
            className="modal-button modal-button-confirm" 
            onClick={onConfirm}
            aria-label="Confirm retaking the quiz"
            ref={confirmButtonRef}
          >
            Yes, Retake Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizConfirmationModal

