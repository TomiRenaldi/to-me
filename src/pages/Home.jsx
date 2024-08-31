import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TomeText from '../components/TomeText'

export default function Home()
{
  return (
    <Router>
      <Routes>
        <Route path='/' element={<TomeText />} />
      </Routes>
    </Router>
  )
}