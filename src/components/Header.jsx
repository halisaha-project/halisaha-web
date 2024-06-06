import { React, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../utils/auth'
import { FaBars } from 'react-icons/fa'
import { GiSoccerBall } from 'react-icons/gi'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  if (['/', '/login', '/forgot-password','/otp-page','/register' ,'/reset-password' ,'/email-verification'].includes(location.pathname)) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header>
      <nav className="flex px-4 lg:px-20 xl:px-60 justify-between items-center h-14 bg-black text-white border-b border-zinc-800">
        <div className="inline-flex text-2xl items-center space-x-2">
          <GiSoccerBall />
          <button>TopRate</button>
        </div>

        <div className="hidden md:flex space-x-4 text-zinc-50 ">
          <button
            onClick={() => navigate('/teams')}
            className="hover:text-zinc-300"
          >
            Takımlarım
          </button>
          <button
            onClick={() => navigate('/matches')}
            className="hover:text-zinc-300"
          >
            Maçlarım
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="hover:text-zinc-300"
          >
            Profil
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="hidden md:block hover:text-zinc-300"
        >
          Çıkış Yap
        </button>
        <button onClick={handleToggle} className="block md:hidden">
          <FaBars />
        </button>
      </nav>
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-black text-white border-t border-zinc-800">
          <button
            className="py-2 border-b w-full border-zinc-800 hover:bg-zinc-950"
            onClick={() => {
              setIsOpen(false)
              navigate('/teams')
            }}
          >
            Takımlarım
          </button>
          <button
            className="py-2 border-b w-full border-zinc-800 hover:bg-zinc-950"
            onClick={() => {
              setIsOpen(false)
              navigate('/matches')
            }}
          >
            Maçlarım
          </button>
          <button
            className="py-2 border-b w-full border-zinc-800 hover:bg-zinc-950"
            onClick={() => {
              setIsOpen(false)
              navigate('/profile')
            }}
          >
            Profil
          </button>
          <button
            className="py-2 border-b w-full border-zinc-800 hover:bg-zinc-950"
            onClick={() => {
              handleLogout()
              setIsOpen(false)
            }}
          >
            Çıkış
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
