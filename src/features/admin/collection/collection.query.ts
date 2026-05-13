import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _collectionApi } from './collection.api'
import { CollectionParams } from './types'
import { toast } from 'react-toastify'

export const _collectionService = {
  useCollections: (params: CollectionParams) => {
    return useQuery({
      queryKey: ['collections', params],
      queryFn: () => _collectionApi.getCollections(params),
    })
  },

  useCollection: (id: string) => {
    return useQuery({
      queryKey: ['collection', id],
      queryFn: () => _collectionApi.getCollection(id),
      enabled: !!id,
    })
  },

  useCreateCollection: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _collectionApi.createCollection,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['collections'] })
        toast.success('Collection created successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create collection')
      },
    })
  },

  useUpdateCollection: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        _collectionApi.updateCollection(id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['collections'] })
        queryClient.invalidateQueries({ queryKey: ['collection', variables.id] })
        toast.success('Collection updated successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update collection')
      },
    })
  },

  useDeleteCollection: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _collectionApi.deleteCollection,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['collections'] })
        toast.success('Collection deleted successfully')
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete collection')
      },
    })
  },

  useAddProducts: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ collectionId, productIds }: { collectionId: string; productIds: string[] }) =>
        _collectionApi.addProducts(collectionId, productIds),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] })
        toast.success('Products added to collection')
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to add products')
      },
    })
  },
}
