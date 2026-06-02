import { useQuery } from '@tanstack/react-query'
import { _orderApi } from './order.api'

export const _orderService = {
  useTrackOrder: (orderId: string) => {
    return useQuery({
      queryKey: ['order-track', orderId],
      queryFn: () => _orderApi.trackOrder(orderId),
      enabled: !!orderId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}
