import { useQuery, useMutation } from '@tanstack/react-query'
import { _voucherApi } from './voucher.api'
import { ApplyVoucherPayload } from './types'

export const _voucherService = {
  usePublicVouchers: () => {
    return useQuery({
      queryKey: ['public-vouchers'],
      queryFn: () => _voucherApi.getPublicVouchers()
    })
  },

  useApplyVoucher: () => {
    return useMutation({
      mutationFn: (payload: ApplyVoucherPayload) => _voucherApi.applyVoucher(payload)
    })
  }
}
