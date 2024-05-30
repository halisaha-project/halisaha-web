import React from 'react'
import MatchesAll from '../components/MatchesAll'
import { getMatches } from '../api/matchApi'

function Matches() {
  return (
    <div className="lg:px-20 xl:px-60 py-8">
      <MatchesAll fetchDataMethod={getMatches()} isGroupBy={false} />
    </div>
  )
}

export default Matches
