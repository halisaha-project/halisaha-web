import React, { useEffect, useState } from 'react'
import { getGroupDetail, createGroupInvitationLink } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa'
import real_madrid from '/real_madrid.png'
import MatchesAll from '../components/MatchesAll'
import { getMatchesByGroupId } from '../api/matchApi'

function GroupInfo() {
  const [groupsDetailData, setGroupsDetailData] = useState(null)
  const [playerUser, setPlayerUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showInviteCode, setShowInviteCode] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchGroupsData = async () => {
      const response = await getGroupDetail(id)

      if (response.success === true) {
        setGroupsDetailData(response.data.data)

        const userPlayerData = response.data.data.members.filter(
          (member) => member.user._id === user.sub
        )
        setPlayerUser(userPlayerData[0])
        setIsAdmin(response.data.data.createdBy._id === user.sub)
      } else if (response.success === false) {
        setError(response.message)
      }
      setLoading(false)
    }

    fetchGroupsData()
  }, [])

  const handleCreateInvite = async () => {
    try {
      const response = await createGroupInvitationLink(id)
      if (response.success === true) {
        setInviteCode(response.data.data.token)
        setShowInviteCode(!showInviteCode)
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Error creating invitation link')
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
              {groupsDetailData.groupName}
            </h1>
            <h3 className="text-lg font-medium text-gray-300 truncate">
              #{playerUser.shirtNumber} - {playerUser.mainPosition.abbreviation}{' '}
              - {playerUser.altPosition.abbreviation}
            </h3>
          </div>
        </div>

        <div className="flex w-full items-center justify-end md:pr-8 mt-4 px-6 gap-4">
          {isAdmin && (
            <div
              className="px-4 py-2 w-full md:w-1/2 text-center border-white border rounded-lg hover:cursor-pointer"
              onClick={() => navigate('createMatch')}
            >
              Maç Oluştur
            </div>
          )}

          <div
            className="px-4 py-2 w-full md:w-1/2 text-center border-white border rounded-lg hover:cursor-pointer"
            onClick={handleCreateInvite}
          >
            {showInviteCode ? inviteCode : 'Davet Et'}
          </div>
        </div>
      </div>
      <div>
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
                key={member.user._id}
                className="flex h-24 md:h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer "
              >
                <div className="flex items-center mx-5 md:mx-10 min-w-16">
                  <div className="relative text-center content-center bg-green-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                    <p className="font-medium md:text-lg">10.0</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 min-w-0 ">
                  <h1 className="text-lg md:text-xl font-medium truncate">
                    {member.user.nameSurname}
                  </h1>
                  <h3 className="text-lg font-medium text-gray-300 truncate">
                    #{member.shirtNumber} - {member.mainPosition.abbreviation} -{' '}
                    {member.altPosition.abbreviation}
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
