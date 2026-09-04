import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { FaFutbol } from 'react-icons/fa6'
import { useParams, useSearchParams } from 'react-router-dom'
import { getMatchDetail } from '../api/matchApi'
import { formatDateAndTime } from '../utils/dateUtils'
import FootballPitch from './FootballPitch'

const fallbackError = 'Beklenmeyen Bir Hata Oluştu.'

function MatchesInfo() {
  const [matchDetail, setMatchDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id: matchId } = useParams()
  const [searchParams] = useSearchParams()
  const groupId = searchParams.get('groupId')

  useEffect(() => {
    const fetchMatchDetail = async () => {
      setLoading(true)
      setError(null)

      if (!groupId) {
        setError('Maçın takım bilgisi bulunamadı.')
        setLoading(false)
        return
      }

      try {
        const response = await getMatchDetail(groupId, matchId)

        if (response.success) {
          setMatchDetail(response.data)
        } else {
          setError(
            response.error?.clientMessage || response.message || fallbackError
          )
        }
      } catch (requestError) {
        setError(requestError.clientMessage || fallbackError)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchDetail()
  }, [groupId, matchId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CgSpinner className="animate-spin text-5xl" />
      </div>
    )
  }

  if (error) {
    return <p className="mt-4 text-center text-red-500">Hata: {error}</p>
  }

  const homePlayers = Array.isArray(matchDetail?.homeTeam?.players)
    ? matchDetail.homeTeam.players
    : []
  const awayPlayers = Array.isArray(matchDetail?.awayTeam?.players)
    ? matchDetail.awayTeam.players
    : []
  const teamsGenerated = homePlayers.length > 0 || awayPlayers.length > 0

  return (
    <div className="pt-8">
      <header className="px-4 md:px-8">
        <h1 className="text-xl font-semibold md:text-2xl">
          {matchDetail.name}
        </h1>
        <p className="mt-1 text-lg text-gray-300">
          {formatDateAndTime(matchDetail.scheduledAt)}
        </p>
      </header>

      <div className="px-4 py-6 md:px-8">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg">Oyuncular</h2>
          <FaFutbol />
          <span>{homePlayers.length + awayPlayers.length}</span>
        </div>

        {teamsGenerated ? (
          <div className="grid justify-items-center gap-8 lg:grid-cols-2 lg:items-start">
            <FootballPitch teamName="Ev Sahibi" players={homePlayers} />
            <FootballPitch teamName="Deplasman" players={awayPlayers} />
          </div>
        ) : (
          <p className="rounded-xl bg-background-theme bg-cover bg-center p-6 text-center text-gray-300">
            Takımlar henüz oluşturulmadı.
          </p>
        )}
      </div>
    </div>
  )
}

export default MatchesInfo
