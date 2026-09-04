import apiClient, { createApiFailure } from '../api/client'

export const register = async (nameSurname, username, email, password) => {
  try {
    const response = await apiClient.post('/auth/register', {
      nameSurname,
      username,
      email,
      password,
    });

    if (response.status === 201) {
      const token = response.data.data;
      localStorage.setItem('registerToken', JSON.stringify(token));
      return { success: true, message: 'Registration successful', token };
    }
  } catch (error) {
    return createApiFailure(error, 'Registration failed');
  }
};

export const confirmMail = async (verificationCode) => {
  try {
    const token = JSON.parse(localStorage.getItem('registerToken'));

    const response = await apiClient.post('/auth/confirmMail', {
      token,
      verificationCode,
    });

    if (response.status === 200) {
      localStorage.removeItem('registerToken');
      return { success: true, message: 'Email verification successful' };
    }
  } catch (error) {
    return createApiFailure(error, 'Email verification failed');
  }
};
