import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/auth'
import { FcGoogle } from 'react-icons/fc'
import { MdError } from 'react-icons/md'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await login(email, password)
    if (response.success === true) {
      navigate('/profile')
    } else if (response.success === false) {
      setPasswordError(true)
    }
  }

  return (
    <div className="w-2/3 lg:w-1/2 ">
      <div className="text-center">
        <h1 className="block text-2xl font-bold text-white">Giriş Yap</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Henüz hesabın yok mu?{' '}
          <a
            className="font-medium text-blue-500 hover:cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Kayıt Ol
          </a>
        </p>
      </div>
      <div className="mt-5">
        <button
          type="button"
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border shadow-sm  bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
        >
          <FcGoogle className="size-5" />
          Google ile giriş yap
        </button>
        <div className="py-3 flex items-center text-xs  uppercase before:flex-1 before:border-t  before:me-6 after:flex-1 after:border-t  after:ms-6 text-neutral-500 before:border-neutral-600 after:border-neutral-600">
          Veya
        </div>

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
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm mb-2 text-white"
                >
                  Şifre
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="py-3 px-4 block w-full border  rounded-lg text-sm focus:border-blue-500 bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                  required=""
                  aria-describedby="password-error"
                  onChange={(e) => setPassword(e.target.value)}
                />

                {passwordError && (
                  <div className="absolute inset-y-3 end-0 pointer-events-none pe-3">
                    <MdError className="size-5 text-red-500" />
                  </div>
                )}
              </div>
              {passwordError && (
                <p className="text-xs text-red-600 mt-2" id="password-error">
                  Giriş bilgileriniz hatalı
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex">
                <div>
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500 bg-neutral-800 border-neutral-700 checked:bg-blue-500 checked:border-blue-500 focus:ring-offset-gray-800"
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </div>
                <div className="ms-3">
                  <label htmlFor="remember-me" className="text-sm text-white">
                    Beni Hatırla
                  </label>
                </div>
              </div>
              <div>
                <a
                  className="text-sm font-medium  text-blue-500 hover:cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  Şifremi Unuttum
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
            >
              Giriş
            </button>
          </div>
        </form>
      </div>
    </div>

    // <form onSubmit={handleSubmit}>
    //   <input
    //     type="email"
    //     placeholder="E-posta"
    //     value={username}
    //     onChange={(e) => setUsername(e.target.value)}
    //   />
    //   <input
    //     type="password"
    //     placeholder="Şifre"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <button type="submit">Giriş Yap</button>
    // </form>
  )
}

export default LoginForm
