import apiClient, { createApiFailure } from './client'

export const sendOtp = async (email) => {
  try {
    const response = await apiClient.post('/otp/send-otp', { email })

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot send OTP')
  }
}

export const verifyOtp = async (email, otp) => {
  try {
    const response = await apiClient.post('/otp/verify-otp', { email, otp })

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot verify OTP')
  }
}

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await apiClient.post('/otp/reset-password', {
      email,
      newPassword,
    })

    if (response.status === 200) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    return createApiFailure(error, 'Cannot reset password')
  }
}
