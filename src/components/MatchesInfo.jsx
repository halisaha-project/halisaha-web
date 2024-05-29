import React, { useEffect, useState } from 'react'
import { getMatchDetail } from '../api/matchApi'
import { CgSpinner } from 'react-icons/cg'
import { formatDateAndTime } from '../utils/dateUtils'
import { useNavigate, useParams } from 'react-router-dom'
import { FaFutbol } from 'react-icons/fa6'
import real_madrid from '/real_madrid.png'

function MatchesInfo() {
  const [matchDetail, setMatchDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        const response = await getMatchDetail(id)

        if (response.success === true) {
          setMatchDetail(response.data.data)
        } else if (response.success === false) {
          setError(response.message)
        }
      } catch (error) {
        console.error('Error fetching match detail:', error)
        setError('Request error')
      } finally {
        setLoading(false)
      }
    }

    fetchMatchDetail()
  }, [id])

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

  const homeTeamPlayers = matchDetail.lineup.homeTeam || []
  const awayTeamPlayers = matchDetail.lineup.awayTeam || []

  const getPlayerPositions = (userId) => {
    const member = matchDetail.createdGroupId.members.find(member => member.user === userId);
    return member ? { shirtNumber: member.shirtNumber , mainPosition: member.mainPosition, altPosition: member.altPosition.abbreviation } : { shirtNumber:null, mainPosition: null, altPosition: null };
  };

  
  
  return (
    <div className="pt-8">
      <div className="flex">
        <div className="flex items-center mx-4 md:mx-10 min-w-14">
          <img className="object-fit h-20" src={real_madrid} alt="Real Madrid Logo" />
        </div>
        <div className="flex flex-col justify-center space-y-1 min-w-0">
          <h1 className="text-lg md:text-xl font-medium truncate">
            {formatDateAndTime(matchDetail.matchDate)}
          </h1>
          <h3 className="text-lg font-medium text-gray-300 truncate">
            {matchDetail.location}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <div>
          <h1 className="text-lg">Maç Detayı</h1>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg">Oyuncular</h1>
            <FaFutbol />
            <p>{homeTeamPlayers.length + awayTeamPlayers.length}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {homeTeamPlayers.map((player) => {
              const positions = getPlayerPositions(player.user._id);
              return (
                <div
                  key={player.user._id}
                  className="flex h-24 md:h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer"
                >
                  <div className="flex items-center mx-5 md:mx-10 min-w-16">
                    <div className="relative text-center content-center bg-green-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                      <p className="font-medium md:text-lg">10.0</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-1 min-w-0">
                    <h1 className="text-lg md:text-xl font-medium truncate">
                      {player.user.nameSurname}
                    </h1>
                    <h3 className="text-lg font-medium text-gray-300 truncate">
                      # {positions.shirtNumber} - {positions.mainPosition}
                    </h3>
                  </div>
                </div>
              );
            })}
            {awayTeamPlayers.map((player) => (
              <div
                key={player.user._id}
                className="flex h-24 md:h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer"
              >
                <div className="flex items-center mx-5 md:mx-10 min-w-16">
                  <div className="relative text-center content-center bg-green-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                    <p className="font-medium md:text-lg">10.0</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 min-w-0">
                  <h1 className="text-lg md:text-xl font-medium truncate">
                    {player.user.nameSurname}
                  </h1>
                  <h3 className="text-lg font-medium text-gray-300 truncate">
                    #{player.user.nameSurname} - {player.mainPosition} -{' '}
                    {player.altPosition}
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

export default MatchesInfo