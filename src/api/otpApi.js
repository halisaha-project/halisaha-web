import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/send-otp`, { email })

    if (response.status === 200) {
      console.log(response.data)
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Send OTP error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot send OTP',
      }
    } else if (error.request) {
      console.error('Send OTP error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Send OTP error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/verify-otp`, {
      email,
      otp,
    })

    if (response.status === 200) {
      console.log(response.data)
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Verify OTP error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot verify OTP',
      }
    } else if (error.request) {
      console.error('Verify OTP error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Verify OTP error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/reset-password`, {
      email,
      newPassword,
    })

    if (response.status === 200) {
      console.log(response.data)
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Reset password error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot reset password',
      }
    } else if (error.request) {
      console.error('Reset password error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Reset password error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}
