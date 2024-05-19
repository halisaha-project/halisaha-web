import axios from 'axios'

export const getGroups = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/groups`,
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
      console.error('Group error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot get groups info',
      }
    } else if (error.request) {
      console.error('Group error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Group error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const getGroupDetail = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/groups/${id}`,
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
      console.error('Group error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot get groups info',
      }
    } else if (error.request) {
      console.error('Group error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Group error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}
