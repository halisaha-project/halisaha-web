import apiClient, { createApiFailure } from './client'

export const createMatchVote = async (
  groupId,
  matchId,
  targetUserId,
  score
) => {
  try {
    const response = await apiClient.post(
      `/groups/${groupId}/matches/${matchId}/votes`,
      { targetUserId, score }
    )

    if (response.status === 201) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot create match vote')
  }
}

export const getMatchVotes = async (groupId, matchId) => {
  try {
    const response = await apiClient.get(
      `/groups/${groupId}/matches/${matchId}/votes`
    )

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get match votes')
  }
}

export const getMatchVoteResults = async (groupId, matchId) => {
  try {
    const response = await apiClient.get(
      `/groups/${groupId}/matches/${matchId}/votes/results`
    )

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get match vote results')
  }
}
