'use client'

import { useEffect, useRef } from 'react'
import { setAccessToken, refreshAccessToken } from '~/config/https'

/**
 * Reads a cookie value by name.
 */
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * useInitAuth
 *
 * Call this once at the top of the app (e.g. inside a Client Component
 * that wraps the whole layout). It silently exchanges the httpOnly refresh-
 * token cookie for a fresh access token on every hard page load / tab
 * restore — but only when the user is actually logged in (cookie `isLoggedIn`
 * is set). This eliminates the extra round-trip that used to happen when the
 * first protected API call returned 401.
 */
export const useInitAuth = () => {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const isLoggedIn = getCookie('isLoggedIn')
    if (!isLoggedIn) return

    // Silent refresh — failures are intentionally swallowed here so we don't
    // show errors on public pages when there's simply no session yet.
    refreshAccessToken()
      .then((token: string) => {
        if (token) setAccessToken(token)
      })
      .catch(() => {
        // Refresh token expired or invalid – clear the stale login cookie so
        // the proactive check in https.ts doesn't keep attempting refreshes.
        document.cookie = 'isLoggedIn=; Max-Age=0; path=/;'
        document.cookie = 'userRole=; Max-Age=0; path=/;'
      })
  }, [])
}
