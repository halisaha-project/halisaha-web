import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMatchDetail } from '../api/matchApi'
import { vote } from '../api/voteApi'
import { FaUsers } from 'react-icons/fa'
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5'

const VotingForm = () => {
  const { id } = useParams()
  const user = JSON.parse(localStorage.getItem('user'))
  const [matchDetail, setMatchDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ratings, setRatings] = useState({})
  const [validationError, setValidationError] = useState(null)
  const navigate = useNavigate()

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
    const players = [
      ...(matchDetail?.lineup?.homeTeam || []),
      ...(matchDetail?.lineup?.awayTeam || []),
    ].filter((player) => player.user.user._id !== user.sub)

    for (let player of players) {
      if (!ratings[player.user.user._id]) {
        setValidationError(`Oyuncu #${player.user.shirtNumber} oylanmadı!`)
        return
      }
    }

    try {
      const voteData = {
        matchId: id,
        votes: [
          {
            voterId: user.sub,
            votedUsers: Object.keys(ratings).map((playerId) => ({
              votedUserId: playerId,
              rating: ratings[playerId],
            })),
          },
        ],
      }

      const response = await vote(voteData)
      if (response.success) {
        navigate(`/matches/${id}`)
      } else {
        setError(response.message)
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      setError('Request error')
    }
  }

  const handleRatingChange = (playerId, rating) => {
    setRatings({
      ...ratings,
      [playerId]: rating,
    })
    setValidationError(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const players = [
    ...(matchDetail?.lineup?.homeTeam || []),
    ...(matchDetail?.lineup?.awayTeam || []),
  ].filter((player) => player.user.user._id !== user.sub)

  return (
    <div className="flex flex-col md:flex-row gap-8 space-y-4 px-2 md:px-8 mb-4">
      <div className="w-full">
        <div className="flex items-center space-x-2 text-xl">
          <h1 className="">Oyuncular</h1>
          <FaUsers />
          <p>{players.length}</p>
        </div>

        <div className="grid gap-4">
          {players.map((player) => (
            <div
              key={player.user.user._id}
              className="flex flex-col md:flex-row md:justify-between h-32 md:h-28 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl justify-center"
            >
              <div className="flex mt-3 md:m-0">
                <div className="flex items-center mx-5 md:mx-10 min-w-16">
                  <div className="relative text-center content-center bg-gray-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                    <p className="font-medium md:text-lg">
                      #{player.user.shirtNumber}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 min-w-0">
                  <h1 className="text-lg md:text-xl font-medium truncate">
                    {player.user.user.nameSurname}
                  </h1>
                  <h3 className="text-lg font-medium text-gray-300 truncate">
                    {player.position.abbreviation}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center md:w-1/2 gap-4 px-3 py-3 md:p-0">
                <div className="grid grid-cols-10 gap-2  text-yellow-300">
                  {[...Array(10)].map((_, index) => (
                    <Star
                      key={index}
                      index={index}
                      rating={ratings[player.user.user._id] || 0}
                      onClick={(rating) =>
                        handleRatingChange(player.user.user._id, rating)
                      }
                    />
                  ))}
                </div>
                <div className="flex font-bold mt-1 min-w-16 text-lg  md:text-xl">
                  <div className="w-7 flex justify-end">
                    {ratings[player.user.user._id] || 0}
                  </div>
                  <div>/ 10</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col sm:flex-row w-full justify-between">
          <div className=" ">
            {validationError && (
              <div className="text-red-500 mb-4">{validationError}</div>
            )}
          </div>
          <button
            className=" px-4 py-2 border-white border rounded-lg hover:cursor-pointer text-center"
            onClick={handleVote}
          >
            Oylamayı Gönder
          </button>
        </div>
      </div>
    </div>
  )
}

const Star = ({ index, rating, onClick }) => {
  const handleStarClick = (event) => {
    const { left, width } = event.target.getBoundingClientRect()
    const clickPosition = event.clientX - left
    const halfClicked = clickPosition < width / 2
    onClick(index + (halfClicked ? 0.5 : 1))
  }

  let starIcon
  if (rating >= index + 1) {
    starIcon = <IoStar />
  } else if (rating >= index + 0.5) {
    starIcon = <IoStarHalf />
  } else {
    starIcon = <IoStarOutline />
  }

  return (
    <div
      onClick={handleStarClick}
      className="cursor-pointer text-2xl sm:text-3xl "
    >
      {starIcon}
    </div>
  )
}

export default VotingForm
