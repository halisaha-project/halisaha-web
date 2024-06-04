import React, { useState, useEffect } from 'react'
import { MdError } from 'react-icons/md'
import { verifyOtp } from '../api/otpApi'
import { useLocation, useNavigate } from 'react-router-dom'

const OTP = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState(false)


    const handleSubmit = async (e) => {
      e.preventDefault()
      const email = location.state?.email
  
      // OTP doğrulama API çağrısı
      const response = await verifyOtp(email, otp)
      if (response.success) {
        navigate('/reset-password', { state: { email, otp } })
      } 
    }

    return (
        <div className="w-2/3 lg:w-1/2 ">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-white">Doğrulama Kodu</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Lütfen mail adresinize gönderilen 6 haneli kodu girin.
            </p>
          </div>
          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="otp"
                      placeholder="123456"
                      maxLength="6"
                      className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                      required
                      aria-describedby="otp-error"
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    {otpError && (
                      <div className="absolute inset-y-3 end-0 pointer-events-none pe-3">
                        <MdError className="size-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {otpError && (
                    <p className="text-xs text-red-600 mt-2" id="otp-error">
                      Kod Geçersiz
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  Doğrula
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

export default OTP
