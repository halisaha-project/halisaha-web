import { useState, useEffect } from 'react'
import { createGroup, getGroups, joinGroup } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { FaUsers } from 'react-icons/fa6'
import real_madrid from '/real_madrid.png'
import { useNavigate } from 'react-router-dom'
import { getPositions } from '../api/positionApi'

function GroupsAll() {
  const [groupsData, setGroupsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [showCreateFrom, setShowCreateForm] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [groupName, setGroupName] = useState('')
  const [mainPosition, setMainPosition] = useState('')
  const [altPosition, setAltPosition] = useState('')
  const [shirtNumber, setShirtNumber] = useState('')
  const [positions, setPositions] = useState([])
  const [filteredSubPositions, setFilteredSubPositions] = useState([])
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGroupsData = async () => {
      const response = await getGroups()

      if (response.success === true) {
        setGroupsData(response.data)
      } else if (response.success === false) {
        setError(response.message)
      }
      setLoading(false)
    }

    fetchGroupsData()

    const fetchPositions = async () => {
      const response = await getPositions()
      if (response.success) {
        setPositions(response.data)
      } else {
        setFormError(response.error?.clientMessage || response.message)
      }
    }

    fetchPositions()
  }, [])

  useEffect(() => {
    setFilteredSubPositions(
      positions.filter((position) => position.abbreviation !== mainPosition)
    )
  }, [mainPosition, positions])

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
          setGroupsData(updatedGroupsResponse.data)
        } else if (updatedGroupsResponse.success === false) {
          setError(updatedGroupsResponse.message)
        }

        setInviteCode('')
        setMainPosition('')
        setAltPosition('')
        setShirtNumber('')
        setShowJoinForm(false)
      } else {
        setFormError(
          response.error?.clientMessage ||
            response.message ||
            'Beklenmeyen Bir Hata Oluştu.'
        )
      }
    } catch {
      setFormError('Beklenmeyen Bir Hata Oluştu.')
    }
  }
  const handleCreateTeam = async (e) => {
    e.preventDefault()
    setFormError('')

    try {
      const response = await createGroup(
        groupName,
        mainPosition,
        altPosition,
        shirtNumber
      )

      if (response.success) {
        const updatedGroupsResponse = await getGroups()
        if (updatedGroupsResponse.success === true) {
          setGroupsData(updatedGroupsResponse.data)
        } else if (updatedGroupsResponse.success === false) {
          setError(updatedGroupsResponse.message)
        }

        setGroupName('')
        setMainPosition('')
        setAltPosition('')
        setShirtNumber('')
        setShowCreateForm(false)
      } else {
        setFormError(
          response.error?.clientMessage ||
            response.message ||
            'Beklenmeyen Bir Hata Oluştu.'
        )
      }
    } catch {
      setFormError('Beklenmeyen Bir Hata Oluştu.')
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
      <div className="md:flex justify-between mb-4 ">
        <div>
          <h2 className="inline-flex items-center gap-x-2 text-xl md:text-2xl font-bold mb-4">
            <FaUsers />
            Takımlarım
          </h2>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="px-4 py-2 border-white border rounded-lg hover:cursor-pointer "
              onClick={() => {
                setShowCreateForm(!showCreateFrom)
                setShowJoinForm(false)
              }}
            >
              Takım Kur
            </button>
            <button
              className="px-4 py-2 border-white border rounded-lg hover:cursor-pointer "
              onClick={() => {
                setShowJoinForm(!showJoinForm)
                setShowCreateForm(false)
              }}
            >
              Takıma Katıl
            </button>
          </div>
        </div>
      </div>
      {showJoinForm && (
        <div className="mb-8 lg:p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Takıma Katıl</h3>
          <form
            onSubmit={handleJoinTeam}
            className=" grid lg:grid-cols-5 gap-4"
          >
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
                {positions.map((position) => (
                  <option key={position.id} value={position.abbreviation}>
                    {position.name}
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
                {filteredSubPositions.map((position) => (
                  <option key={position.id} value={position.abbreviation}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className=" text-sm font-medium">Forma Numarası</label>
              <input
                type="number"
                min="1"
                max="99"
                value={shirtNumber}
                onChange={(e) => setShirtNumber(e.target.value)}
                className="mt-1  w-full px-3 py-2 custom-input-field"
                required
              />
            </div>
            <div className="content-end">
              <button
                type="submit"
                className="w-full px-4 py-2 border-white border rounded-lg hover:cursor-pointer"
              >
                Katıl
              </button>
            </div>
          </form>
          {formError && <p className="text-red-500">{formError}</p>}
        </div>
      )}

      {showCreateFrom && (
        <div className="mb-8 lg:p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Takım Kur</h3>
          <form
            onSubmit={handleCreateTeam}
            className=" grid lg:grid-cols-5 gap-4"
          >
            <div className="">
              <label className=" text-sm font-medium">Takım Adı</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
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
                {positions.map((position) => (
                  <option key={position.id} value={position.abbreviation}>
                    {position.name}
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
                {filteredSubPositions.map((position) => (
                  <option key={position.id} value={position.abbreviation}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className=" text-sm font-medium">Forma Numarası</label>
              <input
                type="number"
                min="1"
                max="99"
                value={shirtNumber}
                onChange={(e) => setShirtNumber(e.target.value)}
                className="mt-1  w-full px-3 py-2 custom-input-field"
                required
              />
            </div>
            <div className="content-end">
              <button
                type="submit"
                className="w-full px-4 py-2 border-white border rounded-lg hover:cursor-pointer"
              >
                Oluştur
              </button>
            </div>
          </form>
          {formError && <p className="text-red-500">{formError}</p>}
        </div>
      )}

      <div className="flex flex-col space-y-4 mb-8">
        {groupsData.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-32 bg-background-theme bg-cover bg-center rounded-xl text-center px-4">
            <h1 className="text-lg md:text-xl font-medium">
              Henüz bir takımın yok
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Yeni bir takım oluşturabilir veya bir daveti kabul ederek takıma
              katılabilirsin.
            </p>
          </div>
        ) : (
          groupsData.map((group) => (
            <div
              key={group.id}
              className="flex h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer "
              onClick={() => {
                navigate(`/teams/${group.id}`)
              }}
            >
              <div className="flex items-center mx-5 md:mx-10 min-w-16">
                <img className="object-fit h-20" src={real_madrid} />
              </div>
              <div className="flex flex-col justify-center space-y-1 min-w-0 ">
                <h1 className="text-lg md:text-xl font-medium truncate">
                  {group.name}
                </h1>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default GroupsAll
