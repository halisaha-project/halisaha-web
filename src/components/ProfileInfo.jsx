import React, { useEffect, useState } from 'react'
import { getProfileInfo } from '../api/userApi'
import { FaUserCircle } from 'react-icons/fa'
import { PiPasswordBold } from 'react-icons/pi'

function ProfileInfo() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      const response = await getProfileInfo()
      console.log(response.data.data)

      if (response.success === true) {
        setProfileData(response.data.data)
      } else if (response.success === false) {
        setError(response.message)
      }
      setLoading(false)
    }

    fetchProfileData()
  }, [])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    // Call an API to change the password here (not provided)
    // Example: await changePassword({ currentPassword, newPassword });

    // Handle success and error responses from the password change API
  }

  if (loading) return <p className="text-center mt-4">Yükleniyor...</p>
  if (error)
    return <p className="text-center mt-4 text-red-500">Hata: {error}</p>

  return (
    <div className="flex flex-wrap p-4">
      <div className="w-full md:w-1/2 p-6 mb-4">
        <h2 className="inline-flex items-center gap-x-2 text-xl sm:text-2xl font-bold mb-4">
          <FaUserCircle /> Profil Bilgileri
        </h2>
        <p className="mb-2 text-md sm:text-md ">
          <span className="font-semibold">Ad Soyad:</span>{' '}
          {profileData.nameSurname}
        </p>
        <p className="mb-2 text-md sm:text-md text-nowrap">
          <span className="font-semibold">E-posta:</span> {profileData.email}
        </p>
      </div>

      <div className="w-full md:w-1/2 p-6">
        <h2 className="inline-flex items-center gap-x-2 text-xl sm:text-2xl font-bold mb-4">
          <PiPasswordBold /> Şifre Güncelle
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium ">Güncel Şifre</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 custom-input-field"
              required
            />
          </div>
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

export default ProfileInfo
