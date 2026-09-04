import apiClient, { createApiFailure } from './client'

export const getMatches = async () => {
  try {
    const response = await apiClient.get('/matches/me')

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get matches info')
  }
}

export const getMatchesByGroupId = async (groupId) => {
  try {
    const response = await apiClient.get(`/groups/${groupId}/matches`)

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get matches info')
  }
}

export const getMatchDetail = async (groupId, matchId) => {
  try {
    const response = await apiClient.get(
      `/groups/${groupId}/matches/${matchId}`
    )

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get matches info')
  }
}

export const createMatch = async (groupId, matchData) => {
  try {
    const response = await apiClient.post(
      `/groups/${groupId}/matches`,
      matchData
    )

    if (response.status === 201) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot create match')
  }
}

export const updateMatchParticipants = async (
  groupId,
  matchId,
  participantUserIds
) => {
  try {
    const response = await apiClient.put(
      `/groups/${groupId}/matches/${matchId}/participants`,
      { participantUserIds }
    )

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot update match participants')
  }
}

export const generateMatchTeams = async (groupId, matchId, formation) => {
  try {
    const response = await apiClient.post(
      `/groups/${groupId}/matches/${matchId}/generate-teams`,
      { formation }
    )

    if (response.status === 201) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot generate match teams')
  }
}

export const completeMatch = async (groupId, matchId) => {
  try {
    const response = await apiClient.patch(
      `/groups/${groupId}/matches/${matchId}/status`,
      { status: 'completed' }
    )

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot complete match')
  }
}
