import axios from 'axios'
import { API_BASE_URL } from '~/constants'

let accessToken: string | null = null
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const https = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const getAccessToken = () => accessToken

// Funtion logout (Remove token RAM + Flag Cookie + Redirect)
export const logout = () => {
  accessToken = null

  document.cookie = 'isLoggedIn=; Max-Age=0; path=/;'

  document.cookie = 'userRole=; Max-Age=0; path=/;'

  window.location.href = '/auth/sign-in'
}

https.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

https.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, push request to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return https(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await https.post('/auth/refresh-token')
        const newAccessToken = res.data.result.accessToken

        accessToken = newAccessToken
        isRefreshing = false

        // Process queue with new token
        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return https(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        processQueue(refreshError, null)
        // Call logout function here
        logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
