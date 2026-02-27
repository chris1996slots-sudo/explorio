import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MapView from './pages/MapView'
import GridView from './pages/GridView'
import ProviderPage from './pages/ProviderPage'
import ActivityDetailPage from './pages/ActivityDetailPage'
import BookingFlow from './pages/BookingFlow'
import LogoutPage from './pages/LogoutPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/map" /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route path="/map" element={<MapView />} />
        <Route path="/grid" element={<GridView />} />
        <Route path="/provider/:id" element={<ProviderPage />} />
        <Route path="/activity/:id" element={<ActivityDetailPage />} />
        <Route path="/booking/:id" element={<BookingFlow />} />
        <Route path="/logout" element={<LogoutPage onLogout={() => setIsLoggedIn(false)} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
