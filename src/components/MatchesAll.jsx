import { useState, useEffect } from 'react'
import { formatDateAndTime } from '../utils/dateUtils'
import { CgSpinner } from 'react-icons/cg'
import real_madrid from '/real_madrid.png'
import { useNavigate } from 'react-router-dom'

function MatchesAll({ fetchDataMethod, isGroupBy }) {
  const [matchesData, setMatchesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMatchesData = async () => {
      try {
        const response = await fetchDataMethod

        if (response.success === true) {
          setMatchesData(response.data)
        } else {
          setError(
            response.error?.clientMessage ||
              response.message ||
              'Beklenmeyen Bir Hata Oluştu.'
          )
        }
      } catch (requestError) {
        setError(
          requestError.clientMessage || 'Beklenmeyen Bir Hata Oluştu.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchMatchesData()
    // The parent deliberately passes a single in-flight request for this mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="px-8">
      <div>
        {isGroupBy ? (
          <h2 className="inline-flex items-center gap-x-2 text-xl mb-4">
            Maçlar
          </h2>
        ) : (
          <h2 className="inline-flex items-center gap-x-2 text-xl md:text-2xl font-bold mb-4">
            Maçlarım
          </h2>
        )}
      </div>
      <div className="flex flex-col space-y-4">
        {matchesData.length === 0 ? (
          <div className="flex justify-center items-center h-16 bg-background-theme bg-cover bg-center rounded-xl">
            <h1 className="text-lg md:text-xl font-medium">
              Henüz bir maçın yok
            </h1>
          </div>
        ) : (
          matchesData.map((match) => (
            <div
              key={match.id}
              className="flex h-32 bg-background-theme bg-cover line-clamp-1 truncate bg-center rounded-xl cursor-pointer"
              onClick={() =>
                navigate(
                  `/matches/${match.id}?groupId=${encodeURIComponent(match.groupId)}`
                )
              }
            >
              <div className="flex items-center mx-5 md:mx-10 min-w-16">
                <img className="object-fit h-20" src={real_madrid} />
              </div>
              <div className="flex flex-col justify-center space-y-1 min-w-0 ">
                <h1 className="text-lg md:text-xl font-medium truncate">
                  {formatDateAndTime(match.scheduledAt)}
                </h1>
                <h3 className="text-lg font-medium text-gray-300 truncate">
                  {match.name}
                </h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MatchesAll
