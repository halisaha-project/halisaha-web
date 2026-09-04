import axios from 'axios'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  storeAuthTokens,
} from '../utils/authStorage'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!configuredBaseUrl) {
  throw new Error(
    'VITE_API_BASE_URL is required. Copy .env.example to .env and configure the backend URL.'
  )
}

const apiBaseUrl = `${configuredBaseUrl.replace(/\/+$/, '')}/api/v1`

const apiClient = axios.create({
  baseURL: apiBaseUrl,
})

const GENERIC_CLIENT_MESSAGE = 'Beklenmeyen Bir Hata Oluştu.'

const isSuccessEnvelope = (value) =>
  value !== null &&
  typeof value === 'object' &&
  typeof value.statusCode === 'number' &&
  value.success === true &&
  typeof value.timestamp === 'string' &&
  typeof value.path === 'string' &&
  value.error === null &&
  Object.prototype.hasOwnProperty.call(value, 'data')

const unwrapSuccessData = (value) =>
  isSuccessEnvelope(value) ? value.data : value

const normalizeSuccessResponse = (response) => {
  response.data = unwrapSuccessData(response.data)
  return response
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let refreshRequest = null

const refreshSession = async () => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {
    refreshToken,
  })
  const tokens = unwrapSuccessData(response.data)
  storeAuthTokens(tokens)
  return tokens.accessToken
}

apiClient.interceptors.response.use(
  normalizeSuccessResponse,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.skipAuthRefresh ||
      !getRefreshToken()
    ) {
      return Promise.reject(normalizeApiError(error))
    }

    originalRequest._retry = true

    if (!refreshRequest) {
      refreshRequest = refreshSession().finally(() => {
        refreshRequest = null
      })
    }

    try {
      const accessToken = await refreshRequest
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      clearAuthTokens()
      return Promise.reject(normalizeApiError(refreshError))
    }
  }
)

/**
 * @typedef {Object} ApiClientError
 * @property {number} statusCode
 * @property {string} type
 * @property {string} message
 * @property {string} clientMessage
 */

export const normalizeApiError = (error, fallbackMessage = 'Request failed') => {
  if (
    error &&
    typeof error === 'object' &&
    typeof error.statusCode === 'number' &&
    typeof error.type === 'string' &&
    typeof error.message === 'string' &&
    typeof error.clientMessage === 'string'
  ) {
    return error
  }

  const responseData = error?.response?.data
  const envelopeError =
    responseData?.success === false &&
    responseData.error &&
    typeof responseData.error === 'object'
      ? responseData.error
      : null

  if (envelopeError) {
    return {
      statusCode: responseData.statusCode ?? error.response?.status ?? 0,
      type: envelopeError.type || 'API_ERROR',
      message: envelopeError.message || fallbackMessage,
      clientMessage: envelopeError.clientMessage || GENERIC_CLIENT_MESSAGE,
    }
  }

  return {
    statusCode: error?.response?.status ?? 0,
    type: error?.response ? 'UNEXPECTED_ERROR' : 'NETWORK_ERROR',
    message: fallbackMessage,
    clientMessage: GENERIC_CLIENT_MESSAGE,
  }
}

export const createApiFailure = (error, fallbackMessage) => {
  const normalizedError = normalizeApiError(error, fallbackMessage)

  return {
    success: false,
    message: normalizedError.clientMessage,
    error: normalizedError,
  }
}

export { apiBaseUrl }
export default apiClient
