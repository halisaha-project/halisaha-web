import React, { useEffect, useState } from 'react'
import { getProfileInfo } from '../api/userApi'

function ProfileInfo() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <p>Ad Soyad: {profileData.nameSurname}</p>
      <p>E-posta: {profileData.email}</p>
    </div>
  )
}

export default ProfileInfo
