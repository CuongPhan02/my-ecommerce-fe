export type UserRole =
  | 'CUSTOMER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'STAFF'
  | 'VENDOR'
  | 'SALES'
  | 'EDITOR'
  | 'INVENTORY'
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
  staffCode?: string | null
}

export interface UserParams {
  page?: number
  limit?: number
  search?: string | null
  role?: UserRole | null
  status?: UserStatus | null
  sort?: 'asc' | 'desc' | null
  sortBy?: 'createdAt' | 'name' | 'email' | 'staffCode' | 'lastLogin' | null
  isSystem?: boolean | null
}

export type UserTableMeta = {
  onUpdateStatus: (id: string, status: UserStatus) => void
  onUpdateRole: (id: string, role: UserRole) => void
  onDelete: (id: string) => void
  onEdit: (user: User) => void
}
