/* eslint-disable @typescript-eslint/no-explicit-any */
import { https } from '~/config/https'
import { ApiResponse } from '~/@types/api'
import { User, UserParams, UserRole, UserStatus } from './types'

export type UserListResponse = {
  data: User[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const mapServerToClient = (u: any): User => ({
  id: u.id,
  fullName: u.name || '',
  email: u.email || '',
  phone: u.phone || '',
  role: u.role || 'CUSTOMER',
  status: u.isActive ? 'ACTIVE' : 'BLOCKED',
  createdAt: u.createdAt || new Date().toISOString(),
  lastLogin: u.lastLogin || undefined,
  staffCode: u.staffCode || null,
})

export const _userApi = {
  fetchUsers: async (params: UserParams) => {
    const response = await https.get<ApiResponse<any>>('/users', {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        role: params.role || undefined,
        status: params.status === 'ACTIVE' ? 'ACTIVE' : params.status === 'BLOCKED' ? 'INACTIVE' : undefined,
        sort: params.sort || undefined,
        sortBy: params.sortBy || undefined,
        isSystem: params.isSystem ?? undefined,
      },
    })

    const resData = response.data
    const serverResult = resData.result

    let items: any[] = []
    let total = 0
    let page = params.page || 1
    let limit = params.limit || 10
    let totalPages = 1

    if (serverResult) {
      if (Array.isArray(serverResult)) {
        items = serverResult
        total = serverResult.length
      } else if (Array.isArray(serverResult.items)) {
        items = serverResult.items
        const meta = serverResult.meta || {}
        total = meta.total ?? serverResult.total ?? serverResult.items.length
        page = meta.page ?? serverResult.page ?? page
        limit = meta.limit ?? serverResult.limit ?? limit
        totalPages = meta.totalPages ?? serverResult.totalPages ?? Math.ceil(total / limit)
      } else if (Array.isArray(serverResult.data)) {
        items = serverResult.data
        const meta = serverResult.meta || {}
        total = meta.total ?? serverResult.total ?? serverResult.data.length
        page = meta.page ?? serverResult.page ?? page
        limit = meta.limit ?? serverResult.limit ?? limit
        totalPages = meta.totalPages ?? serverResult.totalPages ?? Math.ceil(total / limit)
      }
    }

    return {
      result: {
        data: items.map(mapServerToClient),
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      },
    } as any
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    // 1. Get current details from the server first
    const userRes = await https.get<ApiResponse<any>>(`/users/${id}`)
    const currentUser = userRes.data.result

    // 2. Perform the update
    const response = await https.put<ApiResponse<any>>(`/users/${id}`, {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      role: currentUser.role,
      isActive: status === 'ACTIVE',
    })
    return response.data
  },

  updateUserRole: async (id: string, role: UserRole) => {
    // 1. Get current details from the server first
    const userRes = await https.get<ApiResponse<any>>(`/users/${id}`)
    const currentUser = userRes.data.result

    // 2. Perform the update
    const response = await https.put<ApiResponse<any>>(`/users/${id}`, {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      role: role,
      isActive: currentUser.isActive,
    })
    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await https.delete<ApiResponse<any>>(`/users/${id}`)
    return response.data
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { password?: string }) => {
    const response = await https.post<ApiResponse<any>>('/users', {
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      isActive: userData.status === 'ACTIVE',
      password: userData.password || '',
    })
    return response.data
  },

  updateUser: async (userData: User) => {
    const response = await https.put<ApiResponse<any>>(`/users/${userData.id}`, {
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      isActive: userData.status === 'ACTIVE',
    })
    return response.data
  },

  bulkDeleteUsers: async (ids: string[]) => {
    const response = await https.post<ApiResponse<any>>('/users/bulk-delete', { ids })
    return response.data
  },
}
