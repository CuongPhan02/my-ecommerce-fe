import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _cartApi } from './cart.api'
import { AddToCartPayload, UpdateCartItemPayload, CreateOrderPayload, CreatePaymentUrlPayload, Cart } from './types'

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
      onMutate: async ({ itemId, payload }) => {
        await queryClient.cancelQueries({ queryKey: ['cart'] })
        const previousCart = queryClient.getQueryData<{ result: Cart }>(['cart'])
        if (previousCart) {
          queryClient.setQueryData<{ result: Cart }>(['cart'], {
            ...previousCart,
            result: {
              ...previousCart.result,
              items: previousCart.result.items.map((item) =>
                item.id === itemId ? { ...item, quantity: payload.quantity } : item
              ),
            },
          })
        }
        return { previousCart }
      },
      onError: (err, variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(['cart'], context.previousCart)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    })
  },

  useRemoveCartItem: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (itemId: string) => _cartApi.removeCartItem(itemId),
      onMutate: async (itemId) => {
        await queryClient.cancelQueries({ queryKey: ['cart'] })
        const previousCart = queryClient.getQueryData<{ result: Cart }>(['cart'])
        if (previousCart) {
          queryClient.setQueryData<{ result: Cart }>(['cart'], {
            ...previousCart,
            result: {
              ...previousCart.result,
              items: previousCart.result.items.filter((item) => item.id !== itemId),
            },
          })
        }
        return { previousCart }
      },
      onError: (err, variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(['cart'], context.previousCart)
        }
      },
      onSettled: () => {
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
