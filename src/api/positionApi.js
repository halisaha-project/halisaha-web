import apiClient, { createApiFailure } from './client'

export const getPositions = async () => {
  try {
    const response = await apiClient.get('/positions')
    return { success: true, data: response.data }
  } catch (error) {
    return createApiFailure(error, 'Cannot get positions')
  }
}
