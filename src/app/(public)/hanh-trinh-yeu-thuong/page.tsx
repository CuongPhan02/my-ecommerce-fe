'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import {
  Heart,
  HandHeart,
  Users,
  MapPin,
  Gift,
  Star,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Shirt,
  Sparkles,
  Globe,
} from 'lucide-react'

/* ─── Animation Presets ─────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 15 } },
}

/* ─── Data ──────────────────────────────────────────────────── */
const IMPACT_STATS = [
  { icon: Users, value: '2,500+', label: 'Người nhận hỗ trợ', accent: '#5c4e43' },
  { icon: Shirt, value: '8,000+', label: 'Bộ quần áo trao tặng', accent: '#5c4e43' },
  { icon: MapPin, value: '12', label: 'Tỉnh thành đã đến', accent: '#5c4e43' },
  { icon: Heart, value: '10%', label: 'Lợi nhuận đóng góp', accent: '#5c4e43' },
]

const CAMPAIGNS = [
  {
    id: 1,
    tag: 'Đang diễn ra',
    tagColor: '#3d7a5c',
    tagBg: '#f0f9f4',
    title: 'Áo Ấm Mùa Đông',
    subtitle: 'Tặng áo ấm cho trẻ em vùng cao',
    description:
      'Mỗi chiếc áo ấm được gửi đến tay các em nhỏ tại các tỉnh vùng núi Tây Bắc, nơi mùa đông giá lạnh có thể xuống dưới 5°C.',
    raised: 75,
    goal: '500 áo',
    current: '375 áo',
    image: '/lune-love-campaign.png',
  },
  {
    id: 2,
    tag: 'Sắp ra mắt',
    tagColor: '#8a6c3e',
    tagBg: '#fdf6ec',
    title: 'Tủ Đồ Yêu Thương',
    subtitle: 'Trao quần áo cũ còn dùng được',
    description:
      'Chương trình thu gom quần áo cũ còn tốt từ khách hàng LUNÉ để trao tặng cho những hoàn cảnh khó khăn tại các mái ấm tình thương.',
    raised: 0,
    goal: '1,000 bộ',
    current: '0 bộ',
    image: '/lune-love-giving.png',
  },
  {
    id: 3,
    tag: 'Đã hoàn thành',
    tagColor: '#5c4e43',
    tagBg: '#f5f0eb',
    title: 'Tết Ấm Áp 2025',
    subtitle: 'Đồng hành cùng trẻ em mồ côi',
    description:
      'Dịp Tết Nguyên Đán 2025, chúng tôi đã trao tặng 1,200 bộ quần áo mới đến 8 mái ấm tình thương trên cả nước.',
    raised: 100,
    goal: '1,200 bộ',
    current: '1,200 bộ',
    image: '/lune-care-banner.png',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Gift,
    title: 'Mua sắm tại LUNÉ',
    desc: '10% lợi nhuận từ mỗi đơn hàng của bạn sẽ tự động được đóng góp vào quỹ Hành Trình Yêu Thương.',
  },
  {
    step: '02',
    icon: HandHeart,
    title: 'Quyên góp trực tiếp',
    desc: 'Bạn có thể gửi quần áo cũ còn dùng được đến điểm thu gom của LUNÉ hoặc đóng góp tiền mặt vào quỹ.',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Chúng tôi thực hiện',
    desc: 'Đội ngũ LUNÉ sẽ kiểm tra, đóng gói và trực tiếp trao tặng đến những người cần được hỗ trợ.',
  },
  {
    step: '04',
    icon: Globe,
    title: 'Minh bạch báo cáo',
    desc: 'Mỗi chiến dịch đều có báo cáo chi tiết về số lượng người nhận, địa điểm và ảnh thực tế trao tặng.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Chị Nguyễn Thị Hoa',
    role: 'Tình nguyện viên',
    content:
      'Tôi rất xúc động khi thấy những nụ cười của các em nhỏ khi nhận được áo mới. Cảm ơn LUNÉ đã tạo ra một cộng đồng tốt đẹp như vậy.',
    stars: 5,
  },
  {
    name: 'Anh Trần Minh Tuấn',
    role: 'Khách hàng thân thiết',
    content:
      'Biết rằng mỗi lần mua hàng tại LUNÉ là mình đang góp phần giúp đỡ người khác, tôi cảm thấy mình mua đúng chỗ và xứng đáng.',
    stars: 5,
  },
  {
    name: 'Em Lý Thị Mơ',
    role: 'Người thụ hưởng, Lào Cai',
    content:
      'Con nhận được áo từ chương trình LUNÉ trước mùa đông. Con rất vui vì áo rất đẹp và ấm. Cảm ơn các cô chú rất nhiều ạ.',
    stars: 5,
  },
]

const FAQ_ITEMS = [
  {
    q: 'Quỹ Hành Trình Yêu Thương hoạt động như thế nào?',
    a: '10% lợi nhuận ròng từ tất cả đơn hàng tại LUNÉ được chuyển vào quỹ. Quỹ được quản lý minh bạch và báo cáo công khai sau mỗi chiến dịch.',
  },
  {
    q: 'Tôi có thể quyên góp quần áo cũ ở đâu?',
    a: 'Bạn có thể gửi quần áo đến địa chỉ showroom LUNÉ hoặc liên hệ hotline để được hướng dẫn gửi bưu kiện. Chúng tôi chấp nhận tất cả quần áo còn dùng được và sạch sẽ.',
  },
  {
    q: 'Làm thế nào để tôi biết đóng góp của mình được sử dụng đúng mục đích?',
    a: 'LUNÉ công bố báo cáo chi tiết sau mỗi chiến dịch, bao gồm số tiền thu được, số người nhận, địa điểm và ảnh/video thực tế. Bạn có thể xem tất cả tại mục Báo cáo trên trang này.',
  },
  {
    q: 'Tôi có thể tham gia tình nguyện không?',
    a: 'Hoàn toàn có thể! Hãy điền vào form đăng ký tình nguyện viên phía dưới hoặc liên hệ trực tiếp với chúng tôi. LUNÉ luôn chào đón những trái tim muốn lan tỏa yêu thương.',
  },
]

/* ─── Components ─────────────────────────────────────────────── */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className='w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden'>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        className='h-full rounded-full bg-[#5c4e43]'
      />
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-neutral-200 py-5'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-start justify-between gap-4 text-left group'
        aria-expanded={open}
      >
        <span className='text-sm font-bold text-black group-hover:text-[#5c4e43] transition-colors leading-snug'>
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#5c4e43] flex-shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 mt-3' : 'max-h-0'}`}
      >
        <p className='text-xs text-neutral-500 font-medium leading-relaxed'>{a}</p>
      </div>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function HanhTrinhYeuThuongPage() {
  return (
    <main className='bg-white text-black overflow-x-hidden'>

      {/* ═══ 1. HERO BANNER ═══════════════════════════════════ */}
      <section className='relative h-[650px] md:h-[780px] flex items-center overflow-hidden bg-[#EDE8E3]'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/lune-love-hero.png'
            alt='LUNÉ - Hành Trình Yêu Thương'
            fill
            priority
            className='object-cover object-center'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent z-10' />
        </div>

        <div className='main-container mx-auto px-6 md:px-16 w-full relative z-20 text-white'>
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='max-w-xl md:max-w-2xl space-y-7 text-left'
          >
            {/* Top Tag */}
            <div className='flex items-center gap-3'>
              <Heart className='w-3.5 h-3.5 text-white/70 fill-white/70' />
              <span className='text-[10px] font-black uppercase tracking-[0.25em] text-white/80'>
                LUNÉ CARES — Từ Thiện & Cộng Đồng
              </span>
            </div>

            {/* Title */}
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight leading-[1.1]'>
              Hành Trình<br />
              Yêu Thương
            </h1>

            {/* Divider */}
            <div className='h-0.5 w-14 bg-white/50' />

            {/* Description */}
            <p className='text-xs md:text-sm text-white/85 font-semibold leading-relaxed max-w-lg'>
              Mỗi chiếc áo bạn mua tại LUNÉ không chỉ là thời trang — đó còn là một hành động yêu thương. 
              10% lợi nhuận từ mỗi đơn hàng được dành cho những người cần sự giúp đỡ nhất.
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-wrap gap-4 pt-2'>
              <a
                href='#campaigns'
                className='bg-white text-black hover:bg-neutral-100 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-colors rounded-sm shadow-md'
              >
                Xem chiến dịch
              </a>
              <a
                href='#tham-gia'
                className='border border-white hover:bg-white hover:text-black text-white px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-sm'
              >
                Tham gia cùng chúng tôi
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-1.5'>
          <span className='text-[9px] font-bold uppercase tracking-[0.2em]'>Cuộn xuống</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className='w-4 h-4' />
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. MISSION STRIP ════════════════════════════════ */}
      <section className='bg-[#231f20] py-12 px-6 md:px-16'>
        <div className='max-w-[1400px] mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-center md:text-left'
          >
            <div className='flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center'>
              <Heart className='w-4 h-4 text-white fill-white' />
            </div>
            <p className='text-white/90 text-sm font-medium leading-relaxed max-w-2xl'>
              <span className='font-black text-white'>Cam kết của LUNÉ:</span>{' '}
              Mỗi năm, chúng tôi đặt mục tiêu trao tặng ít nhất <span className='text-white font-black'>10,000 bộ quần áo</span> đến những 
              người có hoàn cảnh khó khăn trên khắp Việt Nam — một hành trình được xây dựng từ tình yêu thương 
              của mỗi khách hàng.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3. IMPACT STATS ══════════════════════════════════ */}
      <section className='py-20 bg-[#FBF8F3] border-t border-b border-neutral-200/30 px-6 md:px-16'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='flex items-center justify-center gap-6 mb-14'>
            <span className='h-px bg-neutral-200 flex-1 hidden md:block' />
            <h2 className='text-base font-black uppercase tracking-widest text-[#231f20] whitespace-nowrap'>
              Con số ý nghĩa
            </h2>
            <span className='h-px bg-neutral-200 flex-1 hidden md:block' />
          </div>

          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='grid grid-cols-2 lg:grid-cols-4 gap-5'
          >
            {IMPACT_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className='bg-white p-7 border border-neutral-200/40 rounded-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow'
              >
                <div className='w-11 h-11 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#5c4e43]'>
                  <stat.icon className='w-5 h-5 stroke-[1.3]' />
                </div>
                <span className='text-2xl md:text-3xl font-heading font-black text-black'>{stat.value}</span>
                <p className='text-[10px] text-neutral-400 font-bold uppercase tracking-wider'>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. STORY SECTION ════════════════════════════════ */}
      <section className='py-24 bg-white px-6 md:px-16'>
        <div className='max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center'>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='lg:col-span-6 aspect-square relative rounded-sm overflow-hidden bg-neutral-50 border border-neutral-100'
          >
            <Image
              src='/lune-love-giving.png'
              alt='LUNÉ - Trao tặng yêu thương'
              fill
              className='object-cover'
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='lg:col-span-6 space-y-6'
          >
            <span className='text-[10px] font-black uppercase tracking-widest text-[#5c4e43]'>
              Câu chuyện của chúng tôi
            </span>
            <h2 className='text-3xl md:text-4xl font-heading font-black text-black uppercase tracking-tight'>
              Thời Trang<br />Gắn Với Trách Nhiệm
            </h2>
            <div className='h-0.5 w-12 bg-black' />

            <div className='space-y-4 text-xs md:text-sm text-neutral-600 font-medium leading-relaxed'>
              <p>
                LUNÉ không chỉ là một thương hiệu thời trang — chúng tôi tin rằng mỗi sản phẩm được tạo ra 
                đều có thể mang theo một sứ mệnh tốt đẹp hơn.
              </p>
              <p>
                Từ khi thành lập, chúng tôi đã dành 10% lợi nhuận ròng cho các hoạt động thiện nguyện. 
                Hành Trình Yêu Thương là nơi chúng tôi hiện thực hóa cam kết đó thành những hành động 
                cụ thể và minh bạch.
              </p>
              <p>
                Mỗi chiếc áo bạn mua, mỗi sản phẩm bạn lựa chọn — đều là một phần trong hành trình 
                lan tỏa yêu thương mà chúng ta cùng nhau tạo dựng.
              </p>
            </div>

            <div className='pt-2 flex items-center gap-3'>
              <CheckCircle2 className='w-4 h-4 text-[#3d7a5c] flex-shrink-0' />
              <span className='text-xs text-neutral-600 font-semibold'>Báo cáo minh bạch sau mỗi chiến dịch</span>
            </div>
            <div className='flex items-center gap-3'>
              <CheckCircle2 className='w-4 h-4 text-[#3d7a5c] flex-shrink-0' />
              <span className='text-xs text-neutral-600 font-semibold'>Giao hàng trực tiếp đến tay người nhận</span>
            </div>
            <div className='flex items-center gap-3'>
              <CheckCircle2 className='w-4 h-4 text-[#3d7a5c] flex-shrink-0' />
              <span className='text-xs text-neutral-600 font-semibold'>Có mặt tại 12 tỉnh thành trên cả nước</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 5. CAMPAIGNS SECTION ═══════════════════════════ */}
      <section id='campaigns' className='py-20 bg-[#FBF8F3] border-t border-neutral-200/30 px-6 md:px-16'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='flex items-center justify-center gap-6 mb-14'>
            <span className='h-px bg-neutral-200 flex-1 hidden md:block' />
            <h2 className='text-base font-black uppercase tracking-widest text-[#231f20] whitespace-nowrap'>
              Các chiến dịch
            </h2>
            <span className='h-px bg-neutral-200 flex-1 hidden md:block' />
          </div>

          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {CAMPAIGNS.map((c) => (
              <motion.div
                key={c.id}
                variants={itemVariants}
                className='bg-white border border-neutral-200/40 rounded-sm overflow-hidden group hover:shadow-lg transition-all duration-300'
              >
                {/* Image */}
                <div className='relative h-52 overflow-hidden'>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
                  {/* Tag */}
                  <span
                    className='absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full'
                    style={{ color: c.tagColor, backgroundColor: c.tagBg }}
                  >
                    {c.tag}
                  </span>
                </div>

                {/* Content */}
                <div className='p-6 space-y-4'>
                  <div>
                    <p className='text-[10px] font-black uppercase tracking-widest text-[#5c4e43] mb-1'>
                      {c.subtitle}
                    </p>
                    <h3 className='font-heading font-black text-lg text-black uppercase'>{c.title}</h3>
                  </div>
                  <p className='text-[11px] text-neutral-500 font-medium leading-relaxed'>{c.description}</p>

                  {/* Progress */}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-[10px] font-bold text-neutral-500'>
                      <span>Đã đạt: {c.current}</span>
                      <span>Mục tiêu: {c.goal}</span>
                    </div>
                    <ProgressBar value={c.raised} />
                    <p className='text-right text-[10px] font-black text-[#5c4e43]'>{c.raised}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 6. HOW IT WORKS ═════════════════════════════════ */}
      <section id='tham-gia' className='py-24 bg-white px-6 md:px-16'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='text-center mb-16 space-y-3'>
            <span className='text-[10px] font-black uppercase tracking-widest text-[#5c4e43]'>
              Cách thức
            </span>
            <h2 className='text-3xl md:text-4xl font-heading font-black text-black uppercase tracking-tight'>
              Bạn Có Thể Tham Gia<br />Như Thế Nào?
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'
          >
            {HOW_IT_WORKS.map((step) => (
              <motion.div key={step.step} variants={itemVariants} className='flex flex-col items-center text-center space-y-4'>
                <span className='text-[10px] font-black text-neutral-300'>{step.step}</span>
                <div className='w-14 h-14 bg-[#FBF8F3] border border-neutral-200/50 rounded-full flex items-center justify-center text-[#5c4e43]'>
                  <step.icon className='w-5 h-5 stroke-[1.2]' />
                </div>
                <h3 className='font-heading font-black text-sm uppercase tracking-wider text-black'>
                  {step.title}
                </h3>
                <p className='text-[11px] text-neutral-500 font-semibold leading-relaxed max-w-[200px]'>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 7. DARK CTA BANNER ═══════════════════════════════ */}
      <section className='relative py-24 bg-[#231f20] overflow-hidden px-6 md:px-16'>
        <div className='absolute inset-0 opacity-10'>
          <Image src='/lune-about-dark-banner.png' alt='' fill className='object-cover' />
        </div>
        <div className='max-w-[1400px] mx-auto relative z-10 text-center text-white'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='space-y-7 max-w-xl mx-auto'
          >
            <div className='flex items-center justify-center gap-3'>
              <span className='h-px w-8 bg-white/30' />
              <Heart className='w-4 h-4 text-white/60 fill-white/40' />
              <span className='h-px w-8 bg-white/30' />
            </div>
            <h2 className='text-3xl md:text-4xl font-heading font-black uppercase tracking-tight'>
              Cùng Nhau Lan Tỏa<br />Yêu Thương
            </h2>
            <p className='text-sm text-white/70 font-medium leading-relaxed'>
              Bắt đầu bằng một đơn hàng, tiếp nối bằng một hành động — hãy cùng LUNÉ 
              xây dựng một cộng đồng thời trang có trách nhiệm.
            </p>
            <div className='flex flex-wrap justify-center gap-4 pt-2'>
              <Link
                href='/shop'
                className='bg-white text-black hover:bg-neutral-100 px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-colors rounded-sm inline-flex items-center gap-2'
              >
                Mua sắm ngay <ArrowRight className='w-3.5 h-3.5' />
              </Link>
              <a
                href='mailto:hello@lune.vn'
                className='border border-white/40 hover:border-white text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-sm'
              >
                Liên hệ tình nguyện
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 8. TESTIMONIALS ════════════════════════════════ */}
      <section className='py-20 bg-[#FBF8F3] border-t border-b border-neutral-200/30 px-6 md:px-16'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='flex items-center justify-center gap-6 mb-14'>
            <span className='h-px bg-neutral-200 flex-1 hidden md:block' />
            <h2 className='text-base font-black uppercase tracking-widest text-[#231f20] whitespace-nowrap'>
              Chia sẻ từ cộng đồng
            </h2>
            <span className='h-px bg-neutral-200 flex-1 hidden md:block' />
          </div>

          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='grid grid-cols-1 md:grid-cols-3 gap-6'
          >
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={itemVariants}
                className='bg-white p-7 border border-neutral-200/40 rounded-sm space-y-4 hover:shadow-md transition-shadow'
              >
                {/* Stars */}
                <div className='flex gap-0.5'>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className='w-3 h-3 fill-[#5c4e43] text-[#5c4e43]' />
                  ))}
                </div>
                <p className='text-xs text-neutral-600 font-medium leading-relaxed italic'>
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className='pt-1 border-t border-neutral-100'>
                  <p className='text-xs font-black text-black'>{t.name}</p>
                  <p className='text-[10px] text-[#5c4e43] font-bold uppercase tracking-wide mt-0.5'>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 9. FAQ SECTION ══════════════════════════════════ */}
      <section className='py-20 bg-white px-6 md:px-16'>
        <div className='max-w-[860px] mx-auto'>
          <div className='text-center mb-14 space-y-3'>
            <span className='text-[10px] font-black uppercase tracking-widest text-[#5c4e43]'>
              Câu hỏi thường gặp
            </span>
            <h2 className='text-3xl md:text-4xl font-heading font-black text-black uppercase tracking-tight'>
              Bạn Muốn Biết Thêm?
            </h2>
          </div>

          <div>
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 10. REGISTER VOLUNTEER ══════════════════════════ */}
      <section className='py-20 bg-[#FBF8F3] border-t border-neutral-200/30 px-6 md:px-16'>
        <div className='max-w-[600px] mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            <span className='text-[10px] font-black uppercase tracking-widest text-[#5c4e43]'>
              Tình nguyện viên
            </span>
            <h2 className='text-3xl md:text-4xl font-heading font-black text-black uppercase tracking-tight'>
              Đăng Ký<br />Tham Gia Cùng Chúng Tôi
            </h2>
            <p className='text-xs text-neutral-500 font-medium leading-relaxed'>
              Để lại thông tin và chúng tôi sẽ liên hệ với bạn khi có chiến dịch tiếp theo.
            </p>

            <form className='space-y-3 text-left pt-2' onSubmit={(e) => e.preventDefault()}>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-neutral-600'>
                    Họ và tên
                  </label>
                  <input
                    type='text'
                    placeholder='Nguyễn Văn A'
                    className='w-full border border-neutral-200 bg-white px-4 py-3 text-xs font-medium text-black placeholder:text-neutral-300 focus:outline-none focus:border-[#5c4e43] transition-colors rounded-sm'
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-neutral-600'>
                    Số điện thoại
                  </label>
                  <input
                    type='tel'
                    placeholder='0901 234 567'
                    className='w-full border border-neutral-200 bg-white px-4 py-3 text-xs font-medium text-black placeholder:text-neutral-300 focus:outline-none focus:border-[#5c4e43] transition-colors rounded-sm'
                  />
                </div>
              </div>
              <div className='space-y-1.5'>
                <label className='text-[10px] font-black uppercase tracking-widest text-neutral-600'>
                  Email
                </label>
                <input
                  type='email'
                  placeholder='email@example.com'
                  className='w-full border border-neutral-200 bg-white px-4 py-3 text-xs font-medium text-black placeholder:text-neutral-300 focus:outline-none focus:border-[#5c4e43] transition-colors rounded-sm'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-[10px] font-black uppercase tracking-widest text-neutral-600'>
                  Lời nhắn (tuỳ chọn)
                </label>
                <textarea
                  placeholder='Tôi muốn tham gia vì...'
                  rows={3}
                  className='w-full border border-neutral-200 bg-white px-4 py-3 text-xs font-medium text-black placeholder:text-neutral-300 focus:outline-none focus:border-[#5c4e43] transition-colors rounded-sm resize-none'
                />
              </div>
              <button
                type='submit'
                className='w-full bg-[#231f20] hover:bg-[#5c4e43] text-white py-4 text-xs font-black uppercase tracking-widest transition-colors rounded-sm flex items-center justify-center gap-2'
              >
                <Heart className='w-3.5 h-3.5 fill-white' />
                Đăng ký tình nguyện
              </button>
            </form>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
