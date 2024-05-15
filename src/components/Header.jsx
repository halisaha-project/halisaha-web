import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../utils/auth'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  if (['/', '/login'].includes(location.pathname)) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header>
      <nav>
        <h1>Halısaha App</h1>
        <button onClick={handleLogout}>Çıkış Yap</button>
      </nav>
    </header>
  )
}

export default Header
