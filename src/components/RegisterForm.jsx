import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { MdError } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { register} from '../utils/auth'

function RegisterForm() {
  const [nameSurname, setNameSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError(false);
    setUsernameError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    const response = await register(nameSurname, username, email, password);
    if (response.success) {
      navigate('/email-verification');
    } else {
      if (response.message.includes('email') || response.message.includes('e-mail')) {
        setEmailError(true);
      } else if (response.message.includes('username')) {
        setUsernameError(true);
      } else if (response.message.includes('password')) {
        setPasswordError(true);
      }
    }
  };

  return (
    <div className="w-2/3 lg:w-1/2">
      <div className="text-center">
        <h1 className="block text-2xl font-bold text-white">Kayıt Ol</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Bir hesap oluştur
        </p>
      </div>
      <div className="mt-5">
        <button
          type="button"
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border shadow-sm bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
        >
          <FcGoogle className="size-5" />
          Google ile kayıt ol
        </button>
        <div className="py-3 flex items-center text-xs uppercase before:flex-1 before:border-t before:me-6 after:flex-1 after:border-t after:ms-6 text-neutral-500 before:border-neutral-600 after:border-neutral-600">
          Veya
        </div>
  
        <form onSubmit={handleSubmit}>
          <div className="grid gap-y-4">
            <div>
              <label htmlFor="nameSurname" className="block mb-2 text-sm text-white">
                Ad Soyad
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nameSurname"
                  placeholder="Adınız ve Soyadınız"
                  className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                  required
                  onChange={(e) => setNameSurname(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm text-white">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  placeholder="Kullanıcı Adı"
                  className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && (
                  <div className="absolute inset-y-3 end-0 pointer-events-none pe-3">
                    <MdError className="size-5 text-red-500" />
                  </div>
                )}
              </div>
              {usernameError && (
                <p className="text-xs text-red-600 mt-2" id="username-error">
                  Lütfen geçerli bir kullanıcı adı girin
                </p>
              )}
            </div>
  
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
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <div className="absolute inset-y-3 end-0 pointer-events-none pe-3">
                    <MdError className="size-5 text-red-500" />
                  </div>
                )}
              </div>
              {emailError && (
                <p className="text-xs text-red-600 mt-2" id="email-error">
                  Lütfen geçerli bir e-posta adresi girin
                </p>
              )}
            </div>
  
            <div>
              <label htmlFor="password" className="block mb-2 text-sm text-white">
                Şifre
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
  
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm text-white">
                Şifre Doğrulama
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 bg-neutral-900 border-neutral-700 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPasswordError && (
                  <div className="absolute inset-y-3 end-0 pointer-events-none pe-3">
                    <MdError className="size-5 text-red-500" />
                  </div>
                )}
              </div>
              {confirmPasswordError && (
                <p className="text-xs text-red-600 mt-2" id="confirm-password-error">
                  Şifreler eşleşmiyor
                </p>
              )}
            </div>
  
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
            >
              Kayıt ol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}


export default RegisterForm;
