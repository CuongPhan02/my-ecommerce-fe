import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { BrandSchemaType } from './brand.validate'
import { Brand, BrandParams } from './types'

export const _brandApi = {
  fetchBrands: async (params?: BrandParams) => {
    const response = await https.get<ApiResponse<any>>('/products/brands', {
      params,
    })
    return response.data
  },
  fetchBrandById: async (id: string) => {
    const response = await https.get<ApiResponse<any>>(`/products/brands/${id}`)
    return response.data
  },
  createBrand: async (payload: BrandSchemaType) => {
    const response = await https.post<ApiResponse<any>>(
      '/products/brands',
      payload,
    )
    return response.data
  },
  updateBrand: async (id: string, payload: BrandSchemaType) => {
    const response = await https.put<ApiResponse<any>>(
      `/products/brands/${id}`,
      payload,
    )
    return response.data
  },
  deleteBrand: async (id: string) => {
    const response = await https.delete<ApiResponse<any>>(
      `/products/brands/${id}`,
    )
    return response.data
  },
  deleteBrands: async (ids: string[]) => {
    const response = await https.post<ApiResponse<any>>(
      '/products/brands/delete-many',
      {
        ids,
      },
    )
    return response.data
  },
}
