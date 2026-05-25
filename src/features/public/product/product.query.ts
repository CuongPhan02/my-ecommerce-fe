import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _publicProductApi, SubmitReviewPayload } from './product.api'

export const _productService = {
  useProductDetail: (idOrSlug: string) => {
    return useQuery({
      queryKey: ['product', idOrSlug],
      queryFn: () => _publicProductApi.getProductDetail(idOrSlug),
      enabled: !!idOrSlug
    })
  },

  useProductReviews: (productId: string, params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: ['product-reviews', productId, params],
      queryFn: () => _publicProductApi.getProductReviews(productId, params),
      enabled: !!productId
    })
  },

  useSubmitReview: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: SubmitReviewPayload) => _publicProductApi.submitReview(payload),
      onSuccess: (_, variables) => {
        // Invalidate reviews list for this product to trigger refetch
        queryClient.invalidateQueries({
          queryKey: ['product-reviews', variables.productId]
        })
      }
    })
  }
}
