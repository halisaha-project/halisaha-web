import { useCallback, useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { IoStar, IoStarOutline } from 'react-icons/io5'
import { useParams, useSearchParams } from 'react-router-dom'
import { getMatchDetail } from '../api/matchApi'
import {
  createMatchVote,
  getMatchVoteResults,
} from '../api/voteApi'
import { useAuth } from '../context/authContext'

const fallbackError = 'Beklenmeyen Bir Hata Oluştu.'

function VotingForm({ match: providedMatch, groupId: providedGroupId }) {
  const { id: routeMatchId } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const groupId = providedGroupId || searchParams.get('groupId')
  const matchId = providedMatch?.id || routeMatchId
  const [match, setMatch] = useState(providedMatch || null)
  const [loading, setLoading] = useState(!providedMatch)
  const [error, setError] = useState(null)
  const [scores, setScores] = useState({})
  const [targetStatuses, setTargetStatuses] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState(null)
  const [results, setResults] = useState([])
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState(null)

  useEffect(() => {
    if (providedMatch) {
      setMatch(providedMatch)
      setLoading(false)
      return
    }

    const loadMatch = async () => {
      if (!groupId) {
        setError('Maçın takım bilgisi bulunamadı.')
        setLoading(false)
        return
      }

      try {
        const response = await getMatchDetail(groupId, matchId)
        if (response.success) {
          setMatch(response.data)
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

    loadMatch()
  }, [groupId, matchId, providedMatch])

  const loadResults = useCallback(async () => {
    if (!groupId || !matchId) return

    setResultsLoading(true)
    setResultsError(null)

    try {
      const response = await getMatchVoteResults(groupId, matchId)
      if (response.success) {
        setResults(Array.isArray(response.data?.results) ? response.data.results : [])
      } else {
        setResultsError(
          response.error?.clientMessage || response.message || fallbackError
        )
      }
    } catch (requestError) {
      setResultsError(requestError.clientMessage || fallbackError)
    } finally {
      setResultsLoading(false)
    }
  }, [groupId, matchId])

  useEffect(() => {
    if (match?.status === 'completed') loadResults()
  }, [loadResults, match?.status])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <CgSpinner className="animate-spin text-4xl" />
      </div>
    )
  }

  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!match || match.status !== 'completed') return null

  const participants = [
    ...(match.homeTeam?.players || []),
    ...(match.awayTeam?.players || []),
  ]
  const participantsById = new Map(
    participants.map((player) => [player.userId, player])
  )
  const isParticipant = match.participantUserIds.includes(user.id)
  const targets = participants.filter((player) => player.userId !== user.id)

  const handleScoreChange = (targetUserId, score) => {
    setScores((currentScores) => ({ ...currentScores, [targetUserId]: score }))
    setTargetStatuses((currentStatuses) => ({
      ...currentStatuses,
      [targetUserId]: undefined,
    }))
    setSubmissionMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    const pendingVotes = targets.filter(
      (player) =>
        scores[player.userId] &&
        !['submitted', 'duplicate'].includes(targetStatuses[player.userId]?.type)
    )

    if (pendingVotes.length === 0) {
      setSubmissionMessage('Göndermek için en az bir oyuncuya puan verin.')
      return
    }

    setSubmitting(true)
    setSubmissionMessage(null)

    const settledVotes = await Promise.allSettled(
      pendingVotes.map((player) =>
        createMatchVote(
          groupId,
          matchId,
          player.userId,
          scores[player.userId]
        )
      )
    )

    const nextStatuses = { ...targetStatuses }
    let successCount = 0
    let failureCount = 0

    settledVotes.forEach((settledVote, index) => {
      const targetUserId = pendingVotes[index].userId
      const response =
        settledVote.status === 'fulfilled' ? settledVote.value : null
      const normalizedError =
        response?.error ||
        (settledVote.status === 'rejected' ? settledVote.reason : null)

      if (response?.success) {
        nextStatuses[targetUserId] = {
          type: 'submitted',
          message: 'Oy gönderildi.',
        }
        successCount += 1
      } else if (normalizedError?.type === 'VOTE_ALREADY_EXISTS') {
        nextStatuses[targetUserId] = {
          type: 'duplicate',
          message: 'Bu oyuncu için daha önce oy kullandınız.',
        }
      } else {
        nextStatuses[targetUserId] = {
          type: 'error',
          message:
            normalizedError?.clientMessage ||
            response?.message ||
            fallbackError,
        }
        failureCount += 1
      }
    })

    setTargetStatuses(nextStatuses)
    setSubmissionMessage(
      failureCount > 0
        ? `${successCount} oy gönderildi, ${failureCount} oy gönderilemedi.`
        : 'Oylar gönderildi.'
    )
    setSubmitting(false)
    await loadResults()
  }

  return (
    <section className="mx-4 mb-8 rounded-xl border border-gray-700 p-4 md:mx-8 md:p-6">
      <h2 className="text-xl font-semibold">Oy Ver</h2>

      {isParticipant ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {targets.map((player) => {
            const status = targetStatuses[player.userId]
            const submitted = ['submitted', 'duplicate'].includes(status?.type)

            return (
              <div
                key={player.userId}
                className="rounded-xl bg-background-theme bg-cover bg-center p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-medium">
                      {[player.name, player.surname].filter(Boolean).join(' ') ||
                        'Oyuncu'}
                    </p>
                    <p className="text-sm text-gray-300">
                      #{player.shirtNumber ?? '-'} · {player.assignedPosition}
                    </p>
                  </div>
                  <div className="flex gap-1 text-yellow-300">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        disabled={submitted || submitting}
                        onClick={() => handleScoreChange(player.userId, score)}
                        className="text-3xl disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`${score} puan`}
                      >
                        {scores[player.userId] >= score ? (
                          <IoStar />
                        ) : (
                          <IoStarOutline />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {status && (
                  <p
                    className={`mt-2 text-sm ${
                      status.type === 'error' ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </div>
            )
          })}

          {submissionMessage && (
            <p className="text-sm text-gray-200">{submissionMessage}</p>
          )}
          <button
            type="submit"
            disabled={submitting || targets.length === 0}
            className="rounded-lg border border-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Oylar gönderiliyor...' : 'Oyları Gönder'}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-gray-300">
          Yalnızca maç katılımcıları oy verebilir.
        </p>
      )}

      <div className="mt-8 border-t border-gray-700 pt-5">
        <h3 className="text-lg font-semibold">Oy Sonuçları</h3>
        {resultsLoading ? (
          <CgSpinner className="mt-4 animate-spin text-3xl" />
        ) : resultsError ? (
          <p className="mt-3 text-sm text-red-500">{resultsError}</p>
        ) : results.length === 0 ? (
          <p className="mt-3 text-gray-300">Henüz oy sonucu yok.</p>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {results.map((result) => {
              const player = participantsById.get(result.userId)
              const fullName = player
                ? [player.name, player.surname].filter(Boolean).join(' ')
                : ''

              return (
                <div
                  key={result.userId}
                  className="rounded-lg border border-gray-700 p-3"
                >
                  <p className="font-medium">{fullName || 'Oyuncu'}</p>
                  <p className="text-sm text-gray-300">
                    Ortalama: {Number(result.averageScore).toFixed(1)} · Oy:{' '}
                    {result.voteCount}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default VotingForm
