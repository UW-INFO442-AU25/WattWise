import { Route, Routes } from 'react-router-dom'
import './index.css'
import AboutPage from './pages/About'
import ImpactPage from './pages/Impact'
import HomePage from './pages/index'
import QuizPage from './pages/QuizPage'
import QuizResultsPage from './pages/QuizResultsPage'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/results" element={<QuizResultsPage />} />
      </Routes>
    </>
  )
}

export default App
