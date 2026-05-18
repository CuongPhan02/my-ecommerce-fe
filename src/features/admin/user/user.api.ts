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
    let filtered = [...mockUsers]

    // Apply search filter
    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      )
    }

    // Apply role filter
    if (params.role) {
      filtered = filtered.filter(u => u.role === params.role)
    }

    // Apply status filter
    if (params.status) {
      filtered = filtered.filter(u => u.status === params.status)
    }

    // Apply sorting
    if (params.sort) {
      if (params.sort === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (params.sort === 'oldest') {
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      } else if (params.sort === 'name-asc') {
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName))
      } else if (params.sort === 'name-desc') {
        filtered.sort((a, b) => b.fullName.localeCompare(a.fullName))
      }
    }

    const page = params.page || 1
    const limit = params.limit || 10
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginated = filtered.slice(startIndex, startIndex + limit)

    return {
      result: {
        data: paginated,
        meta: {
          total,
          page,
          limit,
          totalPages
        }
      }
    } as any
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    const user = mockUsers.find(u => u.id === id)
    if (user) user.status = status
    return { result: { id, status } } as any
  },

  updateUserRole: async (id: string, role: UserRole) => {
    const user = mockUsers.find(u => u.id === id)
    if (user) user.role = role
    return { result: { id, role } } as any
  },

  deleteUser: async (id: string) => {
    const index = mockUsers.findIndex(u => u.id === id)
    if (index !== -1) mockUsers.splice(index, 1)
    return { result: null } as any
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    mockUsers.unshift(newUser)
    return { result: newUser } as any
  },

  updateUser: async (userData: User) => {
    const index = mockUsers.findIndex(u => u.id === userData.id)
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData }
    }
    return { result: userData } as any
  },
}

