import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/Layout.tsx'
import Finish from './pages/Finish.tsx'
import Leaderboard from './pages/Leaderboard.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<App />} />
          <Route path='/finish' element={<Finish />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
