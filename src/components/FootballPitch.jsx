const POSITION_ROWS = ['FWD', 'MID', 'DEF', 'GK']

function FootballPitch({ teamName, players = [] }) {
  const playersByPosition = POSITION_ROWS.reduce(
    (rows, position) => ({
      ...rows,
      [position]: players.filter(
        (player) => player.assignedPosition === position
      ),
    }),
    {}
  )

  return (
    <section className="w-full max-w-[420px]">
      <h2 className="mb-3 text-center text-xl font-semibold">{teamName}</h2>
      <div className="aspect-[18/25] w-full bg-green-soccer-field-theme bg-cover bg-center bg-no-repeat">
        {players.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <span className="rounded bg-black/60 px-3 py-2 text-sm">
              Takımda oyuncu yok.
            </span>
          </div>
        ) : (
          <div className="grid h-full grid-rows-4 px-2 pb-[8%] pt-[18%] sm:px-4">
            {POSITION_ROWS.map((position) => (
              <div
                key={position}
                className="flex min-w-0 items-center justify-around gap-1"
              >
                {playersByPosition[position].map((player) => {
                  const fullName = [player.name, player.surname]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <div
                      key={player.userId}
                      className="flex min-w-0 max-w-[88px] flex-1 flex-col items-center text-center"
                      title={fullName || undefined}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-gray-300 bg-gray-700 text-sm font-semibold shadow-md sm:h-12 sm:w-12 sm:text-base">
                        {player.shirtNumber ?? '-'}
                      </div>
                      <span className="mt-1 w-full truncate rounded bg-black/60 px-1 text-[10px] font-medium leading-4 sm:text-xs">
                        {fullName || 'Oyuncu'}
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FootballPitch
