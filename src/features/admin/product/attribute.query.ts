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
        toast.success('Attribute created successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create attribute')
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
        toast.success('Attribute updated successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update attribute')
      },
    })
  },

  useDeleteAttribute: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _attributeApi.deleteAttribute,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attributes'] })
        toast.success('Attribute deleted successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to delete attribute')
      },
    })
  },

  useDeleteManyAttributes: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _attributeApi.deleteManyAttributes,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attributes'] })
        toast.success('Attributes deleted successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to delete attributes')
      },
    })
  },
}
