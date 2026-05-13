import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { ProductAttribute, ProductAttributeInput } from './types'

export const _attributeApi = {
  fetchAttributes: async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await https.get<ApiResponse<{ data: ProductAttribute[]; meta: any }>>('/products/attributes', {
      params,
    })
    return res.data
  },

  fetchAllAttributes: async () => {
    const res = await https.get<ApiResponse<ProductAttribute[]>>('/products/attributes/all')
    return res.data
  },

  fetchAttribute: async (id: string) => {
    const res = await https.get<ApiResponse<ProductAttribute>>(`/products/attributes/${id}`)
    return res.data
  },

  createAttribute: async (data: ProductAttributeInput) => {
    const res = await https.post<ApiResponse<ProductAttribute>>('/products/attributes', data)
    return res.data
  },

  updateAttribute: async (id: string, data: Partial<ProductAttributeInput>) => {
    const res = await https.put<ApiResponse<ProductAttribute>>(`/products/attributes/${id}`, data)
    return res.data
  },

  deleteAttribute: async (id: string) => {
    const res = await https.delete<ApiResponse<null>>(`/products/attributes/${id}`)
    return res.data
  },

  deleteManyAttributes: async (ids: string[]) => {
    const res = await https.post<ApiResponse<null>>('/products/attributes/delete-many', {
      ids,
    })
    return res.data
  },
}
