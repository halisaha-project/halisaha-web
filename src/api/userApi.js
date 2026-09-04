import apiClient, { createApiFailure, normalizeApiError } from './client'

export const getProfileInfo = async () => {
  try {
    const response = await apiClient.get('/users/profile')

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot get profile info')
  }
}

export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/users/change-password', passwordData)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: 'Failed to change password',
      error: normalizeApiError(error, 'Failed to change password'),
    }
  }
}
