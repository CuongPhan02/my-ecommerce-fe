import { User, UserParams, UserRole, UserStatus } from './types'
import { mockUsers } from './user.mock'

export type UserListResponse = {
  data: User[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const _userApi = {
  fetchUsers: async (params: UserParams) => {
    // Mock data for development
    return {
      result: {
        data: mockUsers,
        meta: {
          total: mockUsers.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      }
    } as any
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    return { result: { id, status } } as any
  },

  updateUserRole: async (id: string, role: UserRole) => {
    return { result: { id, role } } as any
  },

  deleteUser: async (id: string) => {
    return { result: null } as any
  },
}
