import { Review, ReviewParams, ReviewStatus } from './types'
import { mockReviews } from './review.mock'

export type ReviewListResponse = {
  data: Review[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const _reviewApi = {
  fetchReviews: async (params: ReviewParams) => {
    // const res = await https.get<ApiResponse<ReviewListResponse>>('/reviews', {
    //   params,
    // })
    // return res.data

    // Mock data for development
    return {
      result: {
        data: mockReviews,
        meta: {
          total: mockReviews.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      }
    } as any
  },

  updateReviewStatus: async (id: string, status: ReviewStatus) => {
    // const res = await https.patch<ApiResponse<Review>>(`/reviews/${id}/status`, {
    //   status,
    // })
    // return res.data
    return { result: { id, status } } as any
  },

  replyToReview: async (id: string, content: string) => {
    // const res = await https.post<ApiResponse<Review>>(`/reviews/${id}/reply`, {
    //   content,
    // })
    // return res.data
    return { result: { id, content } } as any
  },

  deleteReview: async (id: string) => {
    // const res = await https.delete<ApiResponse<null>>(`/reviews/${id}`)
    // return res.data
    return { result: null } as any
  },
}
