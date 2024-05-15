import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/auth'

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
          <svg
            className="w-4 h-auto"
            width={46}
            height={47}
            viewBox="0 0 46 47"
            fill="none"
          >
            <path
              d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
              fill="#4285F4"
            />
            <path
              d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
              fill="#34A853"
            />
            <path
              d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
              fill="#FBBC05"
            />
            <path
              d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
              fill="#EB4335"
            />
          </svg>
          Google ile giriş yap
        </button>
        <div className="py-3 flex items-center text-xs  uppercase before:flex-1 before:border-t  before:me-6 after:flex-1 after:border-t  after:ms-6 text-neutral-500 before:border-neutral-600 after:border-neutral-600">
          Veya
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-white">
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
                    <svg
                      className="size-5 text-red-500"
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
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
                    <svg
                      className="size-5 text-red-500"
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
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
                    className="shrink-0 rounded text-blue-600 focus:ring-blue-500 bg-neutral-800 border-neutral-700 checked:bg-blue-500 checked:border-blue-500 focus:ring-offset-gray-800"
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
