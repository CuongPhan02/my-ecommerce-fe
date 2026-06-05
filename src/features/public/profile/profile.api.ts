import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { Address, CreateAddressPayload, UpdateAddressPayload } from './types'

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  avatarUrl?: string
}

export const _profileApi = {
  getMyAddresses: async () => {
    const res = await https.get<ApiResponse<Address[]>>('/addresses/me')
    return res.data
  },

  createAddress: async (payload: CreateAddressPayload) => {
    const res = await https.post<ApiResponse<Address>>('/addresses', payload)
    return res.data
  },

  updateAddress: async (id: string, payload: UpdateAddressPayload) => {
    const res = await https.put<ApiResponse<Address>>(`/addresses/${id}`, payload)
    return res.data
  },

  deleteAddress: async (id: string) => {
    const res = await https.delete<ApiResponse<any>>(`/addresses/${id}`)
    return res.data
  },

  setDefaultAddress: async (id: string) => {
    const res = await https.patch<ApiResponse<Address>>(`/addresses/${id}/set-default`)
    return res.data
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const res = await https.put<ApiResponse<any>>('/auth/profile', payload)
    return res.data
  },
}
