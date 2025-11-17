import Navbar from '../components/Navbar'
import Quiz from '../components/Quiz'


function QuizPage() {
    return (
    <>
        <Navbar />
        <div style={{ marginTop: '80px' }}>
        <Quiz />
        </div>
    </>
    )
}

export default QuizPage