import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _cartApi } from './cart.api'
import { AddToCartPayload, UpdateCartItemPayload, CreateOrderPayload, CreatePaymentUrlPayload } from './types'

export const _cartService = {
  useCart: (options?: { enabled?: boolean }) => {
    return useQuery({
      queryKey: ['cart'],
      queryFn: () => _cartApi.getCart(),
      staleTime: 1000 * 60 * 5, // 5 minutes cache stale time
      ...options,
    })
  },

  useAddToCart: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: AddToCartPayload) => _cartApi.addToCart(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    })
  },

  useUpdateCartItem: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateCartItemPayload }) => 
      _cartApi.updateCartItem(itemId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    })
  },

  useRemoveCartItem: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (itemId: string) => _cartApi.removeCartItem(itemId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    })
  },

  useClearCart: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: () => _cartApi.clearCart(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    })
  },

  useCreateOrder: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: CreateOrderPayload) => _cartApi.createOrder(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    })
  },

  useCreatePaymentUrl: () => {
    return useMutation({
      mutationFn: (payload: CreatePaymentUrlPayload) => _cartApi.createPaymentUrl(payload)
    })
  }
}

