import { React, useEffect } from 'react'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import { useNavigate } from 'react-router-dom'
import messi from '/messi.jpg'

function ForgotPassword() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/profile')
    }
  }, [navigate])

  return (
    <div>
      <div className="flex flex-wrap h-screen">
        <div className="hidden sm:flex sm:w-1/2 ">
          <img src={messi} className="object-cover" />
        </div>

        <div className="w-full sm:w-1/2 flex items-center justify-center bg-messi-blur sm:bg-none bg-cover bg-center bg-black ">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
