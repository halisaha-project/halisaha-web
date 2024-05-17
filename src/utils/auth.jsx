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

export const register = async (nameSurname, username, email, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
      {
        nameSurname,
        username,
        email,
        password,
      }
    );

    if (response.status === 201) {
      const token = response.data.data;
      localStorage.setItem('registerToken', JSON.stringify(token));
      return { success: true, message: 'Registration successful', token };
    }
  } catch (error) {
    if (error.response) {
      console.error('Register error:', error.response.data);
      return {
        success: false,
        message: error.response.data.message || 'Registration failed',
      };
    } else if (error.request) {
      console.error('Register error:', error.request);
      return { success: false, message: 'No response from server' };
    } else {
      console.error('Register error:', error.message);
      return { success: false, message: 'Request error' };
    }
  }
};

export const confirmMail = async (verificationCode) => {
  try {
    const token = JSON.parse(localStorage.getItem('registerToken'));

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/confirmMail`,
      {
        token,
        verificationCode,
      }
    );

    if (response.status === 200) {
      localStorage.removeItem('registerToken');
      return { success: true, message: 'Email verification successful' };
    }
  } catch (error) {
    if (error.response) {
      console.error('Confirm mail error:', error.response.data);
      return {
        success: false,
        message: error.response.data.message || 'Email verification failed',
      };
    } else if (error.request) {
      console.error('Confirm mail error:', error.request);
      return { success: false, message: 'No response from server' };
    } else {
      console.error('Confirm mail error:', error.message);
      return { success: false, message: 'Request error' };
    }
  }
};
