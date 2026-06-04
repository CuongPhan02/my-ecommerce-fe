import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { OrderDetail } from './types'

export const _orderApi = {
  trackOrder: async (orderId: string) => {
    const res = await https.get<ApiResponse<OrderDetail>>(`/orders/track/${orderId}`)
    return res.data
  },

  getMyOrders: async (params?: { page?: number; limit?: number }) => {
    const res = await https.get<ApiResponse<{ data: OrderDetail[]; meta: any }>>('/orders/my-orders', { params })
    return res.data
  },

  confirmReceipt: async (orderId: string) => {
    const res = await https.post<ApiResponse<any>>(`/orders/my-orders/${orderId}/confirm-receipt`)
    return res.data
  },

  createRefund: async (payload: { orderId: string; reason: string; amount: number }) => {
    const res = await https.post<ApiResponse<any>>('/refunds', payload)
    return res.data
  },
}

