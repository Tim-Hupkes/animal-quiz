import { Routes, Route, Navigate } from 'react-router-dom'
import Quiz from './pages/Quiz'

function App() {
  return (
    <Routes>
  <Route path="/" element={<Navigate to="/nl" replace />} />
  <Route path="/:lang" element={<Quiz />} />
</Routes>
  )
}

export default App