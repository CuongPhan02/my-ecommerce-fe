'use client'

import { useEffect, useRef } from 'react'
import {
  isAuthSessionError,
  logout as clearAuthSession,
  refreshAccessToken,
  setAccessToken,
} from '~/config/https'
import { useAuthStore } from '~/store/auth-store'

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '=([^;]*)',
    ),
  )

  return match ? decodeURIComponent(match[1]) : null
}

export const useInitAuth = () => {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const isLoggedIn = getCookie('isLoggedIn')
    if (!isLoggedIn) return

    // Restore the RAM-only access token after a hard load. A confirmed auth
    // failure means the refresh token is invalid/expired, but transient
    // network/server errors should not destroy the client session.
    refreshAccessToken()
      .then((token: string) => {
        if (token) setAccessToken(token)
      })
      .catch((error: unknown) => {
        setAccessToken(null)

        if (!isAuthSessionError(error)) return

        useAuthStore.getState().logout()

        const path = window.location.pathname
        const shouldRedirect =
          path.startsWith('/dashboard') ||
          path.startsWith('/admin') ||
          path.startsWith('/profile')

        clearAuthSession(shouldRedirect)
      })
  }, [])
}
