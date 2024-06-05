import { React, useEffect } from 'react'
import ResetPasswordForm from '../components/ResetPasswordForm'
import messi from '/messi.jpg'

function ResetPassword() {

  return (
    <div>
      <div className="flex flex-wrap h-screen">
        <div className="hidden sm:flex sm:w-1/2 ">
          <img src={messi} className="object-cover" />
        </div>

        <div className="w-full sm:w-1/2 flex items-center justify-center bg-messi-blur sm:bg-none bg-cover bg-center bg-black ">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
