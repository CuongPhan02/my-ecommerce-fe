import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { Review, ReviewParams, ReviewStatus, ReviewReply } from './types'

export type ReviewListResponse = {
  data: Review[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const mapBackendReview = (item: any): Review => {
  const sizeAttr = item.variant?.attributes?.find(
    (a: any) => a.name.toLowerCase() === 'size' || a.name.toLowerCase() === 'kích thước'
  )
  const colorAttr = item.variant?.attributes?.find(
    (a: any) =>
      a.name.toLowerCase() === 'color' ||
      a.name.toLowerCase() === 'màu' ||
      a.name.toLowerCase() === 'màu sắc'
  )

  const replies: ReviewReply[] = item.reply
    ? [
        {
          id: item.id + '-reply',
          adminName: item.reply.repliedBy?.name || 'Quản trị viên',
          content: item.reply.content,
          createdAt: item.reply.createdAt,
        },
      ]
    : []

  return {
    id: item.id,
    userName: item.user?.name || 'Ẩn danh',
    userAvatar: item.user?.avatarUrl || undefined,
    rating: item.rating,
    comment: item.content,
    size: sizeAttr?.value || undefined,
    color: colorAttr?.value || undefined,
    tags: item.tags || [],
    likes: 0,
    status: item.status,
    productId: item.productId,
    productTitle: item.product?.name || 'Sản phẩm không tên',
    productThumbnail: item.product?.thumbnailUrl || undefined,
    createdAt: item.createdAt,
    replies,
  }
}

export const _reviewApi = {
  fetchReviews: async (params: ReviewParams) => {
    const res = await https.get<ApiResponse<{ data: any[]; meta: any }>>('/reviews', {
      params,
    })
    
    const mappedData = res.data.result?.data?.map(mapBackendReview) || []
    
    return {
      ...res.data,
      result: {
        ...res.data.result,
        data: mappedData,
      }
    } as any
  },

  updateReviewStatus: async (id: string, status: ReviewStatus) => {
    const res = await https.put<ApiResponse<any>>(`/reviews/${id}/moderate`, {
      status,
    })
    return {
      ...res.data,
      result: res.data.result ? mapBackendReview(res.data.result) : null,
    } as any
  },

  replyToReview: async (id: string, content: string) => {
    const res = await https.put<ApiResponse<any>>(`/reviews/${id}/reply`, {
      content,
    })
    return {
      ...res.data,
      result: res.data.result ? mapBackendReview(res.data.result) : null,
    } as any
  },

  deleteReview: async (id: string) => {
    const res = await https.delete<ApiResponse<null>>(`/reviews/${id}`)
    return res.data
  },
}
