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
