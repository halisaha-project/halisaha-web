import React, { useState, useEffect } from 'react'
import { getMatches } from '../api/matchApi'
import { formatDateAndTime } from '../utils/dateUtils'
import { CgSpinner } from 'react-icons/cg'
import { FaFutbol } from 'react-icons/fa6'
import real_madrid from '/real_madrid.png'
import { useNavigate } from 'react-router-dom'

function MatchesAll() {
  const [matchesData, setMatchesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMatchesData = async () => {
      try {
        const response = await getMatches()

        if (response.success === true) {
          setMatchesData(response.data.data)
        } else {
          setError(response.message || 'Cannot get matches info')
        }
      } catch (error) {
        console.error('Match error:', error.message)
        setError('Request error')
      } finally {
        setLoading(false)
      }
    }

    fetchMatchesData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinner className="animate-spin text-5xl" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">Hata: {error}</p>
  }

  return (
    <div className="p-8">
      <div>
        <h2 className="inline-flex items-center gap-x-2 text-xl md:text-2xl font-bold mb-4">
          <FaFutbol />
          Maçlarım
        </h2>
      </div>
      <div className="flex flex-col space-y-4">
        {matchesData.map((match) => (
          <div
            key={match._id}
            className="flex h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer"
            onClick={() => navigate(`/matches/${match._id}`)}
          >
            <div className="flex items-center mx-5 md:mx-10 min-w-16">
              <img className="object-fit h-20" src={real_madrid} />
            </div>
            <div className="flex flex-col justify-center space-y-1 min-w-0 ">
              <h1 className="text-lg md:text-xl font-medium truncate">
                {formatDateAndTime(match.matchDate)}
              </h1>
              <h3 className="text-lg font-medium text-gray-300 truncate">
                {match.location}
                
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchesAll
