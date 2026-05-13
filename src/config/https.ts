/**
 * ================================================================
 * AUTH FLOW OVERVIEW
 * ================================================================
 *
 * This file implements a complete access token management system
 * using Axios interceptors.
 *
 * The authentication architecture works as follows:
 *
 * 1️⃣ Login
 * ------------------------------------------------
 * - Server returns:
 *      accessToken (short-lived)
 *      refreshToken (stored in httpOnly cookie)
 *
 * - accessToken is stored ONLY in memory (not localStorage)
 *   to reduce XSS attack risks.
 *
 *
 * 2️⃣ Sending Requests
 * ------------------------------------------------
 * Every API request goes through the Axios Request Interceptor.
 *
 * Steps:
 *   1. Check if accessToken exists.
 *   2. Check if the token will expire soon.
 *   3. If expiring soon → refresh before sending request.
 *   4. Attach Authorization header:
 *
 *      Authorization: Bearer <accessToken>
 *
 *
 * 3️⃣ Proactive Token Refresh
 * ------------------------------------------------
 * Before sending a request we check token expiration.
 *
 * If token expires within N seconds (buffer):
 *      → call /auth/refresh-token
 *      → get a new accessToken
 *      → continue the request.
 *
 * This prevents failures during:
 *   - large file uploads
 *   - long API operations
 *
 *
 * 4️⃣ Refresh Queue System
 * ------------------------------------------------
 * If multiple requests detect an expired token simultaneously:
 *
 * BAD:
 *      request1 → refresh
 *      request2 → refresh
 *      request3 → refresh
 *
 * GOOD (this implementation):
 *      request1 → refresh
 *      request2 → wait in queue
 *      request3 → wait in queue
 *
 * Once refresh finishes:
 *      → all queued requests resume with the new token.
 *
 *
 * 5️⃣ Reactive Refresh (401 Fallback)
 * ------------------------------------------------
 * If the server unexpectedly returns:
 *
 *      401 Unauthorized
 *
 * The Response Interceptor will:
 *
 *      1. Attempt to refresh the token
 *      2. Retry the original request once
 *
 *
 * 6️⃣ Logout Handling
 * ------------------------------------------------
 * If refresh token fails:
 *
 *      → clear accessToken
 *      → clear auth cookies
 *      → redirect user to login page
 *
 *
 * ================================================================
 * SECURITY DESIGN
 * ================================================================
 *
 * accessToken:
 *      stored in memory only
 *
 * refreshToken:
 *      stored in httpOnly cookie
 *
 * Benefits:
 *      ✔ prevents XSS token theft
 *      ✔ secure refresh flow
 *      ✔ automatic retry logic
 *
 *
 * ================================================================
 * SUMMARY
 * ================================================================
 *
 * Request → Check token
 *          ↓
 *      Expiring soon?
 *          ↓
 *        Refresh
 *          ↓
 *    Attach Authorization
 *          ↓
 *        Send API
 *          ↓
 *     If 401 → Retry once
 *
 * ================================================================
 */
import axios, { isAxiosError } from 'axios'
import { API_BASE_URL } from '~/constants'

/**
 * Access token stored in memory.
 */
let accessToken: string | null = null

/**
 * Indicates whether a refresh token request is currently running.
 *
 * Purpose:
 * If multiple requests detect an expired token at the same time,
 * we only want to call the refresh endpoint ONCE.
 */
let isRefreshing = false

/**
 * Queue of pending requests waiting for the refresh token process to finish.
 *
 * If a refresh is already in progress, new requests will be pushed here.
 * Once the refresh completes, all queued requests will be resolved.
 */
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without using any external library.
 *
 * JWT format:
 * header.payload.signature
 *
 * Example:
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 * .
 * eyJleHAiOjE3MDAwMDAwMDB9
 * .
 * signature
 *
 * This function extracts the payload (the middle part),
 * decodes it from base64, and parses it into JSON.
 * We mainly use it to read the `exp` (expiration time).
 */
const decodeJwt = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

/**
 * Determines whether the current access token will expire soon.
 *
 * bufferSeconds:
 * If the remaining token lifetime is less than this buffer,
 * we treat it as "expiring soon".
 *
 * Example:
 * Token expires at 10:00:00
 * Current time is 09:59:40
 * buffer = 60 seconds
 *
 * → We refresh early to avoid a 401 during long requests
 *   (like file uploads).
 */
const isTokenExpiringSoon = (bufferSeconds = 30): boolean => {
  /**
   * If we don't have an accessToken in memory,
   * but the "isLoggedIn=true" cookie exists,
   * it means the user is logged in but the page was reloaded
   * and the accessToken was lost.
   *
   * In that case we trigger a refresh.
   */
  if (!accessToken) {
    if (typeof document !== 'undefined') {
      return document.cookie.includes('isLoggedIn=true')
    }
    return false
  }

  const decoded = decodeJwt(accessToken)

  // If decoding fails or exp doesn't exist,
  // treat the token as invalid and refresh it.
  if (!decoded?.exp) return true

  /**
   * JWT exp is in seconds
   * Date.now() is in milliseconds
   * so we multiply exp by 1000.
   */
  return decoded.exp * 1000 - Date.now() < bufferSeconds * 1000
}

/**
 * Resolve or reject all pending requests in the queue.
 *
 * If refresh succeeds:
 * → resolve all queued promises with the new token.
 *
 * If refresh fails:
 * → reject them with the error.
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })

  // Clear the queue
  failedQueue = []
}

// ─────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────

/**
 * Shared Axios instance used across the application.
 *
 * withCredentials = true
 * → allows cookies to be sent with requests.
 *
 * This is required because the refresh token
 * is stored in an httpOnly cookie.
 */
export const https = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

/**
 * Store the access token in memory.
 * Typically called after a successful login.
 */
export const setAccessToken = (token: string | null) => {
  accessToken = token
}

/**
 * Retrieve the current access token.
 */
export const getAccessToken = () => accessToken

// ─────────────────────────────────────────────────────────────
// Refresh Access Token
// ─────────────────────────────────────────────────────────────

/**
 * Refresh the access token using the refresh token cookie.
 *
 * This function can be triggered by:
 * 1. Request interceptor (proactive refresh)
 * 2. Response interceptor (when a request returns 401)
 */
export const refreshAccessToken = async (): Promise<string> => {
  /**
   * If a refresh request is already in progress,
   * we don't start another one.
   *
   * Instead, we return a Promise and push the resolver
   * into the queue so it will continue once refresh completes.
   */
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    /**
     * Call the refresh token endpoint.
     * The server reads the refresh token from the httpOnly cookie.
     */
    const res = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      { withCredentials: true },
    )

    const newToken: string = res.data.result.accessToken

    // Save the new access token
    accessToken = newToken

    // Resolve all pending requests
    processQueue(null, newToken)

    return newToken
  } catch (err) {
    /**
     * If refresh fails:
     * - reject all queued requests
     * - log the user out ONLY if it's a client/auth error
     */
    processQueue(err, null)

    if (isAxiosError(err)) {
      const status = err.response?.status
      // Only logout on 401 (Unauthorized), 403 (Forbidden), or 400 (Bad Request)
      if (status && [400, 401, 403].includes(status)) {
        logout()
      }
    }

    throw err
  } finally {
    isRefreshing = false
  }
}

// ─────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────

/**
 * Logs the user out by:
 * - clearing the in-memory access token
 * - clearing auth-related cookies
 * - clearing persisted auth store from localStorage
 * - redirecting to the login page
 */
export const logout = () => {
  accessToken = null

  if (typeof document !== 'undefined') {
    document.cookie = 'isLoggedIn=; Max-Age=0; path=/;'
    document.cookie = 'userRole=; Max-Age=0; path=/;'
    localStorage.removeItem('auth')
    window.location.href = '/auth/sign-in'
  }
}

// ─────────────────────────────────────────────────────────────
// Request Interceptor
// ─────────────────────────────────────────────────────────────

/**
 * Runs before every outgoing request.
 *
 * Responsibilities:
 * 1. Check whether the token is missing or expiring soon.
 * 2. If so, refresh it before sending the request.
 * 3. Attach the Authorization header.
 *
 * This prevents requests (especially long ones)
 * from failing mid-flight due to token expiration.
 */
https.interceptors.request.use(async (config) => {
  /**
   * Skip the refresh endpoint itself
   * to avoid infinite interceptor loops.
   */
  if (config.url?.includes('/auth/refresh-token')) {
    return config
  }

  /**
   * If the token is missing or about to expire,
   * proactively refresh it before the request.
   */
  if (isTokenExpiringSoon(60)) {
    try {
      const freshToken = await refreshAccessToken()
      config.headers.Authorization = `Bearer ${freshToken}`
      return config
    } catch {
      /**
       * If refresh fails,
       * refreshAccessToken() already logged the user out.
       * Let the request fail normally.
       */
      return config
    }
  }

  /**
   * If the current token is still valid,
   * simply attach it to the Authorization header.
   */
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// ─────────────────────────────────────────────────────────────
// Response Interceptor
// ─────────────────────────────────────────────────────────────

/**
 * Handles responses and errors.
 *
 * If the server returns 401 (Unauthorized):
 * - attempt to refresh the token
 * - retry the original request once
 */
https.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    /**
     * If the request failed with 401
     * and hasn't been retried yet.
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const freshToken = await refreshAccessToken()

        // Attach the new token
        originalRequest.headers.Authorization = `Bearer ${freshToken}`

        // Retry the original request
        return https(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
