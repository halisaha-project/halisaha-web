import axios from 'axios'

export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return token !== null
}

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      {
        email,
        password,
      }
    )

    if (response.status === 200) {
      localStorage.setItem('token', JSON.stringify(response.data.data))
      return { success: true, message: 'Başarılı' }
    }
  } catch (error) {
    if (error.response) {
      console.error('Login error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Login failed',
      }
    } else if (error.request) {
      console.error('Login error:', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Login error:', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const logout = () => {
  localStorage.removeItem('token')
}
