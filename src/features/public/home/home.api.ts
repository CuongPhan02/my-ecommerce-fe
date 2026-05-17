import { https } from '~/config/https'
import { ApiResponse } from '~/@types/api'
import { Product } from '~/features/admin/product/types'
import { Collection } from '~/features/admin/collection/types'

export const _publicProductApi = {
  getNewArrivals: async () => {
    const res = await https.get<ApiResponse<{ data: Product[] }>>('/products/new-arrivals')
    return res.data
  },
  
  getFlashSales: async () => {
    const res = await https.get<ApiResponse<{ data: Product[] }>>('/products/flash-sales')
    return res.data
  }
}

export const _publicCollectionApi = {
  getCollections: async () => {
    const res = await https.get<ApiResponse<{ data: Collection[] }>>('/collections/')
    return res.data
  }
}
