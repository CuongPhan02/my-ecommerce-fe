import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { Cart, AddToCartPayload, UpdateCartItemPayload, CreateOrderPayload, CreatePaymentUrlPayload } from './types'

export const _cartApi = {
  getCart: async () => {
    const res = await https.get<ApiResponse<Cart>>('/cart')
    return res.data
  },

  addToCart: async (payload: AddToCartPayload) => {
    const res = await https.post<ApiResponse<Cart>>('/cart/items', payload)
    return res.data
  },

  updateCartItem: async (itemId: string, payload: UpdateCartItemPayload) => {
    const res = await https.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, payload)
    return res.data
  },

  removeCartItem: async (itemId: string) => {
    const res = await https.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`)
    return res.data
  },

  clearCart: async () => {
    const res = await https.delete<ApiResponse<Cart>>('/cart/clear')
    return res.data
  },

  createOrder: async (payload: CreateOrderPayload) => {
    const res = await https.post<ApiResponse<any>>('/orders', payload)
    return res.data
  },

  createPaymentUrl: async (payload: CreatePaymentUrlPayload) => {
    const res = await https.post<ApiResponse<{ paymentUrl: string }>>('/payments/create-payment-url', payload)
    return res.data
  },

  getShippingConfig: async () => {
    const res = await https.get<ApiResponse<ShippingConfig>>('/settings/shipping_config')
    return res.data
  },

  getActiveShippingMethods: async () => {
    const res = await https.get<ApiResponse<ShippingMethod[]>>('/shipping-methods/active')
    return res.data
  }
}

