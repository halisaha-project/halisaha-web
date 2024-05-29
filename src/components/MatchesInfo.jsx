import React, { useEffect, useState } from 'react'
import { getMatchDetail } from '../api/matchApi'
import { CgSpinner } from 'react-icons/cg'
import { formatDateAndTime } from '../utils/dateUtils'
import { useParams } from 'react-router-dom'
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

  const positionLabels = {
    '663e94ae3f58cf748889aaed': 'Forvet',
    '663e94ae3f58cf748889aaca': 'Orta Saha',
    '663e94ae3f58cf748889aa98': 'Defans',
    '663e94ae3f58cf748889ab10': 'Kaleci'
  };

  const organizePlayersByPosition = (players) => {
    const positions = {
      '663e94ae3f58cf748889aaed': [], // Forvet
      '663e94ae3f58cf748889aaca': [], // Orta Saha
      '663e94ae3f58cf748889aa98': [], // Defans
      '663e94ae3f58cf748889ab10': []  // Kaleci
    };

    players.forEach(player => {
      const { mainPosition } = getPlayerPositions(player.user._id);
      if (positions[mainPosition]) {
        positions[mainPosition].push(player);
      }
    });

    return positions;
  };

  const homePlayersByPosition = organizePlayersByPosition(homeTeamPlayers);
  const awayPlayersByPosition = organizePlayersByPosition(awayTeamPlayers);

  const renderPlayers = (players) => {
    return players.map((player) => {
      const positions = getPlayerPositions(player.user._id);
      return (
        <div
          key={player.user._id}
          className="flex h-16 md:h-20 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer w-54 md:w-72"
        >
          <div className="flex items-center mx-2 md:mx-4 min-w-12">
            <div className="relative text-center content-center bg-green-600 h-10 w-10 md:h-12 md:w-12 rounded-full">
              <p className="font-medium md:text-md">10.0</p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-1 min-w-0">
            <h1 className="text-md md:text-lg font-medium truncate">
              {player.user.nameSurname}
            </h1>
            <h3 className="text-sm font-medium text-gray-300 truncate">
              # {positions.shirtNumber} - {positionLabels[positions.mainPosition]}
            </h3>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="pt-8">
      <div className="flex justify-center">
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
          <div className="space-y-4">
            <div className="flex justify-center">

            </div>
            <div className="flex justify-center flex-wrap gap-4">
              {renderPlayers(homePlayersByPosition['663e94ae3f58cf748889aaed'])}
              {renderPlayers(awayPlayersByPosition['663e94ae3f58cf748889aaed'])}
            </div>
            <div className="flex justify-center">

            </div>
            <div className="flex justify-center flex-wrap gap-4">
              {renderPlayers(homePlayersByPosition['663e94ae3f58cf748889aaca'])}
              {renderPlayers(awayPlayersByPosition['663e94ae3f58cf748889aaca'])}
            </div>
            <div className="flex justify-center">

            </div>
            <div className="flex justify-center flex-wrap gap-4">
              {renderPlayers(homePlayersByPosition['663e94ae3f58cf748889aa98'])}
              {renderPlayers(awayPlayersByPosition['663e94ae3f58cf748889aa98'])}
            </div>
            <div className="flex justify-center">

            </div>
            <div className="flex justify-center flex-wrap gap-4">
              {renderPlayers(homePlayersByPosition['663e94ae3f58cf748889ab10'])}
              {renderPlayers(awayPlayersByPosition['663e94ae3f58cf748889ab10'])}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchesInfo
