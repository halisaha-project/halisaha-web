import apiClient, { createApiFailure } from './client'

export const vote = async (voteData) => {
  try {
    const response = await apiClient.post('/voting/vote', voteData)

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot vote for match')
  }
}

export const getVotesByMatchId = async (id) => {
  try {
    const response = await apiClient.get(`/voting/${id}`)

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get votes info')
  }
}
