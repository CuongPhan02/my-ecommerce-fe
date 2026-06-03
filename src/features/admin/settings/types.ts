export interface LogoSettings {
  imageUrl: string | null
  darkImageUrl: string | null
  alt: string | null
  width: number | null
  height: number | null
}

export interface HeroBannerItem {
  id: string | null
  mediaType: 'image' | 'video'
  mediaUrl: string | null
  thumbnailUrl: string | null
  heading: string | null
  subheading: string | null
  buttonText: string | null
  buttonLink: string | null
  displayOrder: number
  isActive: boolean
}

export interface HeroBannerSettings {
  items: HeroBannerItem[]
}

export interface StoreInfo {
  name: string
  email: string
  phone: string
  address: string
}

export interface SocialLinks {
  facebook: string | null
  instagram: string | null
  tiktok: string | null
  youtube: string | null
  twitter: string | null
}

export interface SeoMeta {
  title: string | null
  description: string | null
  keywords: string | null
  ogImage: string | null
}

export interface SystemConfig {
  maintenanceMode: boolean
  enableEmailVerification: boolean
}
