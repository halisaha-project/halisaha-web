import React, { useEffect, useState } from 'react'
import { getGroupDetail } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa'
import real_madrid from '/real_madrid.png'

function CreateMatchForm() {
  const [groupsDetailData, setGroupsDetailData] = useState(null)
  const [playerUser, setPlayerUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [defCount, setDefCount] = useState(0)
  const [midCount, setMidCount] = useState(0)
  const [fwdCount, setFwdCount] = useState(0)
  const [activeMembers, setActiveMembers] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const user = JSON.parse(localStorage.getItem('user'))
  const [positions, setPositions] = useState({
    FWD: [], // Forvet
    MID: [], // Orta Saha
    DEF: [], // Defans
    GK: [], // Kaleci
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

  const handleDivClick = (id) => {
    setActiveMembers((prevActiveMembers) =>
      prevActiveMembers.includes(id)
        ? prevActiveMembers.filter((memberId) => memberId !== id)
        : [...prevActiveMembers, id]
    )
  }

  useEffect(() => {
    const newPositions = {
      FWD: [],
      MID: [],
      DEF: [],
      GK: [],
    }

    if (
      parseInt(defCount) + parseInt(midCount) + parseInt(fwdCount) + 1 ===
      activeMembers.length
    ) {
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
    <div className="flex gap-4 space-y-4 px-8 mb-4">
      <div className="w-1/2">
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
              className={`flex h-24 md:h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer ${
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
      <div className="w-1/2">
        <div>
          <div className="h-[500px] w-[330px] bg-green-soccer-field-theme bg-contain bg-no-repeat order-1 md:order-2">
            <div className="space-y-11 md:space-y-9 pt-28 md:pt-24 lg:pt-28 ">
              <div className="flex justify-around ">{positions.FWD}</div>
              <div className="flex justify-around ">{positions.MID}</div>
              <div className="flex justify-around ">{positions.DEF}</div>
              <div className="flex justify-around ">{positions.GK}</div>
            </div>
          </div>
        </div>

        <div className=" grid gap-4">
          <div className="flex flex-col">
            <label htmlFor="">Konum</label>
            <input className="custom-input-field" type="text" />
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label htmlFor="">Tarih</label>
              <input className="custom-input-field" type="datetime-local" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">
                Diziliş (
                {parseInt(defCount) + parseInt(midCount) + parseInt(fwdCount)}/
                {activeMembers.length})
              </label>
              <div className="grid grid-cols-5 items-center text-center">
                <input
                  className="custom-input-field text-center"
                  type="text"
                  maxLength={1}
                  value={defCount}
                  onChange={(e) => setDefCount(e.target.value)}
                />
                <h1>-</h1>
                <input
                  className="custom-input-field text-center"
                  type="text"
                  maxLength={1}
                  value={midCount}
                  onChange={(e) => setMidCount(e.target.value)}
                />
                <h1>-</h1>
                <input
                  className="custom-input-field text-center"
                  type="text"
                  maxLength={1}
                  value={fwdCount}
                  onChange={(e) => setFwdCount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            className="px-4 py-2 border-white border rounded-lg hover:cursor-pointer text-center items-center"
            onClick={() => navigate('createMatch')}
          >
            Maç Oluştur
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateMatchForm
