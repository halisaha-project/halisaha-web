import React, { useState, useEffect } from 'react'
import { getGroups } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { FaUsers } from 'react-icons/fa6'
import real_madrid from '/real_madrid.png'
import { useNavigate } from 'react-router-dom'

function GroupsAll() {
  const [groupsData, setGroupsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      <div>
        <h2 className="inline-flex items-center gap-x-2 text-xl md:text-2xl font-bold mb-4">
          <FaUsers />
          Takımlarım
        </h2>
      </div>
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

        {/* <a>{JSON.stringify(groupsData)}</a> */}
      </div>
    </div>
  )
}

export default GroupsAll
