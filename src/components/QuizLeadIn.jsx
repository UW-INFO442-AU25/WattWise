// src/components/QuizLeadIn.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useAuth } from '../contexts/AuthContext'
import { useQuizResults } from '../hooks/useQuizResults'
import QuizConfirmationModal from './QuizConfirmationModal'

function QuizLeadIn() {
  const quizRef = useIntersectionObserver()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { hasResults, loading: resultsLoading } = useQuizResults(user?.uid)
  const [showModal, setShowModal] = useState(false)

  const handleQuizClick = () => {
    // Show modal if user is logged in and has results
    if (user && hasResults) {
      setShowModal(true)
    } else {
      navigate('/quiz')
    }
  }

  const handleConfirm = () => {
    setShowModal(false)
    navigate('/quiz')
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  return (
    <section id="quiz" className="quiz-cta" ref={quizRef}>
      <h2>Let's Figure This Out Together</h2>
      <p>
        Every home is different. Your habits, your appliances, your goals—they're uniquely yours. 
        Take our quick quiz and we'll help you understand exactly where you can make the <strong>biggest difference</strong>, 
        both for your wallet and for the environment.
      </p>
      <p>
        It takes about 5 minutes, and you'll walk away with a clear action plan tailored to your Washington home—whether you're dealing with our mild winters, managing heating costs, or optimizing for our moderate summers.
      </p>
      <button className="cta-button" onClick={handleQuizClick}>
        Tell Us About Your Home!
      </button>
      <QuizConfirmationModal 
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </section>
  )
}

export default QuizLeadIn
