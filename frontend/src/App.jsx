import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Loader from './components/common/Loader'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Subscribe from './pages/Subscribe'
import Charities from './pages/Charities'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { loading } = useAuth()
  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}