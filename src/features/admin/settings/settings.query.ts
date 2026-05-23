import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _settingsApi } from './settings.api'
import { LogoSettings, HeroBannerSettings } from './types'
import { toast } from 'react-toastify'

export const _settingsService = {
  useLogoSettings: () => {
    return useQuery({
      queryKey: ['settings', 'logo'],
      queryFn: () => _settingsApi.fetchLogoSettings(),
    })
  },

  useUpdateLogoSettings: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.updateLogoSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings', 'logo'] })
        toast.success('Cập nhật cấu hình Logo thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật cấu hình Logo thất bại')
      },
    })
  },

  useHeroBannerSettings: () => {
    return useQuery({
      queryKey: ['settings', 'hero-banner'],
      queryFn: () => _settingsApi.fetchHeroBannerSettings(),
    })
  },

  useUpdateHeroBannerSettings: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.updateHeroBannerSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings', 'hero-banner'] })
        toast.success('Cập nhật Banner trang chủ thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật Banner thất bại')
      },
    })
  },
}
