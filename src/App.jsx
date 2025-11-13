import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/index'
import AboutPage from './pages/About'
import ImpactPage from './pages/Impact'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/impact" element={<ImpactPage />} />
      </Routes>
    </Router>
  )
}

export default App
