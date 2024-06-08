import React, { useEffect, useState } from 'react'
import { getGroupDetail } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa'
import real_madrid from '/real_madrid.png'
import { createMatch } from '../api/matchApi'

function CreateMatchForm() {
  const [groupsDetailData, setGroupsDetailData] = useState(null)
  const [playerUser, setPlayerUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [defCount, setDefCount] = useState('')
  const [midCount, setMidCount] = useState('')
  const [fwdCount, setFwdCount] = useState('')
  const [activeMembers, setActiveMembers] = useState([])
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState(null)
  const [formationError, setFormationError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const user = JSON.parse(localStorage.getItem('user'))
  const [positions, setPositions] = useState({
    FWD: [],
    MID: [],
    DEF: [],
    GK: [],
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const totalInFormation = defCount + midCount + fwdCount

    if (totalInFormation < 3) {
      setFormationError('Dizilişte en az 3 oyuncu olmalıdır.')
      return
    }

    const groupId = id
    const players = activeMembers
    const formation = `${defCount}-${midCount}-${fwdCount}`
    const matchDate = date + 'Z'

    console.log(groupId, players, formation, matchDate, location)

    const response = await createMatch(
      groupId,
      players,
      formation,
      matchDate,
      location
    )
    if (response.success === true) {
      navigate(`/matches/${response.data.data._id}`)
    } else if (response.success === false) {
      setError(response.message)
    }
  }

  const handleDivClick = (id) => {
    setActiveMembers((prevActiveMembers) =>
      prevActiveMembers.includes(id)
        ? prevActiveMembers.filter((memberId) => memberId !== id)
        : [...prevActiveMembers, id]
    )
  }

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value
    if (value === '') {
      setter('')
    } else {
      const parsedValue = parseInt(value)
      setter(isNaN(parsedValue) ? 0 : parsedValue)
    }
  }

  const parseInput = (value) => {
    return value === '' ? 0 : parseInt(value)
  }

  useEffect(() => {
    setFormationError(null)
    const newPositions = {
      FWD: [],
      MID: [],
      DEF: [],
      GK: [],
    }
    const totalInFormation = defCount + midCount + fwdCount

    if (totalInFormation < 3) {
      setPositions({
        FWD: [],
        MID: [],
        DEF: [],
        GK: [],
      })

      return
    }
    if (defCount < 1 || midCount < 1 || fwdCount < 1) {
      setFormationError('Dizilişteki her pozisyonda en az 1 oyuncu olmalıdır.')
      setPositions({
        FWD: [],
        MID: [],
        DEF: [],
        GK: [],
      })
      return
    }
    if (defCount > 5 || midCount > 5 || fwdCount > 5) {
      setFormationError(
        'Dizilişteki her pozisyonda en fazla 5 oyuncu olmalıdır.'
      )
      setPositions({
        FWD: [],
        MID: [],
        DEF: [],
        GK: [],
      })
      return
    }
    if (totalInFormation > activeMembers.length) {
      setFormationError(
        'Dizilişteki oyuncu sayısı, takımdaki oyuncu sayısından fazla olamaz.'
      )
      setPositions({
        FWD: [],
        MID: [],
        DEF: [],
        GK: [],
      })
      return
    }

    if (totalInFormation < activeMembers.length - 1) {
      setFormationError(
        'Dizilişteki oyuncu sayısı, takımdaki oyuncu sayısından 1 eksik (kaleci) ya da eşit olmalıdır.'
      )
      setPositions({
        FWD: [],
        MID: [],
        DEF: [],
        GK: [],
      })
      return
    }
    if (totalInFormation + 1 === activeMembers.length) {
      newPositions.GK.push(
        <div key={`gk`} className="">
          <div className=" text-center content-center bg-gray-700 h-12 w-12 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
            <p className="font-semibold md:text-md">X</p>
          </div>
        </div>
      )
    }

    for (let i = 0; i < defCount; i++) {
      newPositions.DEF.push(
        <div key={`def-${i}`} className="">
          <div className=" text-center content-center bg-gray-700 h-12 w-12 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
            <p className="font-semibold md:text-md">X</p>
          </div>
        </div>
      )
    }

    for (let i = 0; i < midCount; i++) {
      newPositions.MID.push(
        <div key={`mid-${i}`} className="">
          <div className="relative text-center content-center bg-gray-700 h-12 w-12 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
            <p className="font-semibold md:text-md">X</p>
          </div>
        </div>
      )
    }

    for (let i = 0; i < fwdCount; i++) {
      newPositions.FWD.push(
        <div key={`fwd-${i}`} className="">
          <div className="relative text-center content-center bg-gray-700 h-12 w-12 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
            <p className="font-semibold md:text-md">X</p>
          </div>
        </div>
      )
    }

    setPositions(newPositions)
  }, [defCount, midCount, fwdCount, activeMembers])

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
    <div className="flex flex-col md:flex-row gap-8 space-y-4 px-2 md:px-8 mb-4">
      <div className="w-full md:w-1/2">
        <div className="flex items-center space-x-2 text-xl">
          <h1 className="">Oyuncular</h1>
          <FaUsers />
          <p>
            {activeMembers.length}/{groupsDetailData.members.length}
          </p>
        </div>
        <div className="grid gap-4">
          {groupsDetailData.members.map((member) => (
            <div
              key={member.user._id}
              onClick={() => handleDivClick(member.user._id)}
              className={`flex h-24 md:h-28 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer ${
                activeMembers.includes(member.user._id)
                  ? 'border-2 border-green-500'
                  : ''
              }`}
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
      <div className="w-full md:w-1/2 space-y-4">
        <div className="flex justify-center pt-3">
          <div className="h-[500px] w-[360px] bg-green-soccer-field-theme bg-cover bg-center  bg-no-repeat">
            <div className="pt-[100px] ">
              <div className="flex items-center justify-around h-[100px] ">
                {positions.FWD}
              </div>
              <div className="flex items-center justify-around h-[100px]">
                {positions.MID}
              </div>
              <div className="flex items-center justify-around h-[100px]">
                {positions.DEF}
              </div>
              <div className="flex items-center justify-around h-[100px]">
                {positions.GK}
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label htmlFor="">Konum</label>
              <input
                className="custom-input-field"
                value={location}
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="flex flex-col">
                <label htmlFor="">Tarih</label>
                <input
                  className="custom-input-field"
                  value={date}
                  type="datetime-local"
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="">
                  Diziliş (
                  {parseInput(defCount) +
                    parseInput(midCount) +
                    parseInput(fwdCount)}
                  /{activeMembers.length})
                </label>
                <div className="grid grid-cols-5 items-center text-center">
                  <input
                    className="custom-input-field text-center"
                    type="text"
                    maxLength={1}
                    value={defCount}
                    onChange={handleInputChange(setDefCount)}
                    required
                  />
                  <h1>-</h1>
                  <input
                    className="custom-input-field text-center"
                    type="text"
                    maxLength={1}
                    value={midCount}
                    onChange={handleInputChange(setMidCount)}
                    required
                  />
                  <h1>-</h1>
                  <input
                    className="custom-input-field text-center"
                    type="text"
                    maxLength={1}
                    value={fwdCount}
                    onChange={handleInputChange(setFwdCount)}
                    required
                  />
                </div>
                {formationError && (
                  <p className="text-red-500 text-sm mt-2">{formationError}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 border-white border rounded-lg hover:cursor-pointer text-center items-center disabled:opacity-50 disabled:cursor-not-allowed  "
              disabled={formationError}
            >
              Maç Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatchForm
