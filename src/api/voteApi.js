import axios from 'axios'

export const vote = async (voteData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/voting/vote`,
      voteData,
      {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem('token')
            .replace(/"/g, '')}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.status === 200) {
      console.log(response.data)
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Voting error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot vote for match',
      }
    } else if (error.request) {
      console.error('Voting error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Voting error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const getVotesByMatchId = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/voting/${id}`,
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
      console.error('Votes fetching error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot get votes info',
      }
    } else if (error.request) {
      console.error('Votes fetching error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Votes fetching error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}
