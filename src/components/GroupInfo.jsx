import { useEffect, useState } from 'react'
import {
  getGroupDetail,
  createGroupInvitation,
  deleteGroup,
} from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'
import real_madrid from '/real_madrid.png'
import MatchesAll from '../components/MatchesAll'
import { getMatchesByGroupId } from '../api/matchApi'
import { useAuth } from '../context/authContext'

function GroupInfo() {
  const [groupsDetailData, setGroupsDetailData] = useState(null)
  const [playerUser, setPlayerUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState(null)
  const [inviteSuccess, setInviteSuccess] = useState(null)
  const [inviting, setInviting] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    const fetchGroupsData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getGroupDetail(id)

        if (response.success === true) {
          const group = response.data
          setGroupsDetailData(group)
          setPlayerUser(
            group.members.find((member) => member.userId === user.id) || null
          )
          setIsAdmin(group.ownerId === user.id)
        } else {
          setError(
            response.error?.clientMessage ||
              response.message ||
              'Beklenmeyen Bir Hata Oluştu.'
          )
        }
      } catch (requestError) {
        setError(
          requestError.clientMessage || 'Beklenmeyen Bir Hata Oluştu.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGroupsData()
  }, [id, user.id])

  const handleCreateInvite = async (event) => {
    event.preventDefault()
    setInviteError(null)
    setInviteSuccess(null)
    setInviting(true)

    try {
      const response = await createGroupInvitation(id, inviteEmail)
      if (response.success === true) {
        setInviteEmail('')
        setShowInviteForm(false)
        setInviteSuccess('Davet başarıyla gönderildi.')
      } else {
        setInviteError(
          response.error?.clientMessage ||
            response.message ||
            'Beklenmeyen Bir Hata Oluştu.'
        )
      }
    } catch (requestError) {
      setInviteError(
        requestError.clientMessage || 'Beklenmeyen Bir Hata Oluştu.'
      )
    } finally {
      setInviting(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (confirm('Grubu silmek istediğinize emin misiniz?')) {
      const response = await deleteGroup(id)
      if (response.success === true) {
        navigate('/teams')
      } else {
        setError(response.message)
      }
    }
  }

  if (loading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <CgSpinner className="animate-spin text-5xl" />
      </div>
    )
  }
  if (error) {
    return <p className="text-center mt-4 text-red-500">Hata: {error}</p>
  }
  return (
    <div className="pt-8">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex w-full">
          <div className="flex items-center mx-4 md:mx-10 min-w-14">
            <img className="object-fit h-20" src={real_madrid} />
          </div>
          <div className="flex flex-col justify-center space-y-1 min-w-0">
            <h1 className="text-lg md:text-xl font-medium truncate">
              {groupsDetailData.name}
            </h1>
            {playerUser && (
              <h3 className="text-lg font-medium text-gray-300 truncate">
                #{playerUser.shirtNumber} - {playerUser.mainPosition} -{' '}
                {playerUser.altPosition}
              </h3>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full items-center justify-end md:pr-8 mt-4 px-6 gap-2">
          <div className="flex w-full gap-2">
            {isAdmin && (
              <div
                className="px-4 py-2 w-full md:w-1/2 text-center sm:min-w-[150px] border-white border rounded-lg hover:cursor-pointer"
                onClick={() => navigate('createMatch')}
              >
                Maç Oluştur
              </div>
            )}

            {isAdmin && (
              <button
                type="button"
                className="px-4 py-2 w-full md:w-1/2 text-center sm:min-w-[150px] border-white border rounded-lg hover:cursor-pointer"
                onClick={() => {
                  setShowInviteForm(!showInviteForm)
                  setInviteError(null)
                  setInviteSuccess(null)
                }}
              >
                Davet Et
              </button>
            )}
          </div>

          {isAdmin && (
            <div
              className="flex px-4 w-full py-3 sm:w-auto items-center justify-center  border-white border rounded-lg hover:cursor-pointer"
              onClick={() => setShowDeleteButton(!showDeleteButton)}
            >
              <FaBars />
            </div>
          )}
        </div>
      </div>
      {showInviteForm && (
        <form
          onSubmit={handleCreateInvite}
          className="flex flex-col sm:flex-row gap-2 mt-4 px-6 md:justify-end md:pr-8"
        >
          <input
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="E-posta adresi"
            className="px-3 py-2 custom-input-field"
            required
          />
          <button
            type="submit"
            disabled={inviting}
            className="px-4 py-2 border-white border rounded-lg disabled:opacity-50"
          >
            {inviting ? 'Gönderiliyor...' : 'Daveti Gönder'}
          </button>
        </form>
      )}
      {inviteError && (
        <p className="text-red-500 mt-2 px-6 md:text-right md:pr-8">
          {inviteError}
        </p>
      )}
      {inviteSuccess && (
        <p className="text-green-500 mt-2 px-6 md:text-right md:pr-8">
          {inviteSuccess}
        </p>
      )}
      <div>
        {showDeleteButton && (
          <div className="flex justify-center md:justify-end mt-4 md:pr-8">
            <button
              className="px-4 py-2  border-red-900 border-2 text-red-600 rounded-lg"
              onClick={handleDeleteGroup}
            >
              Grubu Sil
            </button>
          </div>
        )}
        <div className="my-4">
          <MatchesAll
            fetchDataMethod={getMatchesByGroupId(id)}
            isGroupBy={true}
          />
        </div>
        <div className="space-y-4 px-8 mb-4">
          <div className="flex items-center space-x-2 text-xl">
            <h1 className="">Oyuncular</h1>
            <FaUsers />
            <p>{groupsDetailData.members.length}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {groupsDetailData.members.map((member) => (
              <div
                key={member.userId}
                className="flex h-24 md:h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer "
              >
                <div className="flex items-center mx-5 md:mx-10 min-w-16">
                  <div className="relative text-center content-center bg-gray-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                    <p className="font-medium md:text-lg">#{member.shirtNumber}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 min-w-0 ">
                  <h1 className="text-lg md:text-xl font-medium truncate">
                    {[member.name, member.surname].filter(Boolean).join(' ') ||
                      'Oyuncu'}
                  </h1>
                  <h3 className="text-lg font-medium text-gray-300 truncate">
                    {member.mainPosition} - {member.altPosition}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupInfo
