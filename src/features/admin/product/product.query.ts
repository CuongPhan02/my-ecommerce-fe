import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _productApi } from './product.api'
import { ProductParams } from './types'
import { toast } from 'react-toastify'

export const _productService = {
  useProducts: (params: ProductParams) => {
    return useQuery({
      queryKey: ['products', params],
      queryFn: () => _productApi.fetchProducts(params),
    })
  },

  useProduct: (id: string) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: () => _productApi.fetchProduct(id),
      enabled: !!id,
    })
  },

  useCreateProduct: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _productApi.createProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success('Product created successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create product')
      },
    })
  },

  useUpdateProduct: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        _productApi.updateProduct(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['product'] })
        toast.success('Product updated successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update product')
      },
    })
  },

  useDeleteProduct: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _productApi.deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success('Product deleted successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to delete product')
      },
    })
  },

  useDeleteManyProducts: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _productApi.deleteManyProducts,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success('Products deleted successfully')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to delete products')
      },
    })
  },

  useUpdateProductStatus: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        _productApi.updateProduct(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update status')
      },
    })
  },
}
