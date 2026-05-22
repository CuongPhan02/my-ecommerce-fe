/**
 * ================================================================
 * AUTH FLOW OVERVIEW
 * ================================================================
 *
 * This file implements a simplified access token management system
 * using Axios interceptors.
 *
 * The authentication architecture works as follows:
 *
 * 1️⃣ Login
 * ------------------------------------------------
 * - Server returns:
 *      accessToken
 *      refreshToken
 *
 * - Both tokens are stored in localStorage for persistence.
 *
 *
 * 2️⃣ Sending Requests
 * ------------------------------------------------
 * Every API request goes through the Axios Request Interceptor.
 * It retrieves the accessToken from localStorage and attaches it
 * to the Authorization header.
 *
 *
 * 3️⃣ Reactive Refresh (401 Fallback)
 * ------------------------------------------------
 * If the server returns:
 *
 *      401 Unauthorized
 *
 * The Response Interceptor will:
 *
 *      1. Attempt to refresh the token using the refreshToken
 *      2. If successful, update localStorage and retry the original request
 *      3. If unsuccessful, log the user out
 *
 *
 * 4️⃣ Refresh Queue System
 * ------------------------------------------------
 * If multiple requests fail with 401 simultaneously:
 *      - Only one refresh request is sent.
 *      - Other requests wait in a queue and resume once refresh completes.
 *
 *
 * 5️⃣ Logout Handling
 * ------------------------------------------------
 * When logging out:
 *      → clear tokens from localStorage
 *      → clear auth cookies (isLoggedIn, userRole)
 *      → redirect to login page
 *
 * ================================================================
 */

import axios, { isAxiosError } from 'axios'
import { API_BASE_URL } from '~/constants'

/**
 * Indicates whether a refresh token request is currently running.
 */
let isRefreshing = false

/**
 * Queue of pending requests waiting for the refresh token process to finish.
 */
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Get tokens from localStorage
 */
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token')
  }
  return null
}

/**
 * Set tokens to localStorage
 */
export const setTokens = (
  accessToken?: string | null,
  refreshToken?: string | null,
) => {
  if (typeof window !== 'undefined') {
    if (accessToken === null) {
      localStorage.removeItem('access_token')
    } else if (accessToken !== undefined) {
      localStorage.setItem('access_token', accessToken)
    }

    if (refreshToken === null) {
      localStorage.removeItem('refresh_token')
    } else if (refreshToken !== undefined) {
      localStorage.setItem('refresh_token', refreshToken)
    }
  }
}

/**
 * Resolve or reject all pending requests in the queue.
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })

  failedQueue = []
}

// ─────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────

export const https = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export const isAuthSessionError = (err: unknown): boolean => {
  if (!isAxiosError(err)) return false
  const status = err.response?.status
  return Boolean(status && [401, 403].includes(status))
}

// ─────────────────────────────────────────────────────────────
// Refresh Access Token
// ─────────────────────────────────────────────────────────────

export const refreshAccessToken = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const res = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken },
      { withCredentials: true },
    )

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.result

    setTokens(newAccessToken, newRefreshToken)

    processQueue(null, newAccessToken)
    return newAccessToken
  } catch (err) {
    processQueue(err, null)
    logout()
    throw err
  } finally {
    isRefreshing = false
  }
}

// ─────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────

export const logout = (shouldRedirect: boolean = true) => {
  setTokens(null, null)

  if (typeof document !== 'undefined') {
    document.cookie = 'isLoggedIn=; Max-Age=0; path=/;'
    document.cookie = 'userRole=; Max-Age=0; path=/;'
    localStorage.removeItem('auth')
    if (shouldRedirect) {
      window.location.href = '/auth/sign-in'
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Request Interceptor
// ─────────────────────────────────────────────────────────────

https.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/refresh-token')) {
    return config
  }

  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ─────────────────────────────────────────────────────────────
// Response Interceptor
// ─────────────────────────────────────────────────────────────

https.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const freshToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${freshToken}`
        return https(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

