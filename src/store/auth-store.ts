import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: any
  login: (user: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData: any) => {
        const { accessToken, refreshToken, ...user } = userData
        set({ isAuthenticated: true, user })
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth',
    },
  ),
)
