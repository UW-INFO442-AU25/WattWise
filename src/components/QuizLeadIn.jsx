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
      <h2>Let's Figure This Out Together</h2>
      <p>Every home is different. Your habits, your appliances, your goals—they're uniquely yours. Take our quick quiz and we'll help you understand exactly where you can make the <strong>biggest difference</strong>, both for your wallet and for the environment.</p>
      <p>It takes about 5 minutes, and you'll walk away with a clear action plan tailored to your situation.</p>
      <button className="cta-button" onClick={handleQuizClick}>Tell Us About Your Home!</button>
    </section>
  )
}

export default QuizLeadIn

