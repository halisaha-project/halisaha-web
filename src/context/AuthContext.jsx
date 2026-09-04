import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  loginUser,
  logoutSession,
} from '../api/authApi'
import { normalizeApiError } from '../api/client'
import { AuthContext } from './authContext'
import {
  AUTH_SESSION_CLEARED_EVENT,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  storeAuthTokens,
} from '../utils/authStorage'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const reloadCurrentUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    return currentUser
  }

  useEffect(() => {
    const handleSessionCleared = () => setUser(null)
    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared)

    const restoreSession = async () => {
      if (!getAccessToken() && !getRefreshToken()) {
        setLoading(false)
        return
      }

      try {
        await reloadCurrentUser()
      } catch {
        clearAuthTokens()
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
    return () =>
      window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared)
  }, [])

  const login = async (identifier, password) => {
    try {
      const tokens = await loginUser(identifier, password)
      storeAuthTokens(tokens)
      await reloadCurrentUser()
      return { success: true }
    } catch (error) {
      clearAuthTokens()
      const normalizedError = normalizeApiError(error, 'Login failed')
      return {
        success: false,
        message: normalizedError.clientMessage,
        error: normalizedError,
      }
    }
  }

  const logout = async () => {
    const refreshToken = getRefreshToken()
    try {
      if (refreshToken) await logoutSession(refreshToken)
    } catch {
      // Local logout must still complete when session revocation is unavailable.
    } finally {
      clearAuthTokens()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        reloadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
