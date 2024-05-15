import axios from 'axios'

export const getProfileInfo = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem('token')
            .replace(/"/g, '')}`,
        },
      }
    )

    if (response.status === 200) {
      console.log(response.data)
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Profile error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot get profile info',
      }
    } else if (error.request) {
      console.error('Profile error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Profile error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}
