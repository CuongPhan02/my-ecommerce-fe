import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { CategorySchemaType } from './category.validate'

export type CategoryParams = {
  page?: number
  limit?: number
  search?: string | null
  categoryId?: string | null
  brandId?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | null
}

export const _categoryApi = {
  fetchCategories: async (params?: CategoryParams) => {
    const response = await https.get<ApiResponse<any>>('/products/categories', {
      params,
    })
    return response.data
  },
  fetchCategoryById: async (id: string) => {
    const response = await https.get<ApiResponse<any>>(
      `/products/categories/${id}`,
    )
    return response.data
  },
  createCategory: async (payload: CategorySchemaType) => {
    const response = await https.post<ApiResponse<any>>(
      '/products/categories',
      payload,
    )
    return response.data
  },
  updateCategory: async (id: string, payload: CategorySchemaType) => {
    const response = await https.put<ApiResponse<any>>(
      `/products/categories/${id}`,
      payload,
    )
    return response.data
  },
  deleteCategory: async (id: string) => {
    const response = await https.delete<ApiResponse<any>>(
      `/products/categories/${id}`,
    )
    return response.data
  },
  deleteCategories: async (ids: string[]) => {
    const response = await https.post<ApiResponse<any>>(
      '/products/categories/delete-many',
      {
        ids,
      },
    )
    return response.data
  },
}
