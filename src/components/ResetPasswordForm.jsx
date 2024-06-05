import React, { useState } from 'react'
import { PiPasswordBold } from 'react-icons/pi'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from '../api/otpApi'

function ResetPasswordForm() {
  const [error, setError] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor')
      return
    }
    try {
      const response = await resetPassword(email, newPassword)
      if (response.success) {
        navigate('/login')
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Şifre değiştirilirken bir hata oluştu')
    }
  }

  return (
    <div className="w-2/3 lg:w-1/2">
      <div className="text-center">
        <h2 className="inline-flex items-center gap-x-2 text-xl sm:text-2xl font-bold mb-4">
          <PiPasswordBold /> Şifre Güncelle
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium ">Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 custom-input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">
              Yeni Şifre Tekrar
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 custom-input-field"
              required
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full mt-5 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Şifreyi Değiştir
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordForm
