import React, { useEffect, useState } from 'react'
import { getGroupDetail } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate, useParams } from 'react-router-dom'

function GroupInfo() {
  const [groupsDetailData, setGroupsDetailData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchGroupsData = async () => {
      const response = await getGroupDetail(id)

      if (response.success === true) {
        setGroupsDetailData(response.data.data)
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
    <div>
      <h1 className="text-2xl font-semibold">Group Info</h1>

      <p>{JSON.stringify(groupsDetailData)}</p>
    </div>
  )
}

export default GroupInfo
