import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _menuApi } from './menu.api'
import { MenuInput } from './types'
import { toast } from 'react-toastify'

export const _menuService = {
  useMenus: (initialData?: any) => {
    return useQuery({
      queryKey: ['menus'],
      queryFn: () => _menuApi.fetchMenus(),
      initialData,
    })
  },

  useMenu: (id: string) => {
    return useQuery({
      queryKey: ['menu', id],
      queryFn: () => _menuApi.fetchMenuById(id),
      enabled: !!id,
    })
  },

  useCreateMenu: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _menuApi.createMenu,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['menus'] })
        toast.success('Thêm menu thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Thêm menu thất bại')
      },
    })
  },

  useUpdateMenu: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<MenuInput> }) =>
        _menuApi.updateMenu(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['menus'] })
        toast.success('Cập nhật menu thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật menu thất bại')
      },
    })
  },

  useDeleteMenu: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _menuApi.deleteMenu,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['menus'] })
        toast.success('Xóa menu thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Xóa menu thất bại')
      },
    })
  },
}
