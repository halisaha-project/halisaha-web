import { useCallback, useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { FaFutbol } from 'react-icons/fa6'
import { useParams, useSearchParams } from 'react-router-dom'
import { getGroupDetail } from '../api/groupApi'
import {
  completeMatch,
  generateMatchTeams,
  getMatchDetail,
  updateMatchParticipants,
} from '../api/matchApi'
import { useAuth } from '../context/authContext'
import { formatDateAndTime } from '../utils/dateUtils'
import FootballPitch from './FootballPitch'
import MatchPlayerSelector from './MatchPlayerSelector'
import VotingForm from './VotingForm'

const fallbackError = 'Beklenmeyen Bir Hata Oluştu.'
const emptyFormation = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
const formationFields = [
  ['GK', 'Kaleci'],
  ['DEF', 'Defans'],
  ['MID', 'Orta Saha'],
  ['FWD', 'Forvet'],
]
const statusLabels = {
  draft: 'Taslak',
  ready: 'Hazır',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
}

const sameIds = (left, right) =>
  [...left].sort().join(',') === [...right].sort().join(',')

const sameFormation = (left, right) =>
  formationFields.every(([position]) => left[position] === right[position])

function MatchesInfo() {
  const [matchDetail, setMatchDetail] = useState(null)
  const [group, setGroup] = useState(null)
  const [selectedParticipantIds, setSelectedParticipantIds] = useState([])
  const [formation, setFormation] = useState(emptyFormation)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [managementError, setManagementError] = useState(null)
  const [managementSuccess, setManagementSuccess] = useState(null)
  const [squadSubmitting, setSquadSubmitting] = useState(false)
  const [completionSubmitting, setCompletionSubmitting] = useState(false)
  const [showCompletionConfirmation, setShowCompletionConfirmation] =
    useState(false)
  const { id: matchId } = useParams()
  const [searchParams] = useSearchParams()
  const groupId = searchParams.get('groupId')
  const { user } = useAuth()

  const loadDetail = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!groupId) {
      setError('Maçın takım bilgisi bulunamadı.')
      setLoading(false)
      return
    }

    try {
      const [matchResponse, groupResponse] = await Promise.all([
        getMatchDetail(groupId, matchId),
        getGroupDetail(groupId),
      ])

      if (!matchResponse.success) {
        setError(
          matchResponse.error?.clientMessage ||
            matchResponse.message ||
            fallbackError
        )
        return
      }
      if (!groupResponse.success) {
        setError(
          groupResponse.error?.clientMessage ||
            groupResponse.message ||
            fallbackError
        )
        return
      }

      const match = matchResponse.data
      setMatchDetail(match)
      setGroup(groupResponse.data)
      setSelectedParticipantIds(match.participantUserIds || [])
      setFormation(match.formation ? { ...match.formation } : emptyFormation)
    } catch (requestError) {
      setError(requestError.clientMessage || fallbackError)
    } finally {
      setLoading(false)
    }
  }, [groupId, matchId])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  const handleFormationChange = (position, value) => {
    setFormation((currentFormation) => ({
      ...currentFormation,
      [position]: value === '' ? '' : Number(value),
    }))
  }

  const persistedFormation = matchDetail?.formation || emptyFormation
  const participantsChanged = matchDetail
    ? !sameIds(matchDetail.participantUserIds, selectedParticipantIds)
    : false
  const formationChanged = matchDetail
    ? !sameFormation(persistedFormation, formation)
    : false
  const hasSquadChanges = participantsChanged || formationChanged
  const teamSize = selectedParticipantIds.length / 2
  const formationValues = Object.values(formation)
  const formationTotal = formationValues.reduce(
    (total, value) => total + (Number.isFinite(value) ? value : 0),
    0
  )

  const handleSquadSubmit = async (event) => {
    event.preventDefault()

    if (squadSubmitting || !hasSquadChanges) return

    setManagementError(null)
    setManagementSuccess(null)

    if (selectedParticipantIds.length < 2) {
      setManagementError('En az 2 oyuncu seçmelisiniz.')
      return
    }
    if (selectedParticipantIds.length % 2 !== 0) {
      setManagementError(
        'Takım oluşturmak için oyuncu sayısı çift olmalıdır.'
      )
      return
    }
    if (
      formationValues.some(
        (value) => !Number.isInteger(value) || value < 0
      )
    ) {
      setManagementError(
        'Diziliş değerleri negatif olmayan tam sayılar olmalıdır.'
      )
      return
    }
    if (formationTotal !== teamSize) {
      setManagementError(
        'Diziliş toplamı takım başına oyuncu sayısıyla eşleşmelidir.'
      )
      return
    }

    setSquadSubmitting(true)

    try {
      if (participantsChanged) {
        const participantsResponse = await updateMatchParticipants(
          groupId,
          matchId,
          selectedParticipantIds
        )

        if (!participantsResponse.success) {
          setManagementError(
            participantsResponse.error?.clientMessage ||
              participantsResponse.message ||
              fallbackError
          )
          return
        }
      }

      const generationResponse = await generateMatchTeams(
        groupId,
        matchId,
        formation
      )

      if (!generationResponse.success) {
        setManagementError(
          `Takımlar oluşturulamadı. ${
            generationResponse.error?.clientMessage ||
            generationResponse.message ||
            fallbackError
          }`
        )
        return
      }

      await loadDetail()
      setManagementSuccess('Kadro ve takımlar güncellendi.')
    } catch (requestError) {
      setManagementError(requestError.clientMessage || fallbackError)
    } finally {
      setSquadSubmitting(false)
    }
  }

  const handleCompleteMatch = async () => {
    if (completionSubmitting || matchDetail.status !== 'ready') return

    setCompletionSubmitting(true)
    setManagementError(null)
    setManagementSuccess(null)

    try {
      const response = await completeMatch(groupId, matchId)

      if (!response.success) {
        setManagementError(
          response.error?.clientMessage || response.message || fallbackError
        )
        return
      }

      setShowCompletionConfirmation(false)
      await loadDetail()
      setManagementSuccess('Maç tamamlandı.')
    } catch (requestError) {
      setManagementError(requestError.clientMessage || fallbackError)
    } finally {
      setCompletionSubmitting(false)
    }
  }

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
  const isOwner = user?.id === group?.ownerId
  const isCompleted = matchDetail.status === 'completed'
  const canManageSquad = isOwner && !isCompleted && matchDetail.status !== 'cancelled'

  const pitchView = teamsGenerated ? (
    <div className="flex flex-col items-center gap-8">
      <FootballPitch teamName="Ev Takımı" players={homePlayers} />
      <FootballPitch teamName="Deplasman Takımı" players={awayPlayers} />
    </div>
  ) : (
    <p className="rounded-xl bg-background-theme bg-cover bg-center p-6 text-center text-gray-300">
      Takımlar henüz oluşturulmadı.
    </p>
  )

  return (
    <div className="pt-8">
      <header className="px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">
              {matchDetail.name}
            </h1>
            <p className="mt-1 text-lg text-gray-300">
              {formatDateAndTime(matchDetail.scheduledAt)}
            </p>
          </div>
          <span className="rounded-full border border-gray-500 px-3 py-1 text-sm font-medium">
            {statusLabels[matchDetail.status] || matchDetail.status}
          </span>
        </div>
      </header>

      {canManageSquad && (
        <div className="grid gap-8 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:items-start">
          <section className="min-w-0 rounded-xl border border-gray-700 p-4 md:p-6">
            <form onSubmit={handleSquadSubmit} className="space-y-5">
              <MatchPlayerSelector
                members={group.members}
                selectedUserIds={selectedParticipantIds}
                onSelectionChange={setSelectedParticipantIds}
                disabled={squadSubmitting}
              />

              <fieldset className="rounded-lg border border-gray-600 p-4">
                <legend className="px-2 font-medium">Diziliş</legend>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {formationFields.map(([position, label]) => (
                    <label key={position} className="flex flex-col gap-1">
                      <span className="text-sm text-gray-300">{label}</span>
                      <input
                        className="custom-input-field text-center"
                        type="number"
                        min="0"
                        step="1"
                        value={formation[position]}
                        onChange={(event) =>
                          handleFormationChange(position, event.target.value)
                        }
                        required
                      />
                    </label>
                  ))}
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Takım başına oyuncu: {teamSize}</p>
                  <p>
                    Diziliş toplamı: {formationTotal} / {teamSize}
                  </p>
                </div>
              </fieldset>

              {managementError && (
                <p className="text-sm text-red-500">{managementError}</p>
              )}
              {managementSuccess && (
                <p className="text-sm text-green-500">{managementSuccess}</p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="submit"
                  disabled={squadSubmitting || !hasSquadChanges}
                  className="rounded-lg border border-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {squadSubmitting
                    ? 'Takımlar oluşturuluyor...'
                    : 'Kadroyu Güncelle ve Takımları Oluştur'}
                </button>

                {matchDetail.status === 'ready' && (
                  <button
                    type="button"
                    onClick={() => setShowCompletionConfirmation(true)}
                    className="rounded-lg border border-red-500 px-4 py-2 text-red-300"
                  >
                    Maçı Bitir
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-semibold">Takımlar</h2>
              <FaFutbol />
              <span>{homePlayers.length + awayPlayers.length}</span>
            </div>
            {pitchView}
          </section>
        </div>
      )}

      {!canManageSquad && (
        <section className="px-4 py-6 md:px-8">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-xl font-semibold">Takımlar</h2>
            <FaFutbol />
            <span>{homePlayers.length + awayPlayers.length}</span>
          </div>
          {pitchView}
        </section>
      )}

      {isCompleted && isOwner && (
        <p className="mx-4 mb-6 rounded-lg border border-green-700 bg-green-950/40 p-4 text-center text-green-300 md:mx-8">
          Maç Tamamlandı
        </p>
      )}

      {managementError && !canManageSquad && (
        <p className="mx-4 mb-4 text-center text-red-500 md:mx-8">
          {managementError}
        </p>
      )}
      {managementSuccess && !canManageSquad && (
        <p className="mx-4 mb-4 text-center text-green-500 md:mx-8">
          {managementSuccess}
        </p>
      )}

      {isCompleted && (
        <VotingForm match={matchDetail} groupId={groupId} />
      )}

      {showCompletionConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="complete-match-title"
            className="w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl"
          >
            <h2 id="complete-match-title" className="text-xl font-semibold">
              Bu maçı tamamlamak istediğine emin misin?
            </h2>
            <p className="mt-3 text-gray-300">
              Maç tamamlandıktan sonra oyuncular oy verebilir.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={completionSubmitting}
                onClick={() => setShowCompletionConfirmation(false)}
                className="rounded-lg border border-gray-500 px-4 py-2 disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={completionSubmitting}
                onClick={handleCompleteMatch}
                className="rounded-lg border border-red-500 px-4 py-2 text-red-300 disabled:opacity-50"
              >
                {completionSubmitting ? 'Tamamlanıyor...' : 'Maçı Bitir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchesInfo
