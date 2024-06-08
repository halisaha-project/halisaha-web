import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMatchDetail } from '../api/matchApi'
import { vote , getVotesByMatchId } from '../api/voteApi'
import { getProfileInfo } from '../api/userApi'
import { FaUsers } from 'react-icons/fa'

const VotingForm = () => {
  const { id } = useParams()
  const [voterId, setVoterId] = useState(null);
  const [matchDetail, setMatchDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [voteSubmitted, setVoteSubmitted] = useState(false)

  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        const response = await getMatchDetail(id)
        if (response.success) {
          setMatchDetail(response.data.data)
        } else {
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

    
  

  const handleVote = async () => {
    if (!selectedPlayer) {
      alert('Please select a player to vote for.')
      return
    }

    try {
      const voteData = {
        matchId: id,
        votes: [
          {
            voterId: voterId, 
            votedUsers: [
              {
                votedUserId: selectedPlayer,
                rating: 7.5, 
              },
            ],
          },
        ],
      }

      const response = await vote(voteData)
      if (response.success) {
        setVoteSubmitted(true)
      } else {
        setError(response.message)
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      setError('Request error')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const players = [
    ...(matchDetail?.lineup?.homeTeam || []),
    ...(matchDetail?.lineup?.awayTeam || [])
  ]

  return (
    <div className="flex flex-col md:flex-row gap-8 space-y-4 px-2 md:px-8 mb-4">
      <div className="w-full md:w-1/2">
        <div className="flex items-center space-x-2 text-xl">
            <h1 className="">Oyuncular</h1>
            <FaUsers />
            <p>
            {players.length}
            </p>
        </div>
        <div className="grid gap-4">
            {matchDetail?.lineup?.homeTeam.map((player) => (
                <div
                key={player.user.user._id}
                className="flex h-24 md:h-28 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer"
                >
                <div className="flex items-center mx-5 md:mx-10 min-w-16">
                    <div className="relative text-center content-center bg-green-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                    <p className="font-medium md:text-lg">10.0</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 min-w-0 ">
                    <h1 className="text-lg md:text-xl font-medium truncate">
                    {player.user.user.nameSurname}
                    </h1>
                    <h3 className="text-lg font-medium text-gray-300 truncate">
                    #{player.user.shirtNumber} - {player.position.abbreviation}
                    </h3>
                </div>
                </div>
            ))}
            {matchDetail?.lineup?.awayTeam.map((player) => (
                <div
                key={player.user.user._id}
                className="flex h-24 md:h-28 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl"
                >
                <div className="flex items-center mx-5 md:mx-10 min-w-16">
                    <div className="relative text-center content-center bg-green-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                    <p className="font-medium md:text-lg">10.0</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 min-w-0 ">
                    <h1 className="text-lg md:text-xl font-medium truncate">
                    {player.user.user.nameSurname}
                    </h1>
                    <h3 className="text-lg font-medium text-gray-300 truncate">
                    #{player.user.shirtNumber} - {player.position.abbreviation}
                    </h3>
                </div>
                </div>
            ))}
            </div>
      </div>
      
    </div>
  )
}

export default VotingForm
