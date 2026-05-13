import { Product, ProductParams } from './types'
import { ProductSchemaType } from './product.validate'
import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'

export type ProductListResponse = {
  data: Product[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const _productApi = {
  fetchProducts: async (params: ProductParams) => {
    const res = await https.get<ApiResponse<ProductListResponse>>('/products', {
      params,
    })
    return res.data
  },

  fetchProduct: async (id: string) => {
    const res = await https.get<ApiResponse<Product>>(`/products/${id}`)
    return res.data
  },

  createProduct: async (data: ProductSchemaType) => {
    const res = await https.post<ApiResponse<Product>>('/products', data)
    return res.data
  },

  updateProduct: async (id: string, data: Partial<ProductSchemaType>) => {
    const res = await https.put<ApiResponse<Product>>(`/products/${id}`, data)
    return res.data
  },

  deleteProduct: async (id: string) => {
    const res = await https.delete<ApiResponse<null>>(`/products/${id}`)
    return res.data
  },

  deleteManyProducts: async (ids: string[]) => {
    const res = await https.post<ApiResponse<null>>('/products/delete-many', {
      ids,
    })
    return res.data
  },
}
