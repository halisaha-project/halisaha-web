import axios from 'axios'

export const getMatches = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/matches/byUser`,
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
      console.error('Match error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot get matches info',
      }
    } else if (error.request) {
      console.error('Match error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Match error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const getMatchesByGroupId = async (groupId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/matches/byGroup/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem('token')
            .replace(/"/g, '')}`,
        },
      }
    )

    if (response.status === 200) {
      console.log(response.data, 'DSFASFSAFDASDF')
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Match error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot get matches info',
      }
    } else if (error.request) {
      console.error('Match error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Match error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const getMatchDetail = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/matches/${id}`,
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
      console.error('Match error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot get matches info',
      }
    } else if (error.request) {
      console.error('Match error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Match error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}
