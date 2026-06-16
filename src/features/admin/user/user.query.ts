import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _userApi } from './user.api'
import { UserParams, UserRole, UserStatus } from './types'
import { toast } from 'react-toastify'

export const _userService = {
  useUsers: (params: UserParams, options?: any) => {
    return useQuery<any>({
      queryKey: ['users', params],
      queryFn: () => _userApi.fetchUsers(params),
      ...options,
    })
  },

  useUpdateUserStatus: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
        _userApi.updateUserStatus(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success('Cập nhật trạng thái thành công')
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Cập nhật trạng thái thất bại',
        )
      },
    })
  },

  useUpdateUserRole: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
        _userApi.updateUserRole(id, role),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success('Cập nhật vai trò thành công')
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Cập nhật vai trò thất bại',
        )
      },
    })
  },

  useDeleteUser: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _userApi.deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success('Xóa người dùng thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Xóa người dùng thất bại')
      },
    })
  },

  useCreateUser: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _userApi.createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success('Thêm người dùng mới thành công!')
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Thêm người dùng thất bại',
        )
      },
    })
  },

  useUpdateUser: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _userApi.updateUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success('Cập nhật thông tin người dùng thành công!')
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Cập nhật thông tin thất bại',
        )
      },
    })
  },

  useBulkDeleteUsers: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _userApi.bulkDeleteUsers,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success('Xóa danh sách người dùng thành công')
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Xóa danh sách người dùng thất bại',
        )
      },
    })
  },
}
