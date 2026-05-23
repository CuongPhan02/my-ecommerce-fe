import { https } from '~/config/https'
import { ApiResponse } from '~/@types/api'
import { LogoSettings, HeroBannerSettings } from './types'

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
}
