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
        toast.success('Thêm sản phẩm mới thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Thêm sản phẩm mới thất bại!')
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
        toast.success('Cập nhật sản phẩm thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật sản phẩm thất bại!')
      },
    })
  },

  useDeleteProduct: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _productApi.deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success('Xóa sản phẩm thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Xóa sản phẩm thất bại!')
      },
    })
  },

  useDeleteManyProducts: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _productApi.deleteManyProducts,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success('Xóa các sản phẩm thành công!')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Xóa các sản phẩm thất bại!')
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

  useSetSaleTimer: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        _productApi.setSaleTimer(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['product'] })
        toast.success('Thiết lập sale timer thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Thiết lập sale timer thất bại')
      },
    })
  },
}
