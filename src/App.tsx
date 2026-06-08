import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Reveal from './pages/Reveal'
import Viewer from './pages/Viewer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Reveal />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  )
}
