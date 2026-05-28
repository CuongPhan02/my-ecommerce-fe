import HeroSection from '~/features/public/home/hero-section'
import StorySection from '~/features/public/home/story-section'
import CategoryGrid from '~/features/public/home/category-grid'
import PromoBanners from '~/features/public/home/promo-banners'
import PickleballBanner from '~/features/public/home/pickleball-banner'
import SocialGrid from '~/features/public/home/social-grid'
import NewArrivalsSection from '~/features/public/home/new-arrivals-section'
import FlashSaleSection from '~/features/public/home/flash-sale-section'
import CollectionSection from '~/features/public/home/collection-section'

export default function Home() {
  return (
    <main className='overflow-x-hidden'>
      <HeroSection />

      {/* Flash Sale Section - High Urgency */}
      <FlashSaleSection />

      <StorySection />

      {/* Dynamic New Arrivals */}
      <NewArrivalsSection />

      {/* <CategoryGrid /> */}

      {/* Dynamic Collections Grid */}
      <CollectionSection />

      <PromoBanners />
      <PickleballBanner />

      <SocialGrid />
    </main>
  )
}
