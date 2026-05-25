import { https } from '~/config/https'
import { ApiResponse } from '~/@types/api'
import { Product } from '~/features/admin/product/types'

export interface PublicReview {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment?: string
  content?: string
  tags?: string[]
  likes?: number
  createdAt: string
  productVariant?: {
    id: string
    name: string
    color?: string
    size?: string
  }
  replies?: Array<{
    id: string
    adminName: string
    content: string
    createdAt: string
  }>
}

export type PublicReviewListResponse = {
  data: PublicReview[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type SubmitReviewPayload = {
  productId: string
  productVariantId?: string
  rating: number
  content: string
  tags?: string[]
}

export const _publicProductApi = {
  getProductDetail: async (idOrSlug: string) => {
    const res = await https.get<ApiResponse<Product>>(`/products/${idOrSlug}`)
    return res.data
  },

  getProductReviews: async (productId: string, params?: { page?: number; limit?: number }) => {
    const res = await https.get<ApiResponse<PublicReviewListResponse>>(`/reviews/product/${productId}`, {
      params,
    })
    return res.data
  },

  submitReview: async (payload: SubmitReviewPayload) => {
    const res = await https.post<ApiResponse<PublicReview>>('/reviews', payload)
    return res.data
  }
}
