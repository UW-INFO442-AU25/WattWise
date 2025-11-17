import { Route, Routes } from 'react-router-dom'
import './index.css'
import AboutPage from './pages/About'
import ImpactPage from './pages/Impact'
import HomePage from './pages/index'
import QuizPage from './pages/QuizPage'
import QuizResultsPage from './pages/QuizResultsPage'
import MyProfilePage from './pages/MyProfilePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { useScrollToTop } from './hooks/useScrollToTop'


function App() {
  useScrollToTop()

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<MyProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/results" element={<QuizResultsPage />} />
      </Routes>
    </>
  )
}

export default App
