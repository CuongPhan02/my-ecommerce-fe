import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _profileApi } from './profile.api'
import { CreateAddressPayload, UpdateAddressPayload } from './types'

export const _profileService = {
  useMyAddresses: () => {
    return useQuery({
      queryKey: ['my-addresses'],
      queryFn: () => _profileApi.getMyAddresses()
    })
  },

  useCreateAddress: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: CreateAddressPayload) => _profileApi.createAddress(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-addresses'] })
      }
    })
  },

  useUpdateAddress: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: UpdateAddressPayload }) => 
        _profileApi.updateAddress(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-addresses'] })
      }
    })
  },

  useDeleteAddress: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _profileApi.deleteAddress(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-addresses'] })
      }
    })
  },

  useSetDefaultAddress: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _profileApi.setDefaultAddress(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-addresses'] })
      }
    })
  }
}
