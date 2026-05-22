'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, ArrowUpRight, Star, Zap, Shield, Leaf } from 'lucide-react'
import Link from 'next/link'

/* ─── Animation Helpers ────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.1 },
  }),
}

/* ─── Data ─────────────────────────────────────────────── */
const stats = [
  { value: '500K+', label: 'Đơn hàng hoàn thành' },
  { value: '15+', label: 'Cửa hàng trên toàn quốc' },
  { value: '98%', label: 'Khách hàng hài lòng' },
  { value: '6', label: 'Năm kinh nghiệm' },
]

const values = [
  {
    icon: Star,
    title: 'Chất lượng thượng hạng',
    desc: '100% sợi cotton organic cao cấp, kiểm định từng sản phẩm trước khi đến tay khách hàng.',
    color: 'bg-amber-50 text-amber-600',
    border: 'border-amber-200',
  },
  {
    icon: Zap,
    title: 'Đổi mới không ngừng',
    desc: 'Đội ngũ thiết kế cập nhật xu hướng hàng tuần, mang đến bộ sưu tập mới mẻ mỗi mùa.',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-200',
  },
  {
    icon: Shield,
    title: 'Cam kết bảo vệ khách hàng',
    desc: 'Đổi trả linh hoạt 60 ngày, hỗ trợ 24/7, mua sắm an tâm tuyệt đối.',
    color: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-200',
  },
  {
    icon: Leaf,
    title: 'Phát triển bền vững',
    desc: 'Cam kết zero-plastic packaging vào 2027, trồng 1 cây xanh cho mỗi 100 đơn hàng.',
    color: 'bg-lime-50 text-lime-700',
    border: 'border-lime-200',
  },
]

const milestones = [
  { year: '2020', title: 'Ra đời', desc: 'Aura khởi nghiệp từ studio thiết kế 20m² tại Hà Nội với 3 thành viên sáng lập.' },
  { year: '2022', title: 'Bứt phá', desc: 'Vượt mốc 100.000 đơn hàng, ra mắt dòng sản phẩm Organic đầu tiên.' },
  { year: '2024', title: 'Toàn quốc', desc: 'Mở rộng 15 showroom, chạm mốc 500.000 khách hàng trung thành.' },
  { year: '2026', desc: 'Mở rộng thị trường Đông Nam Á, tích hợp AI virtual fitting.', title: 'Vươn tầm' },
]

const team = [
  {
    name: 'Marcus Hoàng',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=500',
    quote: 'Thời trang tốt nên thuộc về tất cả mọi người.',
  },
  {
    name: 'Elena Khánh Linh',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
    quote: 'Mỗi bộ cánh là một câu chuyện chưa kể.',
  },
  {
    name: 'Alex Minh Tú',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500',
    quote: 'Sáng tạo không có điểm dừng, chỉ có điểm tiếp theo.',
  },
]

/* ─── Component ────────────────────────────────────────── */
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══ HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-end pb-20 overflow-hidden">
        {/* Decorative large circle */}
        <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] rounded-full bg-[#f0e8d8] pointer-events-none" />
        <div className="absolute bottom-0 left-[-100px] w-[400px] h-[400px] rounded-full bg-[#e8f0e8]/60 pointer-events-none" />

        {/* Hero Image — parallax */}
        <motion.div
          style={{ y: heroImgY }}
          className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=85&w=900&h=1100"
            alt="Aura Fashion Hero"
            fill
            priority
            className="object-cover object-top"
          />
          {/* soft left fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafaf8] via-[#fafaf8]/30 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full"
        >
          {/* Tag */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2 border border-[#1a1a1a]/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#666] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Câu chuyện thương hiệu
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-tight max-w-2xl mb-8"
          >
            More Than<br />
            <span className="text-primary">A Brand.</span><br />
            A Statement.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-[#555] text-lg max-w-md leading-relaxed mb-10"
          >
            Aura không chỉ bán quần áo. Chúng tôi kiến tạo phong cách sống — tối giản, chất lượng và đầy cá tính cho người Việt hiện đại.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex items-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-primary transition-all duration-300"
            >
              Khám phá ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#story" className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a] flex items-center gap-2 hover:text-primary transition-colors">
              Đọc câu chuyện <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-[#1a1a1a]/40 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Cuộn xuống</span>
        </motion.div>
      </section>

      {/* ═══ STATS STRIP ════════════════════════════════════ */}
      <section className="bg-[#1a1a1a] text-white py-16 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">{s.value}</div>
              <div className="text-sm text-white/60 font-medium uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ STORY / ABOUT SPLIT ════════════════════════════ */}
      <section id="story" className="py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Images collage */}
          <div className="relative h-[560px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="absolute top-0 left-0 w-[68%] h-[75%] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600"
                alt="Aura Studio"
                fill className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30, y: 40 }} whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
              className="absolute bottom-0 right-0 w-[55%] h-[60%] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#fafaf8]"
            >
              <Image
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=500"
                alt="Fashion Design"
                fill className="object-cover"
              />
            </motion.div>
            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }} whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }} transition={{ type: 'spring' as const, stiffness: 150, delay: 0.3 }}
              className="absolute top-[42%] right-[25%] bg-primary text-white rounded-2xl px-5 py-3 shadow-xl z-10"
            >
              <div className="text-2xl font-black">6+</div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Năm kinh nghiệm</div>
            </motion.div>
          </div>

          {/* Right: Text */}
          <div>
            <motion.span
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-primary"
            >
              Về chúng tôi
            </motion.span>

            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="text-4xl md:text-5xl font-black uppercase leading-tight mt-3 mb-6"
            >
              Từ niềm đam mê<br />đến biểu tượng
            </motion.h2>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
              className="space-y-4 text-[#555] leading-relaxed text-base mb-8"
            >
              <p>
                Năm 2020, Aura được sinh ra từ một câu hỏi đơn giản: <em>"Tại sao thời trang chất lượng lại phải đắt đỏ?"</em> Chúng tôi tin rằng mọi người đều xứng đáng được mặc đẹp, tự tin và thoải mái.
              </p>
              <p>
                Bằng cách kiểm soát toàn bộ chuỗi sản xuất — từ nguyên liệu thô đến thành phẩm — Aura cắt giảm chi phí trung gian, mang đến giá trị thực sự cho khách hàng.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-0.5 bg-primary" />
              <span className="text-sm font-black italic text-[#333]">"Chất lượng không phải xa xỉ, đó là quyền của bạn."</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ════════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0e8] px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Hành trình</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-3">Những dấu mốc<br />đáng nhớ</h2>
          </motion.div>

          {/* Timeline horizontal on desktop, vertical on mobile */}
          <div className="relative">
            {/* Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-[#1a1a1a]/15" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                >
                  {/* Dot */}
                  <div className="hidden md:flex items-center mb-6">
                    <motion.div
                      whileInView={{ scale: [0, 1.3, 1] }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="w-4 h-4 rounded-full bg-primary border-4 border-[#f5f0e8] shadow-lg"
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-[#e8e0d0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className="text-3xl font-black text-primary block mb-3">{m.year}</span>
                    <h3 className="text-base font-black uppercase tracking-tight mb-2">{m.title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CORE VALUES ════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Title */}
          <div className="lg:sticky lg:top-32">
            <motion.span
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-primary"
            >
              Giá trị cốt lõi
            </motion.span>
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="text-4xl md:text-5xl font-black uppercase mt-3 mb-6 leading-tight"
            >
              Những gì<br />chúng tôi<br /><span className="text-primary">tin tưởng</span>
            </motion.h2>
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
              className="text-[#666] leading-relaxed max-w-sm"
            >
              Bốn trụ cột tạo nên bản sắc Aura — không phải khẩu hiệu, mà là cam kết hành động thực sự mỗi ngày.
            </motion.p>
          </div>

          {/* Right: Values cards */}
          <div className="space-y-5">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                  className={`group flex gap-5 p-6 rounded-2xl border ${v.border} bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer`}
                >
                  <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base uppercase tracking-tight mb-1.5">{v.title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed">{v.desc}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#ccc] group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0 ml-auto" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0e8] px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          >
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Con người</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase mt-3">Đội ngũ<br />sáng tạo</h2>
            </div>
            <p className="text-[#666] max-w-xs text-sm leading-relaxed">
              Những con người đầy đam mê, sáng tạo và kiên định với sứ mệnh đưa Aura lên tầm cao mới.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-[400px] rounded-3xl overflow-hidden mb-5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/50 transition-all duration-500 flex items-end p-6">
                    <motion.p
                      className="text-white text-sm italic font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed"
                    >
                      "{member.quote}"
                    </motion.p>
                  </div>
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight">{member.name}</h3>
                <span className="text-sm text-primary font-bold">{member.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FOOTER BAND ════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative bg-[#1a1a1a] rounded-3xl overflow-hidden p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10"
          >
            {/* Decorative blob */}
            <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-60px] left-[20%] w-[200px] h-[200px] rounded-full bg-primary/10 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-4">
                Sẵn sàng khám phá<br />
                <span className="text-primary">bộ sưu tập?</span>
              </h2>
              <p className="text-white/60 max-w-sm text-sm leading-relaxed">
                Hàng trăm thiết kế mới cập nhật mỗi tuần. Tìm kiếm phong cách của bạn ngay hôm nay.
              </p>
            </div>

            <Link
              href="/shop"
              className="relative z-10 group flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-2xl shadow-primary/30 hover:scale-105 shrink-0"
            >
              Mua sắm ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
