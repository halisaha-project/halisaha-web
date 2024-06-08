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

export const joinGroup = async (
  invitationToken,
  mainPosition,
  altPosition,
  shirtNumber
) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/groups/join`,
      {
        invitationToken,
        mainPosition,
        altPosition,
        shirtNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem('token')
            .replace(/"/g, '')}`,
        },
      }
    )

    if (response.status === 201) {
      console.log(response.data)
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Join Group error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Failed to join the group',
      }
    } else if (error.request) {
      console.error('Join Group error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Join Group error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const createGroupInvitationLink = async (groupId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/groups/invite`,
      { groupId },
      {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem('token')
            .replace(/"/g, '')}`,
        },
      }
    )
    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data }
    }
  } catch (error) {
    console.log('error')
    if (error.response) {
      console.error('Invite link error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Cannot create invite link',
      }
    } else if (error.request) {
      console.error('Invite link error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Invite link error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const createGroup = async (
  groupName,
  mainPosition,
  altPosition,
  shirtNumber
) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/groups`,
      {
        groupName,
        mainPosition,
        altPosition,
        shirtNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem('token')
            .replace(/"/g, '')}`,
        },
      }
    )

    if (response.status === 201) {
      console.log(response.data)
      return { success: true, data: response.data }
    }
  } catch (error) {
    if (error.response) {
      console.error('Create Group error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Failed to create a group',
      }
    } else if (error.request) {
      console.error('Create Group error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Create Group error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}

export const deleteGroup = async (id) => {
  try {
    const response = await axios.delete(
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
      console.error('Delete Group error:', error.response.data)
      return {
        success: false,
        message: error.response.data.message || 'Failed to delete the group',
      }
    } else if (error.request) {
      console.error('Delete Group error', error.request)
      return { success: false, message: 'No response from server' }
    } else {
      console.error('Delete Group error', error.message)
      return { success: false, message: 'Request error' }
    }
  }
}
