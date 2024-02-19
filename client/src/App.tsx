import LoginLayout from './pages/LoginLayout'
import HomeLayout from './pages/HomeLayout'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, UnprotectedRoute } from './utils/ProtectedRoute'

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <UnprotectedRoute redirectTo="/home" outlet={<LoginLayout />} />
            }
          />
          <Route
            path="/home"
            element={<ProtectedRoute redirectTo="/" outlet={<HomeLayout />} />}
          />
        </Routes>
      </div>
    </>
  )
}

export default App
