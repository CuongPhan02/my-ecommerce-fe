import { https } from '~/config/https'
import { ApiResponse } from '~/@types/api'
import { Product } from '~/features/admin/product/types'

export const _publicProductApi = {
  getProductDetail: async (idOrSlug: string) => {
    const res = await https.get<ApiResponse<Product>>(`/products/${idOrSlug}`)
    return res.data
  }
}
