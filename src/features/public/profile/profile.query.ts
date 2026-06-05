import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { _profileApi, UpdateProfilePayload } from './profile.api'
import { CreateAddressPayload, UpdateAddressPayload } from './types'
import { AUTH_QUERY_KEY } from '~/features/public/auth/auth.query'

export const _profileService = {
  useMyAddresses: () => {
    return useQuery({
      queryKey: ['my-addresses'],
      queryFn: () => _profileApi.getMyAddresses()
    })
  },

  useUpdateProfile: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: UpdateProfilePayload) => _profileApi.updateProfile(payload),
      onSuccess: () => {
        // Refresh both the auth/me query and auth store
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY.me })
      }
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
