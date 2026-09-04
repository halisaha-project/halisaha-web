import { FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../context/authContext'

function ProfileInfo() {
  const { user } = useAuth()

  return (
    <div className="flex flex-wrap p-4">
      <div className="w-full md:w-1/2 p-6 mb-4">
        <h2 className="inline-flex items-center gap-x-2 text-xl sm:text-2xl font-bold mb-4">
          <FaUserCircle /> Profil Bilgileri
        </h2>
        <p className="mb-2 text-md sm:text-md ">
          <span className="font-semibold">Ad Soyad:</span>{' '}
          {user.name} {user.surname}
        </p>
        <p className="mb-2 text-md sm:text-md">
          <span className="font-semibold">Kullanıcı adı:</span> {user.username}
        </p>
        <p className="mb-2 text-md sm:text-md text-nowrap">
          <span className="font-semibold">E-posta:</span> {user.email}
        </p>
      </div>
    </div>
  )
}

export default ProfileInfo
