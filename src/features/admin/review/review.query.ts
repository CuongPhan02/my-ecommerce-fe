import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _reviewApi } from './review.api'
import { ReviewParams, ReviewStatus } from './types'
import { toast } from 'react-toastify'

export const _reviewService = {
  useReviews: (params: ReviewParams) => {
    return useQuery({
      queryKey: ['reviews', params],
      queryFn: () => _reviewApi.fetchReviews(params),
    })
  },

  useUpdateReviewStatus: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
        _reviewApi.updateReviewStatus(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reviews'] })
        toast.success('Cập nhật trạng thái thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại')
      },
    })
  },

  useReplyToReview: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, content }: { id: string; content: string }) =>
        _reviewApi.replyToReview(id, content),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reviews'] })
        toast.success('Đã gửi phản hồi')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Gửi phản hồi thất bại')
      },
    })
  },

  useDeleteReview: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _reviewApi.deleteReview,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reviews'] })
        toast.success('Xóa đánh giá thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Xóa đánh giá thất bại')
      },
    })
  },
}
