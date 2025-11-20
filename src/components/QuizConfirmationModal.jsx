import { useEffect } from 'react'

function QuizConfirmationModal({ isOpen, onConfirm, onCancel }) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Retake Quiz?</h2>
        <p className="modal-message">
          You already have saved quiz results. Taking the quiz again will replace your current results with new ones.
        </p>
        <p className="modal-message">
          Are you sure you want to continue?
        </p>
        <div className="modal-actions">
          <button className="modal-button modal-button-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-button modal-button-confirm" onClick={onConfirm}>
            Yes, Retake Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizConfirmationModal

