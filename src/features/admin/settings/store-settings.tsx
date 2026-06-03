'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/core/tabs'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Textarea } from '~/components/ui/core/textarea'
import { Button } from '~/components/ui/core/button'
import { Switch } from '~/components/ui/core/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { _settingsService } from './settings.query'
import { LogoSettings, HeroBannerItem } from './types'
import MediaPickerModal from '~/features/admin/media/components/media-picker-modal'
import {
  Plus,
  Trash,
  Image as ImageIcon,
  Video,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye,
  Settings2,
  FileImage,
  Upload,
} from 'lucide-react'

export function StoreSettings() {
  // 1. Fetch & Mutation Hooks for App Settings
  const { data: logoData, isLoading: isLogoLoading } = _settingsService.useLogoSettings()
  const { data: heroData, isLoading: isHeroLoading } = _settingsService.useHeroBannerSettings()
  const { data: storeInfoData } = _settingsService.useStoreInfo()
  const { data: socialLinksData } = _settingsService.useSocialLinks()
  const { data: seoMetaData } = _settingsService.useSeoMeta()
  const { data: systemConfigData } = _settingsService.useSystemConfig()

  const updateLogoMutation = _settingsService.useUpdateLogoSettings()
  const updateHeroMutation = _settingsService.useUpdateHeroBannerSettings()
  const updateStoreInfoMutation = _settingsService.useUpdateStoreInfo()
  const updateSocialLinksMutation = _settingsService.useUpdateSocialLinks()
  const updateSeoMetaMutation = _settingsService.useUpdateSeoMeta()
  const updateSystemConfigMutation = _settingsService.useUpdateSystemConfig()

  // 2. States
  const [logoState, setLogoState] = useState<LogoSettings>({
    imageUrl: null,
    darkImageUrl: null,
    alt: null,
    width: null,
    height: null,
  })

  const [banners, setBanners] = useState<HeroBannerItem[]>([])
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null)

  const [storeInfo, setStoreInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    twitter: '',
  })

  const [seoMeta, setSeoMeta] = useState({
    title: '',
    description: '',
    keywords: '',
  })

  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    enableEmailVerification: true,
  })

  // Sync loaded states
  useEffect(() => {
    if (logoData?.result) {
      setLogoState({
        imageUrl: logoData.result.imageUrl || null,
        darkImageUrl: logoData.result.darkImageUrl || null,
        alt: logoData.result.alt || null,
        width: logoData.result.width || null,
        height: logoData.result.height || null,
      })
    }
  }, [logoData])

  useEffect(() => {
    if (heroData?.result?.items) {
      setBanners(heroData.result.items)
    } else if (Array.isArray(heroData?.result)) {
      setBanners(heroData.result)
    } else if (heroData?.result && 'items' in heroData.result) {
      setBanners((heroData.result as any).items || [])
    }
  }, [heroData])

  useEffect(() => {
    if (storeInfoData?.result) {
      setStoreInfo({
        name: storeInfoData.result.name || '',
        email: storeInfoData.result.email || '',
        phone: storeInfoData.result.phone || '',
        address: storeInfoData.result.address || '',
      })
    }
  }, [storeInfoData])

  useEffect(() => {
    if (socialLinksData?.result) {
      setSocialLinks({
        facebook: socialLinksData.result.facebook || '',
        instagram: socialLinksData.result.instagram || '',
        tiktok: socialLinksData.result.tiktok || '',
        youtube: socialLinksData.result.youtube || '',
        twitter: socialLinksData.result.twitter || '',
      })
    }
  }, [socialLinksData])

  useEffect(() => {
    if (seoMetaData?.result) {
      setSeoMeta({
        title: seoMetaData.result.title || '',
        description: seoMetaData.result.description || '',
        keywords: seoMetaData.result.keywords || '',
      })
    }
  }, [seoMetaData])

  useEffect(() => {
    if (systemConfigData?.result) {
      setSystemConfig({
        maintenanceMode: !!systemConfigData.result.maintenanceMode,
        enableEmailVerification: !!systemConfigData.result.enableEmailVerification,
      })
    }
  }, [systemConfigData])

  // Logo form event handlers
  const handleLogoFieldChange = (field: keyof LogoSettings, value: any) => {
    setLogoState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSelectLogo = (items: any[]) => {
    if (items.length > 0) {
      handleLogoFieldChange('imageUrl', items[0].url)
    }
  }

  const handleSelectDarkLogo = (items: any[]) => {
    if (items.length > 0) {
      handleLogoFieldChange('darkImageUrl', items[0].url)
    }
  }

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateLogoMutation.mutateAsync(logoState)
  }

  // Hero Banners event handlers
  const handleAddBanner = () => {
    const newItem: HeroBannerItem = {
      id: 'temp-' + Date.now(),
      mediaType: 'image',
      mediaUrl: null,
      thumbnailUrl: null,
      heading: 'Khám phá Bộ sưu tập Mới',
      subheading: 'Trải nghiệm phong cách thời thượng và hiện đại bậc nhất',
      buttonText: 'Mua ngay',
      buttonLink: '/shop',
      displayOrder: banners.length + 1,
      isActive: true,
    }
    setBanners((prev) => [...prev, newItem])
    setActiveSlideIndex(banners.length) // Open the new slide details immediately
  }

  const handleRemoveBanner = (id: string | null) => {
    setBanners((prev) => prev.filter((item) => item.id !== id))
    setActiveSlideIndex(null)
  }

  const handleUpdateBanner = (id: string | null, field: keyof HeroBannerItem, value: any) => {
    setBanners((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newBanners = [...banners]
    const temp = newBanners[index]
    newBanners[index] = newBanners[index - 1]
    newBanners[index - 1] = temp

    newBanners.forEach((item, idx) => {
      item.displayOrder = idx + 1
    })

    setBanners(newBanners)
    if (activeSlideIndex === index) {
      setActiveSlideIndex(index - 1)
    } else if (activeSlideIndex === index - 1) {
      setActiveSlideIndex(index)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return
    const newBanners = [...banners]
    const temp = newBanners[index]
    newBanners[index] = newBanners[index + 1]
    newBanners[index + 1] = temp

    newBanners.forEach((item, idx) => {
      item.displayOrder = idx + 1
    })

    setBanners(newBanners)
    if (activeSlideIndex === index) {
      setActiveSlideIndex(index + 1)
    } else if (activeSlideIndex === index + 1) {
      setActiveSlideIndex(index)
    }
  }

  const handleSaveBanners = async () => {
    await updateHeroMutation.mutateAsync({ items: banners })
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Cài đặt cửa hàng</h1>
        <p className='text-muted-foreground'>
          Quản lý các thông tin và cấu hình chung cho toàn bộ hệ thống e-commerce.
        </p>
      </div>

      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 lg:w-[600px] bg-muted/60 p-1 rounded-2xl'>
          <TabsTrigger value='general' className='rounded-xl'>Thông tin chung</TabsTrigger>
          <TabsTrigger value='advanced' className='rounded-xl'>Nâng cao & SEO</TabsTrigger>
          <TabsTrigger value='app' className='rounded-xl flex items-center gap-1.5'>
            <Settings2 className='h-3.5 w-3.5' /> Cấu hình App
          </TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-4 mt-4'>
          <Card className='rounded-3xl border border-gray-100 shadow-sm'>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Tên cửa hàng, địa chỉ và thông tin liên hệ hiển thị với khách hàng.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='storeName'>Tên cửa hàng</Label>
                <Input 
                  id='storeName' 
                  value={storeInfo.name} 
                  onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='storeEmail'>Email liên hệ</Label>
                <Input 
                  id='storeEmail' 
                  type='email' 
                  value={storeInfo.email} 
                  onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='storePhone'>Số điện thoại</Label>
                <Input 
                  id='storePhone' 
                  value={storeInfo.phone} 
                  onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='storeAddress'>Địa chỉ</Label>
                <Textarea
                  id='storeAddress'
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                  className='min-h-[80px] rounded-xl'
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => updateStoreInfoMutation.mutate(storeInfo)}
                disabled={updateStoreInfoMutation.isPending}
                className='rounded-xl'
              >
                {updateStoreInfoMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </CardFooter>
          </Card>

          <Card className='rounded-3xl border border-gray-100 shadow-sm'>
            <CardHeader>
              <CardTitle>Mạng xã hội</CardTitle>
              <CardDescription>Liên kết đến các kênh truyền thông của cửa hàng.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='facebook'>Facebook</Label>
                <Input 
                  id='facebook' 
                  placeholder='https://facebook.com/...' 
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='instagram'>Instagram</Label>
                <Input 
                  id='instagram' 
                  placeholder='https://instagram.com/...' 
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='tiktok'>TikTok</Label>
                <Input 
                  id='tiktok' 
                  placeholder='https://tiktok.com/@...' 
                  value={socialLinks.tiktok}
                  onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => updateSocialLinksMutation.mutate({
                  ...socialLinks,
                  youtube: socialLinks.youtube || null,
                  twitter: socialLinks.twitter || null
                })}
                disabled={updateSocialLinksMutation.isPending}
                className='rounded-xl'
              >
                {updateSocialLinksMutation.isPending ? 'Đang lưu...' : 'Lưu liên kết'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='advanced' className='space-y-4 mt-4'>
          <Card className='rounded-3xl border border-gray-100 shadow-sm'>
            <CardHeader>
              <CardTitle>SEO Meta Tags</CardTitle>
              <CardDescription>
                Cấu hình thông tin chuẩn SEO cho trang chủ.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='metaTitle'>Meta Title</Label>
                <Input 
                  id='metaTitle' 
                  value={seoMeta.title} 
                  onChange={(e) => setSeoMeta({ ...seoMeta, title: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='metaDesc'>Meta Description</Label>
                <Textarea
                  id='metaDesc'
                  value={seoMeta.description}
                  onChange={(e) => setSeoMeta({ ...seoMeta, description: e.target.value })}
                  className='min-h-[80px] rounded-xl'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='keywords'>Meta Keywords</Label>
                <Input 
                  id='keywords' 
                  value={seoMeta.keywords} 
                  onChange={(e) => setSeoMeta({ ...seoMeta, keywords: e.target.value })}
                  className='rounded-xl' 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => updateSeoMetaMutation.mutate({
                  ...seoMeta,
                  ogImage: null
                })}
                disabled={updateSeoMetaMutation.isPending}
                className='rounded-xl'
              >
                {updateSeoMetaMutation.isPending ? 'Đang lưu...' : 'Lưu SEO'}
              </Button>
            </CardFooter>
          </Card>

          <Card className='rounded-3xl border border-gray-100 shadow-sm'>
            <CardHeader>
              <CardTitle>Cấu hình hệ thống</CardTitle>
              <CardDescription>Các cài đặt kỹ thuật và trạng thái bảo trì.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between rounded-2xl border p-4 bg-gray-50/50'>
                <div className='space-y-0.5'>
                  <Label className='text-base font-bold'>Chế độ bảo trì</Label>
                  <p className='text-muted-foreground text-xs'>
                    Tạm dừng mọi giao dịch và hiển thị thông báo bảo trì.
                  </p>
                </div>
                <Switch 
                  checked={systemConfig.maintenanceMode}
                  onCheckedChange={(checked) => {
                    const newData = { ...systemConfig, maintenanceMode: checked }
                    setSystemConfig(newData)
                    updateSystemConfigMutation.mutate(newData)
                  }}
                />
              </div>
              <div className='flex items-center justify-between rounded-2xl border p-4 bg-gray-50/50'>
                <div className='space-y-0.5'>
                  <Label className='text-base font-bold'>Bật xác thực Email</Label>
                  <p className='text-muted-foreground text-xs'>
                    Yêu cầu khách hàng xác thực email khi đăng ký mới.
                  </p>
                </div>
                <Switch 
                  checked={systemConfig.enableEmailVerification}
                  onCheckedChange={(checked) => {
                    const newData = { ...systemConfig, enableEmailVerification: checked }
                    setSystemConfig(newData)
                    updateSystemConfigMutation.mutate(newData)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. NEW App Settings Tab */}
        <TabsContent value='app' className='space-y-6 mt-4'>
          {/* LOGO CONFIGURATION */}
          <Card className='rounded-3xl border border-gray-100 shadow-sm overflow-hidden'>
            <CardHeader className='border-b border-gray-50 bg-gray-50/20'>
              <CardTitle className='flex items-center gap-2'>
                <FileImage className='h-5 w-5 text-primary' /> Cấu hình Logo Hệ thống
              </CardTitle>
              <CardDescription>
                Tải lên và căn chỉnh biểu tượng thương hiệu hiển thị trên các giao diện Sáng/Tối.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveLogo}>
              <CardContent className='pt-6 space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  {/* Light Logo */}
                  <div className='flex flex-col gap-3'>
                    <Label className='font-bold text-gray-700 dark:text-gray-200'>Logo giao diện sáng</Label>
                    <div className='flex items-center gap-4'>
                      <div className='relative w-36 h-36 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary transition-colors flex items-center justify-center bg-gray-50 overflow-hidden group'>
                        {logoState.imageUrl ? (
                          <img
                            src={logoState.imageUrl}
                            alt='Light Logo'
                            className='w-full h-full object-contain p-2'
                          />
                        ) : (
                          <div className='flex flex-col items-center gap-1.5 text-neutral-400'>
                            <Upload className='h-6 w-6' />
                            <span className='text-[10px] font-medium'>Chọn logo sáng</span>
                          </div>
                        )}
                      </div>
                      <div className='flex flex-col gap-2'>
                        <MediaPickerModal
                          onSelect={handleSelectLogo}
                          trigger={
                            <Button type='button' variant='outline' className='rounded-xl text-xs h-9 px-4'>
                              {logoState.imageUrl ? 'Thay đổi ảnh' : 'Chọn hình ảnh'}
                            </Button>
                          }
                        />
                        {logoState.imageUrl && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='text-red-500 hover:text-red-600 rounded-xl text-xs h-8'
                            onClick={() => handleLogoFieldChange('imageUrl', null)}
                          >
                            Xóa ảnh
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dark Logo */}
                  <div className='flex flex-col gap-3'>
                    <Label className='font-bold text-gray-700 dark:text-gray-200'>Logo giao diện tối (Dark Mode)</Label>
                    <div className='flex items-center gap-4'>
                      <div className='relative w-36 h-36 rounded-2xl border-2 border-dashed border-gray-800 hover:border-primary transition-colors flex items-center justify-center bg-zinc-900 overflow-hidden group'>
                        {logoState.darkImageUrl ? (
                          <img
                            src={logoState.darkImageUrl}
                            alt='Dark Logo'
                            className='w-full h-full object-contain p-2'
                          />
                        ) : (
                          <div className='flex flex-col items-center gap-1.5 text-zinc-500'>
                            <Upload className='h-6 w-6' />
                            <span className='text-[10px] font-medium'>Chọn logo tối</span>
                          </div>
                        )}
                      </div>
                      <div className='flex flex-col gap-2'>
                        <MediaPickerModal
                          onSelect={handleSelectDarkLogo}
                          trigger={
                            <Button type='button' variant='outline' className='rounded-xl text-xs h-9 px-4'>
                              {logoState.darkImageUrl ? 'Thay đổi ảnh' : 'Chọn hình ảnh'}
                            </Button>
                          }
                        />
                        {logoState.darkImageUrl && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='text-red-500 hover:text-red-600 rounded-xl text-xs h-8'
                            onClick={() => handleLogoFieldChange('darkImageUrl', null)}
                          >
                            Xóa ảnh
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100'>
                  <div className='grid gap-2'>
                    <Label htmlFor='logoAlt' className='font-semibold'>Mô tả thay thế (Alt Text)</Label>
                    <Input
                      id='logoAlt'
                      placeholder='Mô tả ngắn về Logo thương hiệu...'
                      value={logoState.alt || ''}
                      onChange={(e) => handleLogoFieldChange('alt', e.target.value || null)}
                      className='rounded-xl'
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='logoWidth' className='font-semibold'>Chiều rộng hiển thị (px)</Label>
                    <Input
                      id='logoWidth'
                      type='number'
                      placeholder='Tự động'
                      value={logoState.width || ''}
                      onChange={(e) => handleLogoFieldChange('width', Number(e.target.value) || null)}
                      className='rounded-xl'
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='logoHeight' className='font-semibold'>Chiều cao hiển thị (px)</Label>
                    <Input
                      id='logoHeight'
                      type='number'
                      placeholder='Tự động'
                      value={logoState.height || ''}
                      onChange={(e) => handleLogoFieldChange('height', Number(e.target.value) || null)}
                      className='rounded-xl'
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className='border-t border-gray-50 bg-gray-50/10 py-4'>
                <Button type='submit' className='rounded-xl px-6' disabled={updateLogoMutation.isPending}>
                  {updateLogoMutation.isPending ? 'Đang lưu...' : 'Lưu cấu hình Logo'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* HERO BANNER CONFIGURATION */}
          <Card className='rounded-3xl border border-gray-100 shadow-sm overflow-hidden'>
            <CardHeader className='border-b border-gray-50 bg-gray-50/20 flex flex-row items-center justify-between gap-4 flex-wrap'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Sparkles className='h-5 w-5 text-amber-500 animate-pulse' /> Cấu hình Hero Banners Trang chủ
                </CardTitle>
                <CardDescription>
                  Thiết lập các slide trình chiếu ở đầu trang chủ, hỗ trợ hình ảnh và video động.
                </CardDescription>
              </div>
              <Button type='button' onClick={handleAddBanner} className='rounded-xl gap-1.5 text-xs shadow-md shadow-primary/10'>
                <Plus className='h-4 w-4' /> Thêm Slide
              </Button>
            </CardHeader>

            <CardContent className='pt-6 space-y-6'>
              {banners.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-3xl bg-gray-50/50 gap-3'>
                  <ImageIcon className='h-12 w-12 text-gray-300' />
                  <div className='text-center'>
                    <p className='font-semibold text-sm'>Chưa có Banner nào được tạo</p>
                    <p className='text-xs text-muted-foreground mt-1'>Bấm nút "Thêm Slide" để tạo banner đầu tiên.</p>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {banners.map((slide, idx) => {
                    const isExpanded = activeSlideIndex === idx
                    return (
                      <div
                        key={slide.id || idx}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isExpanded
                            ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.01]'
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        {/* Slide Summary Row */}
                        <div
                          className='flex items-center justify-between p-4 cursor-pointer select-none'
                          onClick={() => setActiveSlideIndex(isExpanded ? null : idx)}
                        >
                          <div className='flex items-center gap-4 flex-1 min-w-0'>
                            {/* Slide Thumbnail Preview */}
                            <div className='w-16 h-10 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center shrink-0'>
                              {slide.mediaUrl ? (
                                slide.mediaType === 'video' ? (
                                  <div className='relative w-full h-full flex items-center justify-center bg-black'>
                                    <Video className='h-4 w-4 text-white' />
                                  </div>
                                ) : (
                                  <img
                                    src={slide.mediaUrl}
                                    alt='Banner summary'
                                    className='w-full h-full object-cover'
                                  />
                                )
                              ) : (
                                <ImageIcon className='h-4 w-4 text-gray-300' />
                              )}
                            </div>

                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center gap-2'>
                                <span className='font-bold text-sm text-foreground'>
                                  Slide #{idx + 1}: {slide.heading || '(Chưa có tiêu đề)'}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  slide.isActive
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {slide.isActive ? 'Kích hoạt' : 'Ẩn'}
                                </span>
                              </div>
                              <p className='text-xs text-muted-foreground truncate mt-0.5'>
                                {slide.subheading || '(Chưa có mô tả)'}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 shrink-0' onClick={(e) => e.stopPropagation()}>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-gray-400 hover:text-gray-600 rounded-xl'
                              disabled={idx === 0}
                              onClick={() => handleMoveUp(idx)}
                            >
                              <ArrowUp className='h-4 w-4' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-gray-400 hover:text-gray-600 rounded-xl'
                              disabled={idx === banners.length - 1}
                              onClick={() => handleMoveDown(idx)}
                            >
                              <ArrowDown className='h-4 w-4' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl'
                              onClick={() => handleRemoveBanner(slide.id)}
                            >
                              <Trash className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        {/* Detailed Configuration (Collapsible) */}
                        {isExpanded && (
                          <div className='border-t border-gray-100 p-6 bg-white space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                              {/* Media Type & Picker */}
                              <div className='space-y-4 md:col-span-1'>
                                <div className='space-y-2'>
                                  <Label className='font-semibold'>Loại tập tin</Label>
                                  <Select
                                    value={slide.mediaType}
                                    onValueChange={(val) => handleUpdateBanner(slide.id, 'mediaType', val)}
                                  >
                                    <SelectTrigger className='rounded-xl'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value='image'>Hình ảnh (Image)</SelectItem>
                                      <SelectItem value='video'>Đoạn phim (Video)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className='space-y-2'>
                                  <Label className='font-semibold'>Tập tin đa phương tiện</Label>
                                  <div className='flex flex-col gap-2'>
                                    <div className='relative w-full h-32 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50'>
                                      {slide.mediaUrl ? (
                                        slide.mediaType === 'video' ? (
                                          <div className='flex flex-col items-center gap-1.5 text-zinc-500'>
                                            <Video className='h-6 w-6' />
                                            <span className='text-[10px] text-center px-2 truncate w-full'>{slide.mediaUrl}</span>
                                          </div>
                                        ) : (
                                          <img
                                            src={slide.mediaUrl}
                                            alt='Banner content'
                                            className='w-full h-full object-cover'
                                          />
                                        )
                                      ) : (
                                        <div className='flex flex-col items-center gap-1.5 text-neutral-400'>
                                          <ImageIcon className='h-6 w-6' />
                                          <span className='text-[10px] font-medium'>Chưa chọn phương tiện</span>
                                        </div>
                                      )}
                                    </div>
                                    <MediaPickerModal
                                      onSelect={(items) => {
                                        if (items.length > 0) {
                                          handleUpdateBanner(slide.id, 'mediaUrl', items[0].url)
                                        }
                                      }}
                                      trigger={
                                        <Button type='button' variant='outline' className='w-full rounded-xl text-xs h-9'>
                                          Chọn tập tin
                                        </Button>
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Form Text Inputs */}
                              <div className='space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2 md:col-span-2'>
                                  <Label className='font-semibold'>Tiêu đề (Heading)</Label>
                                  <Input
                                    value={slide.heading || ''}
                                    onChange={(e) => handleUpdateBanner(slide.id, 'heading', e.target.value)}
                                    placeholder='Ví dụ: Siêu Khuyến Mãi Mùa Hè...'
                                    className='rounded-xl font-bold'
                                  />
                                </div>

                                <div className='space-y-2 md:col-span-2'>
                                  <Label className='font-semibold'>Tiêu đề phụ (Subheading)</Label>
                                  <Textarea
                                    value={slide.subheading || ''}
                                    onChange={(e) => handleUpdateBanner(slide.id, 'subheading', e.target.value)}
                                    placeholder='Mô tả ngắn gọn về chương trình/sản phẩm...'
                                    className='rounded-xl min-h-[60px]'
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <Label className='font-semibold'>Chữ của Nút bấm</Label>
                                  <Input
                                    value={slide.buttonText || ''}
                                    onChange={(e) => handleUpdateBanner(slide.id, 'buttonText', e.target.value)}
                                    placeholder='Ví dụ: Xem ngay, Mua ngay...'
                                    className='rounded-xl'
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <Label className='font-semibold'>Đường dẫn liên kết (Button Link)</Label>
                                  <Input
                                    value={slide.buttonLink || ''}
                                    onChange={(e) => handleUpdateBanner(slide.id, 'buttonLink', e.target.value)}
                                    placeholder='Ví dụ: /shop, /categories/1...'
                                    className='rounded-xl'
                                  />
                                </div>

                                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border md:col-span-2 mt-2'>
                                  <div className='flex flex-col gap-0.5'>
                                    <Label className='font-bold text-sm'>Trạng thái kích hoạt</Label>
                                    <span className='text-[10px] text-muted-foreground'>Hiển thị slide này trên trang chủ</span>
                                  </div>
                                  <Switch
                                    checked={slide.isActive}
                                    onCheckedChange={(checked) => handleUpdateBanner(slide.id, 'isActive', checked)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>

            <CardFooter className='border-t border-gray-50 bg-gray-50/10 py-4 flex items-center justify-between gap-4'>
              <p className='text-xs text-muted-foreground'>
                Sắp xếp các slide theo thứ tự từ trên xuống dưới. Nhớ lưu lại cấu hình sau khi chỉnh sửa.
              </p>
              <Button type='button' onClick={handleSaveBanners} className='rounded-xl px-6' disabled={updateHeroMutation.isPending || banners.length === 0}>
                {updateHeroMutation.isPending ? 'Đang lưu...' : 'Lưu cấu hình Banner'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

