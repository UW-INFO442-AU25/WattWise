import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

function QuizLeadIn() {
  const quizRef = useIntersectionObserver()

  const handleQuizClick = () => {
    // This would navigate to /quiz route
    alert('Quiz feature coming soon! This will navigate to the quiz page.')
    // In a real implementation: window.location.href = '/quiz';
    // Or use React Router: navigate('/quiz');
  }

  return (
    <section id="quiz" className="quiz-cta" ref={quizRef}>
      <h2>Ready to Discover Your Savings?</h2>
      <p>Take our quick 5-minute quiz to get a personalized appliance map with prioritized actions tailored to your home. See exactly how much you can save in dollars and kilowatt-hours.</p>
      <button className="cta-button" onClick={handleQuizClick}>Take the Quiz</button>
    </section>
  )
}

export default QuizLeadIn

