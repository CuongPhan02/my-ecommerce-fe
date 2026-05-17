import { User } from './types'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@gmail.com',
    phone: '0987654321',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: '2025-01-01T10:00:00Z',
    lastLogin: '2026-05-15T08:00:00Z',
  },
  {
    id: 'user-2',
    fullName: 'Trần Thị Khách',
    email: 'customer@gmail.com',
    phone: '0123456789',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    createdAt: '2025-02-15T14:30:00Z',
    lastLogin: '2026-05-14T20:15:00Z',
  },
  {
    id: 'user-3',
    fullName: 'Lê Văn Shop',
    email: 'vendor@gmail.com',
    phone: '0909090909',
    role: 'VENDOR',
    status: 'ACTIVE',
    createdAt: '2025-03-10T09:15:00Z',
    lastLogin: '2026-05-13T11:00:00Z',
  },
  {
    id: 'user-4',
    fullName: 'Phạm Thị Khóa',
    email: 'blocked@gmail.com',
    phone: '0888888888',
    role: 'CUSTOMER',
    status: 'BLOCKED',
    createdAt: '2025-04-20T16:45:00Z',
    lastLogin: '2026-04-30T10:00:00Z',
  },
  {
    id: 'user-5',
    fullName: 'Hoàng Văn Quản Lý',
    email: 'manager@gmail.com',
    phone: '0777777777',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2025-05-12T08:20:00Z',
    lastLogin: '2026-05-15T07:30:00Z',
  }
]
