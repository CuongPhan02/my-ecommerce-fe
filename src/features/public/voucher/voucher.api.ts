import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { Voucher, ApplyVoucherPayload } from './types'

export const _voucherApi = {
  getPublicVouchers: async () => {
    const res = await https.get<ApiResponse<Voucher[]>>('/vouchers/public')
    return res.data
  },

  applyVoucher: async (payload: ApplyVoucherPayload) => {
    const res = await https.post<ApiResponse<Voucher>>('/vouchers/apply', payload)
    return res.data
  }
}
