export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER' | 'VENDOR'
export type UserStatus = 'ACTIVE' | 'BLOCKED'

export interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  createdAt: string
  lastLogin?: string
}

export interface UserParams {
  page?: number
  limit?: number
  search?: string | null
  role?: UserRole | null
  status?: UserStatus | null
  sort?: string | null
}

export type UserTableMeta = {
  onUpdateStatus: (id: string, status: UserStatus) => void
  onUpdateRole: (id: string, role: UserRole) => void
  onDelete: (id: string) => void
  onEdit: (user: User) => void
}
