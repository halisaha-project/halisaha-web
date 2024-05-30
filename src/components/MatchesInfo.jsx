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

  const organizePlayersByPosition = (players) => {
    const positions = {
      FWD: [], // Forvet
      MID: [], // Orta Saha
      DEF: [], // Defans
      GK: [], // Kaleci
    }

    players.forEach((player) => {
      const { abbreviation } = player.position
      if (positions[abbreviation]) {
        positions[abbreviation].push(player)
      }
    })

    return positions
  }

  const homePlayersByPosition = organizePlayersByPosition(homeTeamPlayers)
  const awayPlayersByPosition = organizePlayersByPosition(awayTeamPlayers)

  return (
    <div className="pt-8">
      <div className="flex justify-center">
        <div className="flex items-center mx-4 md:mx-10 min-w-14">
          <img
            className="object-fit h-20"
            src={real_madrid}
            alt="Real Madrid Logo"
          />
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
        <div className="">
          <h1 className="text-lg">Maç Detayı</h1>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg">Oyuncular</h1>
            <FaFutbol />
            <p>{homeTeamPlayers.length + awayTeamPlayers.length}</p>
          </div>
          <div className="flex justify-center ">
            <div className="h-[500px] bg-green-soccer-field-theme w-1/3 bg-contain bg-no-repeat">
              <div className="space-y-12 pt-28">
                <div className="flex justify-around ">
                  {homePlayersByPosition.FWD.map((player) => {
                    return (
                      <div key={player} className="">
                        <div className="relative text-center content-center bg-gray-700 h-10 w-10 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
                          <p className="font-semibold md:text-md">
                            {player.user.shirtNumber}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-around ">
                  {homePlayersByPosition.MID.map((player) => {
                    return (
                      <div key={player} className="">
                        <div className="relative text-center content-center bg-gray-700 h-10 w-10 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
                          <p className="font-semibold md:text-md">
                            {player.user.shirtNumber}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex  justify-around ">
                  {homePlayersByPosition.DEF.map((player) => {
                    return (
                      <div key={player} className="">
                        <div className="relative text-center content-center bg-gray-700 h-10 w-10 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
                          <p className="font-semibold md:text-md">
                            {player.user.shirtNumber}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-center">
                  {homePlayersByPosition.GK.map((player) => {
                    return (
                      <div key={player} className="">
                        <div className="relative text-center content-center bg-gray-700 h-10 w-10 md:h-12 md:w-12 rounded-full border-gray-400 border-4">
                          <p className="font-semibold md:text-md">
                            {player.user.shirtNumber}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchesInfo
