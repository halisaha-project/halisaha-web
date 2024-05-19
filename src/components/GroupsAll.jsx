import React, { useState, useEffect } from 'react'
import { getGroups } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { FaUsers } from 'react-icons/fa6'
import real_madrid from '/real_madrid.png'

function GroupsAll() {
  const [groupsData, setGroupsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGroupsData = async () => {
      const response = await getGroups()
      console.log(response.data.data)

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
        <h2 className="inline-flex items-center gap-x-2 text-xl sm:text-2xl font-bold mb-4">
          <FaUsers />
          Takımlarım
        </h2>
      </div>
      <div className="flex justify-between">
        {groupsData.map((group) => (
          <div key={group._id} className="flex">
            <div>
              <img className="object-fit h-20" src={real_madrid} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{group.groupName}</h3>
            </div>
          </div>
        ))}
      </div>

      <a>{JSON.stringify(groupsData)}</a>
    </div>
  )
}

export default GroupsAll
