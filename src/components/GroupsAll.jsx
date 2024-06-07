import React, { useState, useEffect } from 'react'
import { getGroups, joinGroup } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { FaUsers } from 'react-icons/fa6'
import real_madrid from '/real_madrid.png'
import { useNavigate } from 'react-router-dom'

const mainPositions = ['DEF', 'MID', 'FWD', 'GK']

function GroupsAll() {
  const [groupsData, setGroupsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [mainPosition, setMainPosition] = useState('')
  const [altPosition, setAltPosition] = useState('')
  const [shirtNumber, setShirtNumber] = useState('')
  const [filteredSubPositions, setFilteredSubPositions] =
    useState(mainPositions)
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGroupsData = async () => {
      const response = await getGroups()

      if (response.success === true) {
        setGroupsData(response.data.data)
      } else if (response.success === false) {
        setError(response.message)
      }
      setLoading(false)
    }

    fetchGroupsData()
  }, [])

  useEffect(() => {
    setFilteredSubPositions(mainPositions.filter((pos) => pos !== mainPosition))
  }, [mainPosition])

  const handleJoinTeam = async (e) => {
    e.preventDefault()
    setFormError('')

    try {
      const response = await joinGroup(
        inviteCode,
        mainPosition,
        altPosition,
        shirtNumber
      )

      if (response.success) {
        const updatedGroupsResponse = await getGroups()
        if (updatedGroupsResponse.success === true) {
          setGroupsData(updatedGroupsResponse.data.data)
        } else if (updatedGroupsResponse.success === false) {
          setError(updatedGroupsResponse.message)
        }

        setInviteCode('')
        setMainPosition('')
        setAltPosition('')
        setShirtNumber('')
        setShowJoinForm(false)
      } else {
        console.error('Join group error:', response.message)
        setFormError(response.message || 'Failed to join the group')
      }
    } catch (error) {
      console.error('Join group error:', error.message)
      setFormError('Failed to join the group')
    }
  }

  if (loading)
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <CgSpinner className="animate-spin text-5xl" />
      </div>
    )
  if (error)
    return <p className="text-center mt-4 text-red-500">Hata: {error}</p>

  return (
    <div className="p-8">
      <div className="">
        <h2 className="inline-flex items-center gap-x-2 text-xl md:text-2xl font-bold mb-4">
          <FaUsers />
          Takımlarım
        </h2>
        <button
          className="px-4 py-2 border-white border rounded-lg hover:cursor-pointer  float-right"
          onClick={() => setShowJoinForm(!showJoinForm)}
        >
          Takıma Katıl
        </button>
      </div>
      {showJoinForm && (
        <div className="mb-8 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-4">Takıma Katıl</h3>
          <form onSubmit={handleJoinTeam} className=" grid grid-cols-5 gap-4">
            <div className="">
              <label className=" text-sm font-medium">Davet Kodu</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="mt-1  w-full px-3 py-2 custom-input-field"
                required
              />
            </div>{' '}
            <div>
              <label className=" text-sm font-medium">Ana Pozisyon</label>
              <select
                value={mainPosition}
                onChange={(e) => setMainPosition(e.target.value)}
                className="mt-1  w-full px-3 py-2 custom-input-field"
                required
              >
                <option value="">Seçiniz</option>
                {mainPositions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className=" text-sm font-medium">
                Alternatif Pozisyon
              </label>
              <select
                value={altPosition}
                onChange={(e) => setAltPosition(e.target.value)}
                className="mt-1  w-full px-3 py-2 custom-input-field"
                required
              >
                <option value="">Seçiniz</option>
                {filteredSubPositions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className=" text-sm font-medium">Forma Numarası</label>
              <input
                type="text"
                value={shirtNumber}
                onChange={(e) => setShirtNumber(e.target.value)}
                className="mt-1  w-full px-3 py-2 custom-input-field"
                required
              />
            </div>
            <div className="content-end">
              {formError && <p className="text-red-500">{formError}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 border-white border rounded-lg hover:cursor-pointer"
              >
                Katıl
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex flex-col space-y-4">
        {groupsData.map((group) => (
          <div
            key={group._id}
            className="flex h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer "
            onClick={() => {
              navigate(`/teams/${group._id}`)
            }}
          >
            <div className="flex items-center mx-5 md:mx-10 min-w-16">
              <img className="object-fit h-20" src={real_madrid} />
            </div>
            <div className="flex flex-col justify-center space-y-1 min-w-0 ">
              <h1 className="text-lg md:text-xl font-medium truncate">
                {group.groupName}
              </h1>
              <h3 className="text-lg font-medium text-gray-300 truncate">
                #{group.members[0].shirtNumber} -{' '}
                {group.members[0].mainPosition.abbreviation} -{' '}
                {group.members[0].altPosition.abbreviation}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupsAll
