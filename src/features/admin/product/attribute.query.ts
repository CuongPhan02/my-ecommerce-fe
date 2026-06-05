import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _attributeApi } from './attribute.api'
import { toast } from 'react-toastify'
import { ProductAttributeInput } from './types'

export const _attributeService = {
  useAttributes: (params?: { page?: number; limit?: number; search?: string }) => {
    return useQuery({
      queryKey: ['attributes', params],
      queryFn: () => _attributeApi.fetchAttributes(params),
    })
  },

  useAllAttributes: () => {
    return useQuery({
      queryKey: ['attributes', 'all'],
      queryFn: () => _attributeApi.fetchAllAttributes(),
    })
  },

  useAttribute: (id: string) => {
    return useQuery({
      queryKey: ['attribute', id],
      queryFn: () => _attributeApi.fetchAttribute(id),
      enabled: !!id,
    })
  },

  useCreateAttribute: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _attributeApi.createAttribute,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attributes'] })
        toast.success('Thêm thuộc tính thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Thêm thuộc tính thất bại!')
      },
    })
  },

  useUpdateAttribute: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<ProductAttributeInput> }) =>
        _attributeApi.updateAttribute(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attributes'] })
        queryClient.invalidateQueries({ queryKey: ['attribute'] })
        toast.success('Cập nhật thuộc tính thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật thuộc tính thất bại!')
      },
    })
  },

  useDeleteAttribute: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _attributeApi.deleteAttribute,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attributes'] })
        toast.success('Xóa thuộc tính thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Xóa thuộc tính thất bại!')
      },
    })
  },

  useDeleteManyAttributes: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _attributeApi.deleteManyAttributes,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attributes'] })
        toast.success('Xóa các thuộc tính thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Xóa các thuộc tính thất bại!')
      },
    })
  },
}
