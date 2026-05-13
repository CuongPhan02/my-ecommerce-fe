import HeroSection from '~/features/public/home/hero-section'
import StorySection from '~/features/public/home/story-section'
import CategoryGrid from '~/features/public/home/category-grid'
import PromoBanners from '~/features/public/home/promo-banners'
import PickleballBanner from '~/features/public/home/pickleball-banner'
import ProductSection from '~/features/public/home/product-section'
import SocialGrid from '~/features/public/home/social-grid'

const basicsProducts = [
  {
    id: 1,
    name: 'Áo thun Cotton Compact phiên bản Premium',
    price: 249000,
    originalPrice: 349000,
    rating: 4.8,
    reviews: 1240,
    badge: 'Bestseller',
    colors: [
      { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
      { name: 'White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600' },
      { name: 'Navy', hex: '#000080', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 2,
    name: 'Quần lót Nam Cotton Compact (Brief)',
    price: 99000,
    originalPrice: 129000,
    rating: 4.9,
    reviews: 5620,
    colors: [
      { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&q=80&w=600' },
      { name: 'Gray', hex: '#808080', image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 3,
    name: 'Áo Polo thể thao ProActive',
    price: 299000,
    rating: 4.7,
    reviews: 845,
    badge: 'Mới',
    colors: [
      { name: 'Blue', hex: '#0000ff', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600' },
      { name: 'White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 4,
    name: 'Quần Shorts thể thao 5" Everyday',
    price: 189000,
    originalPrice: 229000,
    rating: 4.6,
    reviews: 2100,
    colors: [
      { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' },
      { name: 'Olive', hex: '#556b2f', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' },
    ]
  }
]

const excoolProducts = [
  {
    id: 101,
    name: 'Áo Sơ mi Excool dài tay',
    price: 499000,
    originalPrice: 599000,
    rating: 4.9,
    reviews: 128,
    badge: 'Công nghệ mới',
    colors: [
      { name: 'Light Blue', hex: '#add8e6', image: 'https://images.unsplash.com/photo-1596755094514-f87034a264c1?auto=format&fit=crop&q=80&w=600' },
      { name: 'White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1596755094514-f87034a264c1?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 102,
    name: 'Quần dài Kaki Excool co giãn',
    price: 549000,
    rating: 4.8,
    reviews: 256,
    colors: [
      { name: 'Beige', hex: '#f5f5dc', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600' },
      { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 103,
    name: 'Áo Polo Excool - Quick Dry',
    price: 349000,
    originalPrice: 399000,
    rating: 4.7,
    reviews: 512,
    colors: [
      { name: 'Gray', hex: '#808080', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 104,
    name: 'Vớ thể thao Excool kháng khuẩn',
    price: 49000,
    rating: 4.9,
    reviews: 1024,
    colors: [
      { name: 'White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400' },
    ]
  }
]

const runningGearProducts = [
  {
    id: 201,
    name: 'Áo thun chạy bộ Singlet ProRun',
    price: 199000,
    originalPrice: 249000,
    rating: 4.9,
    reviews: 432,
    badge: 'Siêu nhẹ',
    colors: [
      { name: 'Neon', hex: '#ccff00', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600' },
      { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 202,
    name: 'Quần Shorts chạy bộ 2 lớp Fast & Free',
    price: 289000,
    rating: 4.8,
    reviews: 876,
    colors: [
      { name: 'Blue', hex: '#0000ff', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 203,
    name: 'Áo khoác gió chạy bộ UltraLight',
    price: 399000,
    originalPrice: 499000,
    rating: 4.7,
    reviews: 215,
    colors: [
      { name: 'Gray', hex: '#808080', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 204,
    name: 'Mũ thể thao thoáng khí Coolmate',
    price: 129000,
    rating: 4.9,
    reviews: 1540,
    colors: [
      { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
    ]
  }
]

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <CategoryGrid />
      <PromoBanners />
      <PickleballBanner />
      <ProductSection title="Dòng sản phẩm Basics" products={basicsProducts} />
      <ProductSection 
        banner={{
          image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1500",
          title: "EXCOOL",
          cta: "MUA NGAY",
          link: "/collections/excool"
        }} 
        products={excoolProducts} 
      />
      <ProductSection 
        banner={{
          image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1500",
          title: "ĐỒ CHẠY BỘ",
          cta: "KHÁM PHÁ NGAY",
          link: "/collections/running"
        }} 
        products={runningGearProducts} 
      />
      <SocialGrid />
    </main>
  )
}
