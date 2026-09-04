import apiClient, { createApiFailure } from './client'

export const getGroups = async () => {
  try {
    const response = await apiClient.get('/groups')

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get groups info')
  }
}

export const getGroupDetail = async (id) => {
  try {
    const response = await apiClient.get(`/groups/${id}`)

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get groups info')
  }
}

export const joinGroup = async (
  token,
  mainPosition,
  altPosition,
  shirtNumber
) => {
  try {
    const response = await apiClient.post('/groups/invitations/accept', {
      token: token.trim(),
      mainPosition,
      altPosition,
      shirtNumber: Number(shirtNumber),
    })

    if (response.status === 201) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Failed to join the group')
  }
}

export const createGroupInvitation = async (groupId, email) => {
  try {
    const response = await apiClient.post(`/groups/${groupId}/invitations`, {
      email: email.trim(),
    })

    if (response.status === 201) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot create invitation')
  }
}

export const createGroup = async (
  groupName,
  mainPosition,
  altPosition,
  shirtNumber
) => {
  try {
    const response = await apiClient.post('/groups', {
      groupName: groupName.trim(),
      mainPosition,
      altPosition,
      shirtNumber: Number(shirtNumber),
    })

    if (response.status === 201) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Failed to create a group')
  }
}

export const deleteGroup = async (id) => {
  try {
    const response = await apiClient.delete(`/groups/${id}`)

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Failed to delete the group')
  }
}
