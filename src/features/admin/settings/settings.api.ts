import { https } from '~/config/https'
import { ApiResponse } from '~/@types/api'
import { 
  LogoSettings, 
  HeroBannerSettings, 
  StoreInfo, 
  SocialLinks, 
  SeoMeta, 
  SystemConfig 
} from './types'

export const _settingsApi = {
  fetchLogoSettings: async () => {
    const res = await https.get<ApiResponse<LogoSettings>>('/settings/logo')
    return res.data
  },

  updateLogoSettings: async (data: LogoSettings) => {
    const res = await https.post<ApiResponse<LogoSettings>>('/settings/logo', data)
    return res.data
  },

  fetchHeroBannerSettings: async () => {
    const res = await https.get<ApiResponse<HeroBannerSettings>>('/settings/hero-banner')
    return res.data
  },

  updateHeroBannerSettings: async (data: HeroBannerSettings) => {
    const res = await https.post<ApiResponse<HeroBannerSettings>>('/settings/hero-banner', data)
    return res.data
  },

  fetchStoreInfo: async () => {
    const res = await https.get<ApiResponse<StoreInfo>>('/settings/store-info')
    return res.data
  },

  updateStoreInfo: async (data: StoreInfo) => {
    const res = await https.post<ApiResponse<StoreInfo>>('/settings/store-info', data)
    return res.data
  },

  fetchSocialLinks: async () => {
    const res = await https.get<ApiResponse<SocialLinks>>('/settings/social-links')
    return res.data
  },

  updateSocialLinks: async (data: SocialLinks) => {
    const res = await https.post<ApiResponse<SocialLinks>>('/settings/social-links', data)
    return res.data
  },

  fetchSeoMeta: async () => {
    const res = await https.get<ApiResponse<SeoMeta>>('/settings/seo-meta')
    return res.data
  },

  updateSeoMeta: async (data: SeoMeta) => {
    const res = await https.post<ApiResponse<SeoMeta>>('/settings/seo-meta', data)
    return res.data
  },

  fetchSystemConfig: async () => {
    const res = await https.get<ApiResponse<SystemConfig>>('/settings/system-config')
    return res.data
  },

  updateSystemConfig: async (data: SystemConfig) => {
    const res = await https.post<ApiResponse<SystemConfig>>('/settings/system-config', data)
    return res.data
  },
}
