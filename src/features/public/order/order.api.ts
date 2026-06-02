import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { OrderDetail } from './types'

export const _orderApi = {
  trackOrder: async (orderId: string) => {
    const res = await https.get<ApiResponse<OrderDetail>>(`/orders/track/${orderId}`)
    return res.data
  }
}
