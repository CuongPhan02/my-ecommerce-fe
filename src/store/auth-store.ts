import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setTokens } from '~/config/https'

interface AuthState {
  isAuthenticated: boolean
  user: any
  login: (user: any, accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user: any, accessToken: string, refreshToken: string) => {
        setTokens(accessToken, refreshToken)
        const role = user.role
        if (typeof document !== 'undefined') {
          document.cookie = `isLoggedIn=true; path=/; max-age=31536000`
          document.cookie = `userRole=${role}; path=/; max-age=31536000`
        }
        set({ isAuthenticated: true, user })
      },
      logout: () => {
        setTokens(null, null)
        if (typeof document !== 'undefined') {
          document.cookie = 'isLoggedIn=; Max-Age=0; path=/;'
          document.cookie = 'userRole=; Max-Age=0; path=/;'
        }
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: 'auth',
    },
  ),
)

