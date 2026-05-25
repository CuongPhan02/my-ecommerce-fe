import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { VoucherSchemaType } from './discount.validate'
import { Voucher, VoucherParams } from './types'

export const _voucherApi = {
  fetchVouchers: async (params?: VoucherParams) => {
    const response = await https.get<ApiResponse<any>>('/vouchers', {
      params,
    })
    return response.data
  },
  fetchVoucherById: async (id: string) => {
    const response = await https.get<ApiResponse<any>>(`/vouchers/${id}`)
    return response.data
  },
  createVoucher: async (payload: VoucherSchemaType) => {
    const response = await https.post<ApiResponse<any>>('/vouchers', payload)
    return response.data
  },
  updateVoucher: async (id: string, payload: VoucherSchemaType) => {
    const response = await https.put<ApiResponse<any>>(`/vouchers/${id}`, payload)
    return response.data
  },
  toggleVoucherStatus: async (id: string, isActive: boolean) => {
    const response = await https.patch<ApiResponse<any>>(`/vouchers/${id}/toggle`, { isActive })
    return response.data
  },
  deleteVoucher: async (id: string) => {
    const response = await https.delete<ApiResponse<any>>(`/vouchers/${id}`)
    return response.data
  },
}
