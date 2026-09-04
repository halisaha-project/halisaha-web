import apiClient, { createApiFailure } from './client'

const noRefresh = { skipAuthRefresh: true }

export const loginUser = async (identifier, password) => {
  const response = await apiClient.post(
    '/auth/login',
    { identifier, password },
    noRefresh
  )
  return response.data
}

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData, noRefresh)
    return { success: true, data: response.data }
  } catch (error) {
    return createApiFailure(error, 'Registration failed')
  }
}

export const logoutSession = async (refreshToken) => {
  await apiClient.post('/auth/logout', { refreshToken }, noRefresh)
}

export const getCurrentUser = async () => {
  const response = await apiClient.get('/users/me')
  return response.data
}

export const verifyEmail = async (token) => {
  try {
    const response = await apiClient.post(
      '/auth/email-verification/verify',
      { token },
      noRefresh
    )
    return { success: true, data: response.data }
  } catch (error) {
    return createApiFailure(error, 'Email verification failed')
  }
}

export const resendEmailVerification = async (email) => {
  try {
    const response = await apiClient.post(
      '/auth/email-verification/resend',
      { email },
      noRefresh
    )
    return { success: true, data: response.data }
  } catch (error) {
    return createApiFailure(error, 'Verification request failed')
  }
}

export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post(
      '/auth/password-reset/request',
      { email },
      noRefresh
    )
    return { success: true, data: response.data }
  } catch (error) {
    return createApiFailure(error, 'Password reset request failed')
  }
}

export const completePasswordReset = async (token, newPassword) => {
  try {
    const response = await apiClient.post(
      '/auth/password-reset/complete',
      { token, newPassword },
      noRefresh
    )
    return { success: true, data: response.data }
  } catch (error) {
    return createApiFailure(error, 'Password reset failed')
  }
}
