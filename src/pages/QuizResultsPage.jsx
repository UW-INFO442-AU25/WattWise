import Navbar from '../components/Navbar'
import QuizResults from '../components/QuizResults'
import Footer from '../components/Footer'

function QuizResultsPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <QuizResults />
      </div>
      <Footer />
    </>
  )
}

export default QuizResultsPage

