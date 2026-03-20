import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchMe = async () => {
    try {
      const { data } = await API.get('/auth/me')
      setUser(data.user)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)