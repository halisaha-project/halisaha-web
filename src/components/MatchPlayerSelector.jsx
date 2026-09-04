import { FaUsers } from 'react-icons/fa'

function MatchPlayerSelector({
  members,
  selectedUserIds,
  onSelectionChange,
  disabled = false,
}) {
  const handleSelection = (userId) => {
    if (disabled) return

    onSelectionChange(
      selectedUserIds.includes(userId)
        ? selectedUserIds.filter((id) => id !== userId)
        : [...selectedUserIds, userId]
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-xl">
        <h2>Oyuncular</h2>
        <FaUsers />
        <span>
          {selectedUserIds.length}/{members.length}
        </span>
      </div>

      {members.length === 0 ? (
        <p className="text-gray-300">Bu takımda henüz oyuncu yok.</p>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <button
              key={member.userId}
              type="button"
              disabled={disabled}
              onClick={() => handleSelection(member.userId)}
              className={`flex h-24 min-w-0 rounded-xl bg-background-theme bg-cover bg-center text-left disabled:cursor-not-allowed disabled:opacity-60 md:h-28 ${
                selectedUserIds.includes(member.userId)
                  ? 'border-2 border-green-500'
                  : 'border-2 border-transparent'
              }`}
            >
              <div className="mx-5 flex min-w-16 items-center md:mx-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-600 md:h-16 md:w-16">
                  <span className="font-medium md:text-lg">
                    #{member.shirtNumber ?? '-'}
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 flex-col justify-center space-y-1 pr-3">
                <span className="truncate text-lg font-medium md:text-xl">
                  {[member.name, member.surname].filter(Boolean).join(' ') ||
                    'Oyuncu'}
                </span>
                <span className="truncate text-lg font-medium text-gray-300">
                  {member.mainPosition || '-'} - {member.altPosition || '-'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MatchPlayerSelector
