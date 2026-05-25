import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _voucherApi } from './discount.api'
import { VoucherSchemaType } from './discount.validate'
import { VoucherParams } from './types'

export const VOUCHER_QUERY_KEY = {
  ALL: ['VOUCHERS'] as const,
  LIST: (params?: VoucherParams) => [...VOUCHER_QUERY_KEY.ALL, 'LIST', params] as const,
  DETAIL: (id: string) => [...VOUCHER_QUERY_KEY.ALL, 'DETAIL', id] as const,
}

export const _voucherService = {
  useVouchers: (params?: VoucherParams) => {
    return useQuery({
      queryKey: VOUCHER_QUERY_KEY.LIST(params),
      queryFn: () => _voucherApi.fetchVouchers(params),
    })
  },

  useVoucher: (id: string) => {
    return useQuery({
      queryKey: VOUCHER_QUERY_KEY.DETAIL(id),
      queryFn: () => _voucherApi.fetchVoucherById(id),
      enabled: !!id,
    })
  },

  useVoucherCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: VoucherSchemaType) => _voucherApi.createVoucher(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: VOUCHER_QUERY_KEY.ALL })
      },
    })
  },

  useVoucherUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: VoucherSchemaType }) =>
        _voucherApi.updateVoucher(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: VOUCHER_QUERY_KEY.ALL })
      },
    })
  },

  useVoucherToggleStatus: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
        _voucherApi.toggleVoucherStatus(id, isActive),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: VOUCHER_QUERY_KEY.ALL })
      },
    })
  },

  useVoucherDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _voucherApi.deleteVoucher(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: VOUCHER_QUERY_KEY.ALL })
      },
    })
  },
}
