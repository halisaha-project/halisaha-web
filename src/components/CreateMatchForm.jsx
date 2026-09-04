import { useEffect, useState } from 'react'
import { getGroupDetail } from '../api/groupApi'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa'
import {
  createMatch,
  generateMatchTeams,
  updateMatchParticipants,
} from '../api/matchApi'

const fallbackError = 'Beklenmeyen Bir Hata Oluştu.'
const emptyFormation = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
const formationFields = [
  ['GK', 'Kaleci'],
  ['DEF', 'Defans'],
  ['MID', 'Orta Saha'],
  ['FWD', 'Forvet'],
]

function CreateMatchForm() {
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeMembers, setActiveMembers] = useState([])
  const [name, setName] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [formation, setFormation] = useState(emptyFormation)
  const [loadError, setLoadError] = useState(null)
  const [formError, setFormError] = useState(null)
  const navigate = useNavigate()
  const { id: groupId } = useParams()

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true)
      setLoadError(null)

      try {
        const response = await getGroupDetail(groupId)
        if (response.success) {
          setGroup(response.data)
        } else {
          setLoadError(
            response.error?.clientMessage || response.message || fallbackError
          )
        }
      } catch (requestError) {
        setLoadError(requestError.clientMessage || fallbackError)
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [groupId])

  const handleMemberClick = (userId) => {
    setActiveMembers((currentMembers) =>
      currentMembers.includes(userId)
        ? currentMembers.filter((memberId) => memberId !== userId)
        : [...currentMembers, userId]
    )
  }

  const handleFormationChange = (position, value) => {
    setFormation((currentFormation) => ({
      ...currentFormation,
      [position]: value === '' ? '' : Number(value),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (submitting) {
      return
    }

    setFormError(null)

    if (!name.trim()) {
      setFormError('Maç adı boş bırakılamaz.')
      return
    }
    if (!scheduledAt) {
      setFormError('Maç tarihi boş bırakılamaz.')
      return
    }
    if (activeMembers.length < 2) {
      setFormError('En az 2 oyuncu seçmelisiniz.')
      return
    }
    if (activeMembers.length % 2 !== 0) {
      setFormError('Takım oluşturmak için oyuncu sayısı çift olmalıdır.')
      return
    }

    const formationValues = Object.values(formation)
    if (
      formationValues.some(
        (value) => !Number.isInteger(value) || value < 0
      )
    ) {
      setFormError(
        'Diziliş değerleri negatif olmayan tam sayılar olmalıdır.'
      )
      return
    }

    const teamSize = activeMembers.length / 2
    const formationTotal = formationValues.reduce(
      (total, value) => total + value,
      0
    )
    if (formationTotal !== teamSize) {
      setFormError(
        'Diziliş toplamı takım başına oyuncu sayısıyla eşleşmelidir.'
      )
      return
    }

    setSubmitting(true)
    let createdMatch = null
    let participantsAssigned = false

    try {
      const createResponse = await createMatch(groupId, {
        name: name.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
      })

      if (!createResponse.success) {
        setFormError(
          createResponse.error?.clientMessage ||
            createResponse.message ||
            fallbackError
        )
        return
      }

      createdMatch = createResponse.data
      const participantsResponse = await updateMatchParticipants(
        groupId,
        createdMatch.id,
        activeMembers
      )

      if (!participantsResponse.success) {
        const participantError =
          participantsResponse.error?.clientMessage ||
          participantsResponse.message
        setFormError(
          `Maç oluşturuldu ancak oyuncular eklenemedi.${
            participantError ? ` ${participantError}` : ''
          }`
        )
        return
      }
      participantsAssigned = true

      const generationResponse = await generateMatchTeams(
        groupId,
        createdMatch.id,
        formation
      )

      if (!generationResponse.success) {
        const generationError =
          generationResponse.error?.clientMessage ||
          generationResponse.message
        setFormError(
          `Maç oluşturuldu ancak takımlar oluşturulamadı.${
            generationError ? ` ${generationError}` : ''
          }`
        )
        return
      }

      setName('')
      setScheduledAt('')
      setActiveMembers([])
      setFormation(emptyFormation)
      navigate(
        `/matches/${createdMatch.id}?groupId=${encodeURIComponent(groupId)}`
      )
    } catch (requestError) {
      setFormError(
        participantsAssigned
          ? `Maç oluşturuldu ancak takımlar oluşturulamadı. ${
              requestError.clientMessage || fallbackError
            }`
          : createdMatch
            ? `Maç oluşturuldu ancak oyuncular eklenemedi. ${
                requestError.clientMessage || fallbackError
              }`
            : requestError.clientMessage || fallbackError
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <CgSpinner className="animate-spin text-5xl" />
      </div>
    )
  }
  if (loadError) {
    return <p className="text-center mt-4 text-red-500">Hata: {loadError}</p>
  }

  const teamSize = activeMembers.length / 2
  const formationTotal = Object.values(formation).reduce(
    (total, value) => total + (Number.isFinite(value) ? value : 0),
    0
  )

  return (
    <div className="flex flex-col md:flex-row gap-8 space-y-4 px-2 md:px-8 mb-4">
      <div className="w-full md:w-1/2">
        <div className="flex items-center space-x-2 text-xl">
          <h1>Oyuncular</h1>
          <FaUsers />
          <p>
            {activeMembers.length}/{group.members.length}
          </p>
        </div>

        {group.members.length === 0 ? (
          <p className="mt-4 text-gray-300">Bu takımda henüz oyuncu yok.</p>
        ) : (
          <div className="grid gap-4">
            {group.members.map((member) => (
              <div
                key={member.userId}
                onClick={() => handleMemberClick(member.userId)}
                className={`flex h-24 md:h-28 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer ${
                  activeMembers.includes(member.userId)
                    ? 'border-2 border-green-500'
                    : ''
                }`}
              >
                <div className="flex items-center mx-5 md:mx-10 min-w-16">
                  <div className="relative text-center content-center bg-gray-600 h-14 w-14 md:h-16 md:w-16 rounded-full">
                    <p className="font-medium md:text-lg">
                      #{member.shirtNumber ?? '-'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-1 min-w-0">
                  <h1 className="text-lg md:text-xl font-medium truncate">
                    {[member.name, member.surname].filter(Boolean).join(' ') ||
                      'Oyuncu'}
                  </h1>
                  <h3 className="text-lg font-medium text-gray-300 truncate">
                    {member.mainPosition || '-'} - {member.altPosition || '-'}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label htmlFor="match-name">Maç Adı</label>
              <input
                id="match-name"
                className="custom-input-field"
                value={name}
                type="text"
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="scheduled-at">Tarih</label>
              <input
                id="scheduled-at"
                className="custom-input-field"
                value={scheduledAt}
                type="datetime-local"
                onChange={(event) => setScheduledAt(event.target.value)}
                required
              />
            </div>

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

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <button
              type="submit"
              className="px-4 py-2 border-white border rounded-lg hover:cursor-pointer text-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting || group.members.length < 2}
            >
              {submitting ? 'Oluşturuluyor...' : 'Maç Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatchForm
