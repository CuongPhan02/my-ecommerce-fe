import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _settingsApi } from './settings.api'
import { 
  LogoSettings, 
  HeroBannerSettings, 
  StoreInfo, 
  SocialLinks, 
  SeoMeta, 
  SystemConfig 
} from './types'
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

  useStoreInfo: () => {
    return useQuery({
      queryKey: ['settings', 'store-info'],
      queryFn: () => _settingsApi.fetchStoreInfo(),
    })
  },

  useUpdateStoreInfo: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.updateStoreInfo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings', 'store-info'] })
        toast.success('Cập nhật thông tin cửa hàng thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật thông tin cửa hàng thất bại')
      },
    })
  },

  useSocialLinks: () => {
    return useQuery({
      queryKey: ['settings', 'social-links'],
      queryFn: () => _settingsApi.fetchSocialLinks(),
    })
  },

  useUpdateSocialLinks: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.updateSocialLinks,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings', 'social-links'] })
        toast.success('Cập nhật mạng xã hội thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật mạng xã hội thất bại')
      },
    })
  },

  useSeoMeta: () => {
    return useQuery({
      queryKey: ['settings', 'seo-meta'],
      queryFn: () => _settingsApi.fetchSeoMeta(),
    })
  },

  useUpdateSeoMeta: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.updateSeoMeta,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings', 'seo-meta'] })
        toast.success('Cập nhật cấu hình SEO thành công')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật cấu hình SEO thất bại')
      },
    })
  },

  useSystemConfig: () => {
    return useQuery({
      queryKey: ['settings', 'system-config'],
      queryFn: () => _settingsApi.fetchSystemConfig(),
    })
  },

  useUpdateSystemConfig: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.updateSystemConfig,
      onSuccess: () => {
        toast.success('Lưu cấu hình hệ thống thành công')
        queryClient.invalidateQueries({ queryKey: ['settings', 'system-config'] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Lỗi khi lưu cấu hình hệ thống')
      },
    })
  },

  // SHIPPING CONFIG
  useShippingConfig: () => {
    return useQuery({
      queryKey: ['settings', 'shipping_config'],
      queryFn: _settingsApi.fetchShippingConfig,
    })
  },

  useUpdateShippingConfig: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.updateShippingConfig,
      onSuccess: () => {
        toast.success('Lưu cấu hình vận chuyển thành công')
        queryClient.invalidateQueries({ queryKey: ['settings', 'shipping_config'] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Lỗi khi lưu cấu hình vận chuyển')
      },
    })
  },

  // SHIPPING METHODS
  useShippingMethods: () => {
    return useQuery({
      queryKey: ['settings', 'shipping_methods'],
      queryFn: _settingsApi.fetchShippingMethods,
    })
  },

  useCreateShippingMethod: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.createShippingMethod,
      onSuccess: () => {
        toast.success('Tạo phương thức vận chuyển thành công')
        queryClient.invalidateQueries({ queryKey: ['settings', 'shipping_methods'] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Lỗi khi tạo phương thức')
      },
    })
  },

  useUpdateShippingMethod: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => 
        _settingsApi.updateShippingMethod(id, data),
      onSuccess: () => {
        toast.success('Cập nhật phương thức vận chuyển thành công')
        queryClient.invalidateQueries({ queryKey: ['settings', 'shipping_methods'] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Lỗi khi cập nhật phương thức')
      },
    })
  },

  useDeleteShippingMethod: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: _settingsApi.deleteShippingMethod,
      onSuccess: () => {
        toast.success('Xóa phương thức vận chuyển thành công')
        queryClient.invalidateQueries({ queryKey: ['settings', 'shipping_methods'] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Lỗi khi xóa phương thức')
      },
    })
  },
}
