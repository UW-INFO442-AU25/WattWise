import Navbar from '../components/Navbar'
import QuizResults from '../components/QuizResults'

function QuizResultsPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <QuizResults />
      </div>
    </>
  )
}

export default QuizResultsPage

