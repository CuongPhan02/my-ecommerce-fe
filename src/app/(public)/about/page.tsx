'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { 
  ArrowRight, 
  Award, 
  Lightbulb, 
  Leaf, 
  Heart, 
  PenTool, 
  Layers, 
  Scissors, 
  Search, 
  Box, 
  Users, 
  Shirt, 
  MapPin, 
  HeartHandshake, 
  FileText, 
  BadgeCheck, 
  Linkedin 
} from 'lucide-react'
import Link from 'next/link'

/* ─── Animation Presets ────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 15 } },
}

export default function AboutPage() {
  return (
    <main className="bg-white text-black overflow-x-hidden">
      
      {/* ═══ 1. HERO BANNER SECTION ═════════════════════════ */}
      <section className="relative h-[650px] md:h-[750px] flex items-center bg-[#eaeaea] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/lune-about-hero.png"
            alt="LUNÉ Brand Campaign"
            fill
            priority
            className="object-cover object-center md:object-[center_20%]"
          />
          {/* Left dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent z-10" />
        </div>

        {/* Content */}
        <div className="main-container mx-auto px-6 md:px-16 w-full relative z-20 text-white">
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-xl md:max-w-2xl space-y-6 text-left"
          >
            {/* Top Tag */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">EST. 2025</span>
              <span className="h-px w-8 bg-white/50" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight leading-[1.15]">
              Chúng Tôi Tin Rằng<br />
              Thời Trang Là Cách Kể<br />
              Một Câu Chuyện
            </h1>

            {/* Paragraph */}
            <p className="text-xs md:text-sm text-white/85 font-semibold leading-relaxed max-w-lg">
              Chúng tôi không chỉ tạo ra những sản phẩm để mặc. Chúng tôi tạo ra những thiết kế giúp mỗi người tự tin hơn, thể hiện cá tính riêng và lan tỏa những giá trị tích cực đến cộng đồng.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/shop"
                className="bg-white text-black hover:bg-neutral-100 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-colors rounded-sm shadow-md"
              >
                Khám phá bộ sưu tập
              </Link>
              <a
                href="#story"
                className="border border-white hover:bg-white hover:text-black text-white px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-sm"
              >
                Xem hành trình thương hiệu
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. BRAND STORY SECTION ═════════════════════════ */}
      <section id="story" className="py-24 bg-white px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Image */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 aspect-square relative rounded-sm overflow-hidden bg-neutral-50 border border-neutral-100"
          >
            <Image
              src="/lune-about-story.png"
              alt="LUNÉ Design Studio"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right Column: Text */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#5c4e43]">
              Câu chuyện thương hiệu
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-black uppercase tracking-tight">
              Hành Trình Bắt Đầu<br />Từ Niềm Đam Mê
            </h2>
            <div className="h-0.5 w-12 bg-black" />
            
            <div className="space-y-4 text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
              <p>
                LUNÉ được thành lập với mong muốn mang đến những sản phẩm thời trang tối giản, chất lượng và bền vững.
              </p>
              <p>
                Từ những bản thiết kế đầu tiên đến từng sản phẩm hiện tại, chúng tôi luôn đặt trải nghiệm khách hàng và chất lượng lên hàng đầu.
              </p>
              <p>
                Mỗi sản phẩm không chỉ là một món đồ thời trang mà còn là kết quả của sự sáng tạo, tỉ mỉ và tâm huyết.
              </p>
            </div>

            {/* Signature */}
            <div className="pt-4">
              <span className="text-xl font-medium tracking-wide italic text-[#5c4e43] font-serif">
                Luné Team
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3. CORE VALUES SECTION ═════════════════════════ */}
      <section className="py-20 bg-[#FBF8F3] border-t border-b border-neutral-200/25 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          {/* Centered title with horizontal lines */}
          <div className="flex items-center justify-center gap-6 mb-16">
            <span className="h-px bg-neutral-200 flex-1 hidden md:block" />
            <h2 className="text-base font-black uppercase tracking-widest text-[#231f20] whitespace-nowrap">
              Giá trị cốt lõi
            </h2>
            <span className="h-px bg-neutral-200 flex-1 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Value 1 */}
            <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 bg-white rounded-full border border-[#e8dfd5]/60 flex items-center justify-center text-[#5c4e43] shadow-xs">
                <Award className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-black">Chất lượng</h3>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed max-w-xs">
                Nguyên liệu được tuyển chọn kỹ lưỡng, đảm bảo sự thoải mái và độ bền.
              </p>
            </div>

            {/* Value 2 */}
            <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 bg-white rounded-full border border-[#e8dfd5]/60 flex items-center justify-center text-[#5c4e43] shadow-xs">
                <Lightbulb className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-black">Sáng tạo</h3>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed max-w-xs">
                Liên tục đổi mới để mang đến những thiết kế hiện đại và khác biệt.
              </p>
            </div>

            {/* Value 3 */}
            <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 bg-white rounded-full border border-[#e8dfd5]/60 flex items-center justify-center text-[#5c4e43] shadow-xs">
                <Leaf className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-black">Bền vững</h3>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed max-w-xs">
                Ưu tiên quy trình sản xuất thân thiện với môi trường và có trách nhiệm.
              </p>
            </div>

            {/* Value 4 */}
            <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 bg-white rounded-full border border-[#e8dfd5]/60 flex items-center justify-center text-[#5c4e43] shadow-xs">
                <Heart className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-black">Cộng đồng</h3>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed max-w-xs">
                10% lợi nhuận được dành cho các hoạt động thiện nguyện và hỗ trợ cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. PRODUCT CREATION PROCESS SECTION ════════════ */}
      <section className="py-24 bg-white px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-base font-black uppercase tracking-widest text-[#231f20] mb-16">
            Quy trình tạo nên một sản phẩm
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black text-neutral-400">01</span>
              <div className="w-14 h-14 bg-[#FBF8F3] border border-neutral-200/50 rounded-full flex items-center justify-center text-[#5c4e43] z-10 relative">
                <Lightbulb className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-[11px] uppercase tracking-wider text-black">Ý tưởng</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed max-w-[150px]">
                Nghiên cứu xu hướng và lắng nghe nhu cầu khách hàng
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black text-neutral-400">02</span>
              <div className="w-14 h-14 bg-[#FBF8F3] border border-neutral-200/50 rounded-full flex items-center justify-center text-[#5c4e43] z-10 relative">
                <PenTool className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-[11px] uppercase tracking-wider text-black">Thiết kế</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed max-w-[150px]">
                Phác thảo và hoàn thiện bản thiết kế
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black text-neutral-400">03</span>
              <div className="w-14 h-14 bg-[#FBF8F3] border border-neutral-200/50 rounded-full flex items-center justify-center text-[#5c4e43] z-10 relative">
                <Layers className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-[11px] uppercase tracking-wider text-black">Lựa chọn chất liệu</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed max-w-[150px]">
                Chọn lọc chất liệu cao cấp, thân thiện môi trường
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black text-neutral-400">04</span>
              <div className="w-14 h-14 bg-[#FBF8F3] border border-neutral-200/50 rounded-full flex items-center justify-center text-[#5c4e43] z-10 relative">
                <Scissors className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-[11px] uppercase tracking-wider text-black">Sản xuất</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed max-w-[150px]">
                Quy trình sản xuất tỉ mỉ tại các xưởng đối tác uy tín
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black text-neutral-400">05</span>
              <div className="w-14 h-14 bg-[#FBF8F3] border border-neutral-200/50 rounded-full flex items-center justify-center text-[#5c4e43] z-10 relative">
                <Search className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-[11px] uppercase tracking-wider text-black">Kiểm tra chất lượng</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed max-w-[150px]">
                Kiểm tra kỹ lưỡng trước khi đến tay khách hàng
              </p>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black text-neutral-400">06</span>
              <div className="w-14 h-14 bg-[#FBF8F3] border border-neutral-200/50 rounded-full flex items-center justify-center text-[#5c4e43] z-10 relative">
                <Box className="w-5 h-5 stroke-[1.2]" />
              </div>
              <h3 className="font-heading font-black text-[11px] uppercase tracking-wider text-black">Đến tay khách hàng</h3>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed max-w-[150px]">
                Đóng gói chỉn chu và giao hàng nhanh chóng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. NUMBERS SECTION (NHỮNG CON SỐ BIẾT NÓI) ═════ */}
      <section className="py-20 bg-[#FBF8F3] border-t border-b border-neutral-200/25 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-base font-black uppercase tracking-widest text-[#231f20] mb-12">
            Những con số biết nói
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 border border-neutral-200/35 rounded-sm flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#5c4e43]">
                <Users className="w-5 h-5 stroke-[1.2]" />
              </div>
              <span className="text-2xl font-heading font-black text-black">10.000+</span>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Khách hàng đã tin tưởng</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 border border-neutral-200/35 rounded-sm flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#5c4e43]">
                <Shirt className="w-5 h-5 stroke-[1.2]" />
              </div>
              <span className="text-2xl font-heading font-black text-black">500+</span>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Sản phẩm đã ra mắt</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 border border-neutral-200/35 rounded-sm flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#5c4e43]">
                <MapPin className="w-5 h-5 stroke-[1.2]" />
              </div>
              <span className="text-2xl font-heading font-black text-black">20+</span>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Tỉnh thành đã phục vụ</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 border border-neutral-200/35 rounded-sm flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#5c4e43]">
                <Heart className="w-5 h-5 stroke-[1.2]" />
              </div>
              <span className="text-2xl font-heading font-black text-black">10%</span>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Lợi nhuận cho cộng đồng</p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 border border-neutral-200/35 rounded-sm flex flex-col items-center text-center space-y-3 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#5c4e43]">
                <HeartHandshake className="w-5 h-5 stroke-[1.2]" />
              </div>
              <span className="text-2xl font-heading font-black text-black">50+</span>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Hoạt động thiện nguyện</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. TEAM SECTION (ĐỘI NGŨ CỦA CHÚNG TÔI) ═════════ */}
      <section className="py-24 bg-white px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-base font-black uppercase tracking-widest text-[#231f20]">
            Đội ngũ của chúng tôi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Member 1 */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-sm overflow-hidden bg-neutral-100 border border-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=600"
                alt="Đức Anh"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="text-left space-y-1.5">
              <h3 className="font-heading font-black text-base uppercase tracking-tight text-black">Đức Anh</h3>
              <p className="text-xs font-bold text-[#5c4e43] uppercase tracking-wider">CEO & Founder</p>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                Tầm nhìn chiến lược và định hướng phát triển thương hiệu bền vững.
              </p>
              <div className="pt-2">
                <a href="#" className="inline-block text-neutral-400 hover:text-black transition-colors">
                  <Linkedin className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Member 2 */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-sm overflow-hidden bg-neutral-100 border border-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=600"
                alt="Thu Hà"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="text-left space-y-1.5">
              <h3 className="font-heading font-black text-base uppercase tracking-tight text-black">Thu Hà</h3>
              <p className="text-xs font-bold text-[#5c4e43] uppercase tracking-wider">Creative Director</p>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                Định hình phong cách và truyền tải câu chuyện thương hiệu.
              </p>
              <div className="pt-2">
                <a href="#" className="inline-block text-neutral-400 hover:text-black transition-colors">
                  <Linkedin className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Member 3 */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-sm overflow-hidden bg-neutral-100 border border-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=600"
                alt="Linh Chi"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="text-left space-y-1.5">
              <h3 className="font-heading font-black text-base uppercase tracking-tight text-black">Linh Chi</h3>
              <p className="text-xs font-bold text-[#5c4e43] uppercase tracking-wider">Fashion Designer</p>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                Sáng tạo nên những thiết kế tinh tế và đầy cảm hứng.
              </p>
              <div className="pt-2">
                <a href="#" className="inline-block text-neutral-400 hover:text-black transition-colors">
                  <Linkedin className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Member 4 */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-sm overflow-hidden bg-neutral-100 border border-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=600"
                alt="Minh Quân"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="text-left space-y-1.5">
              <h3 className="font-heading font-black text-base uppercase tracking-tight text-black">Minh Quân</h3>
              <p className="text-xs font-bold text-[#5c4e43] uppercase tracking-wider">Community Manager</p>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                Kết nối cộng đồng và triển khai các hoạt động thiện nguyện.
              </p>
              <div className="pt-2">
                <a href="#" className="inline-block text-neutral-400 hover:text-black transition-colors">
                  <Linkedin className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. CAM KẾT MINH BẠCH (TRANSPARENCY COMMITMENT) ══ */}
      <section className="py-20 bg-[#FAF6F0] px-6 md:px-16 border-t border-b border-neutral-200/25">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Image */}
            <div className="lg:col-span-5 aspect-[4/3] relative rounded-sm overflow-hidden border border-[#e8dfd5]/60 bg-neutral-150">
              <Image
                src="/lune-about-box.png"
                alt="LUNÉ Box Packaging"
                fill
                className="object-cover"
              />
            </div>

            {/* Right Column: Info */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-xl font-heading font-black uppercase tracking-wider text-black">
                Cam kết minh bạch
              </h2>
              <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                Chúng tôi công khai các hoạt động thiện nguyện, các khoản đóng góp và những giá trị mà cộng đồng đã cùng nhau tạo ra. Khách hàng không chỉ là người mua sản phẩm mà còn là người đồng hành trên hành trình lan tỏa những điều tốt đẹp.
              </p>

              {/* Bullet Points */}
              <div className="space-y-4 pt-4 border-t border-neutral-200/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5c4e43] border border-[#e8dfd5]/60">
                    <FileText className="w-4 h-4 stroke-[1.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                    Minh bạch thông tin / Công khai báo cáo định kỳ
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5c4e43] border border-[#e8dfd5]/60">
                    <BadgeCheck className="w-4 h-4 stroke-[1.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                    Sản phẩm chất lượng / Đảm bảo đúng cam kết
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5c4e43] border border-[#e8dfd5]/60">
                    <HeartHandshake className="w-4 h-4 stroke-[1.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                    Đồng hành dài lâu / Cùng nhau tạo nên thay đổi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. CTA FOOTER BAND ═════════════════════════════ */}
      <section className="relative h-[400px] md:h-[450px] flex items-center bg-[#1a1a1a] overflow-hidden text-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/lune-about-dark-banner.png"
            alt="LUNÉ Dark Campaign Footer"
            fill
            className="object-cover opacity-60"
          />
          {/* Dark solid overlay */}
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        {/* Content */}
        <div className="main-container mx-auto px-6 w-full relative z-20 text-white flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl md:max-w-2xl space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight leading-snug">
              Mỗi Sản Phẩm Bạn Chọn<br />
              Là Một Giá Trị Được Lan Tỏa
            </h2>
            <p className="text-xs md:text-sm text-white/80 font-semibold leading-relaxed max-w-lg mx-auto">
              Cảm ơn bạn đã đồng hành cùng chúng tôi trên hành trình xây dựng một thương hiệu thời trang mang giá trị cho cộng đồng.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link
                href="/shop"
                className="bg-white text-black hover:bg-neutral-100 px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-colors rounded-sm shadow-md"
              >
                Mua sắm ngay
              </Link>
              <Link
                href="/"
                className="border border-white hover:bg-white hover:text-black text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-sm"
              >
                Khám phá story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
