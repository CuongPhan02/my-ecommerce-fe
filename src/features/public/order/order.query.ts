import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _orderApi } from './order.api'

export const _orderService = {
  useTrackOrder: (orderId: string) => {
    return useQuery({
      queryKey: ['order-track', orderId],
      queryFn: () => _orderApi.trackOrder(orderId),
      enabled: !!orderId,
      staleTime: 1000 * 60 * 5,
    })
  },

  useMyOrders: (params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: ['my-orders', params],
      queryFn: () => _orderApi.getMyOrders(params),
    })
  },

  useOrderDetail: (orderId: string | null) => {
    return useQuery({
      queryKey: ['order-detail', orderId],
      queryFn: () => _orderApi.getOrderDetail(orderId!),
      enabled: !!orderId,
      staleTime: 1000 * 60 * 2,
    })
  },

  useConfirmReceipt: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (orderId: string) => _orderApi.confirmReceipt(orderId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-orders'] })
        queryClient.invalidateQueries({ queryKey: ['order-detail'] })
      }
    })
  },

  useCreateRefund: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: { orderId: string; reason: string; amount: number }) =>
        _orderApi.createRefund(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-orders'] })
        queryClient.invalidateQueries({ queryKey: ['order-detail'] })
      },
    })
  },
}
