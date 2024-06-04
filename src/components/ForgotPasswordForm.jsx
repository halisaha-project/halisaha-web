import React from 'react'
import { MdError } from 'react-icons/md'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOtp } from '../api/otpApi'

function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // E-posta adresi formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      setErrorMessage('Lütfen geçerli bir e-posta adresi girin');
      return;
    }

    // OTP gönderme API çağrısı
    const response = await sendOtp(email);
    if (response.success) {
      navigate('/otp-page', { state: { email } });
    } else {
      setEmailError(true);
      setErrorMessage(response.message);
    }
  };

  return (
    <div className="w-2/3 lg:w-1/2 ">
      <div className="text-center">
        <h1 className="block text-2xl font-bold text-white">Şifremi Unuttum</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Yoksa hatırladınız mı?{' '}
          <a
            className="font-medium text-blue-500 hover:cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Giriş Yap
          </a>
        </p>
      </div>
      <div className="mt-5">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-white">
                E-posta
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="example@domain.com"
                  className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                  required=""
                  aria-describedby="email-error"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <div className="absolute inset-y-3 end-0 pointer-events-none pe-3">
                    <MdError className="size-5 text-red-500" />
                  </div>
                )}
              </div>
              {emailError && (
                <p className=" text-xs text-red-600 mt-2" id="email-error">
                  Lütfen geçerli bir e-posta adresi girin
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
            >
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
