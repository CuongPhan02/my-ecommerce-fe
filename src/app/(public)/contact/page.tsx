'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Phone, Mail, MapPin, Clock, ArrowRight, Send, CheckCircle2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────── */
type Branch = 'hanoi' | 'hcm'
type FormData = { name: string; email: string; phone: string; topic: string; message: string }

/* ─── Static data ─────────────────────────────────────────── */
const contactCards = [
  {
    icon: Phone,
    label: 'Hotline hỗ trợ',
    value: '1900.272.737',
    sub: 'Thứ 2 – CN | 08:00 – 22:00',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    hoverBorder: 'hover:border-amber-300',
  },
  {
    icon: Mail,
    label: 'Hộp thư điện tử',
    value: 'hello@aurafashion.vn',
    sub: 'Phản hồi trong 12 giờ làm việc',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
  },
  {
    icon: MapPin,
    label: 'Trụ sở chính',
    value: 'Hoài Đức, Hà Nội',
    sub: 'Tòa nhà BMM, KCN Lại Yên',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
  },
]

const branches: Record<Branch, { name: string; address: string; phone: string; hours: string; mapLabel: string }> = {
  hanoi: {
    name: 'Chi nhánh Hà Nội',
    address: 'B2-R4, Tầng B2, Vincom Center, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',
    phone: '024.7777.2737',
    hours: '08:30 – 22:00 hàng ngày',
    mapLabel: 'HN',
  },
  hcm: {
    name: 'Chi nhánh TP. Hồ Chí Minh',
    address: 'Lô C3, Đường D2, KCN Cát Lái, Thạnh Mỹ Lợi, TP. Thủ Đức',
    phone: '028.7777.2737',
    hours: '08:30 – 21:30 hàng ngày',
    mapLabel: 'HCM',
  },
}

const faqs = [
  { q: 'Tôi có thể đổi/trả sản phẩm không?', a: 'Aura hỗ trợ đổi trả trong vòng 60 ngày từ ngày nhận hàng, miễn phí vận chuyển đổi trả lần đầu.' },
  { q: 'Mất bao lâu để giao hàng?', a: 'Hà Nội & TP. HCM: 1-2 ngày. Tỉnh thành khác: 2-4 ngày làm việc. Giao nhanh 4 giờ khả dụng tại Hà Nội.' },
  { q: 'Aura có ship quốc tế không?', a: 'Hiện tại chúng tôi đang thử nghiệm ship sang Singapore và Thái Lan, dự kiến mở rộng toàn Đông Nam Á năm 2027.' },
  { q: 'Sản phẩm Aura được làm từ chất liệu gì?', a: '100% sợi cotton organic và polyester tái chế từ chai nhựa, được chứng nhận OEKO-TEX® Standard 100.' },
]

const topics = ['Đơn hàng & Vận chuyển', 'Sản phẩm & Size', 'Đổi trả & Hoàn tiền', 'Hợp tác thương hiệu', 'Khác']

/* ─── Animation variant ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.08 },
  }),
}

/* ─── Component ─────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', topic: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [activeBranch, setActiveBranch] = useState<Branch>('hanoi')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
      setForm({ name: '', email: '', phone: '', topic: '', message: '' })
      setTimeout(() => setDone(false), 6000)
    }, 2000)
  }

  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] overflow-x-hidden">

      {/* ═══ HERO ══════════════════════════════════════════ */}
      <section className="relative pt-24 pb-20 px-6 md:px-16 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f0e8d8] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#e8f0e8]/70 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Tag */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 border border-[#1a1a1a]/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#666] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Liên hệ với chúng tôi
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-tight"
            >
              Chúng tôi<br />
              <span className="text-primary">luôn ở đây</span><br />
              lắng nghe.
            </motion.h1>

            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="max-w-sm"
            >
              <p className="text-[#555] text-base leading-relaxed mb-6">
                Dù bạn có câu hỏi về đơn hàng, sản phẩm hay muốn hợp tác — đội ngũ Aura sẵn sàng hỗ trợ bạn 24/7.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-0.5 bg-primary" />
                <span className="text-sm text-[#999] font-medium">Phản hồi trong vòng 2 giờ</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CARDS ══════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.label}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className={`group p-7 rounded-2xl border ${c.border} ${c.hoverBorder} bg-white hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#999] mb-1">{c.label}</p>
                <p className="text-lg font-black text-[#1a1a1a] mb-1 group-hover:text-primary transition-colors">{c.value}</p>
                <p className="text-xs text-[#999]">{c.sub}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══ MAIN: FORM + MAP ═══════════════════════════════ */}
      <section className="px-6 md:px-16 pb-32">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="bg-white border border-[#e8e0d0] rounded-3xl p-8 md:p-10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Gửi lời nhắn</h2>
                  <p className="text-xs text-[#999] mt-0.5">Điền thông tin để chúng tôi liên hệ lại</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-3">Đã nhận được!</h3>
                    <p className="text-[#666] text-sm max-w-xs leading-relaxed">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 1 }}
                  >
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-[#666] mb-2">
                          Họ và tên <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Nguyễn Văn A"
                          className="w-full border border-[#e0d8cc] rounded-xl px-4 py-3.5 text-sm font-medium placeholder-[#bbb] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-[#fafaf8]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-[#666] mb-2">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="email@example.com"
                          className="w-full border border-[#e0d8cc] rounded-xl px-4 py-3.5 text-sm font-medium placeholder-[#bbb] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-[#fafaf8]"
                        />
                      </div>
                    </div>

                    {/* Phone + Topic row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-[#666] mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="0912 345 678"
                          className="w-full border border-[#e0d8cc] rounded-xl px-4 py-3.5 text-sm font-medium placeholder-[#bbb] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-[#fafaf8]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-[#666] mb-2">
                          Chủ đề
                        </label>
                        <select
                          value={form.topic}
                          onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                          className="w-full border border-[#e0d8cc] rounded-xl px-4 py-3.5 text-sm font-medium text-[#333] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-[#fafaf8] appearance-none cursor-pointer"
                        >
                          <option value="">-- Chọn chủ đề --</option>
                          {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#666] mb-2">
                        Nội dung <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="Mô tả chi tiết yêu cầu của bạn..."
                        className="w-full border border-[#e0d8cc] rounded-xl px-4 py-3.5 text-sm font-medium placeholder-[#bbb] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-[#fafaf8] resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-primary disabled:bg-[#999] text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Gửi lời nhắn
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* RIGHT: Branches + Map visual */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Branch selector */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="bg-white border border-[#e8e0d0] rounded-3xl p-7 shadow-sm"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-[#999] mb-5">Hệ thống cửa hàng</h3>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 bg-[#f5f0e8] rounded-xl p-1">
                {(['hanoi', 'hcm'] as Branch[]).map(b => (
                  <button
                    key={b}
                    onClick={() => setActiveBranch(b)}
                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      activeBranch === b ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-[#666] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {b === 'hanoi' ? 'Hà Nội' : 'TP. Hồ Chí Minh'}
                  </button>
                ))}
              </div>

              {/* Branch detail */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBranch}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h4 className="font-black text-base">{branches[activeBranch].name}</h4>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-[#555] leading-relaxed">{branches[activeBranch].address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-sm font-bold text-[#333]">{branches[activeBranch].phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-sm text-[#555]">{branches[activeBranch].hours}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Visual map placeholder */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
              className="relative bg-[#f5f0e8] border border-[#e8e0d0] rounded-3xl overflow-hidden h-[220px] flex items-center justify-center"
            >
              {/* Grid bg */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

              {/* Vietnam silhouette dots */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                {/* Hanoi dot */}
                <div
                  className="relative flex flex-col items-center gap-1 cursor-pointer"
                  onClick={() => setActiveBranch('hanoi')}
                >
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                    <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white shadow-md transition-all ${activeBranch === 'hanoi' ? 'bg-primary scale-125' : 'bg-[#999]'}`} />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wide text-[#333] bg-white/80 px-2 py-0.5 rounded-full">Hà Nội</span>
                </div>

                <div className="w-px h-10 bg-[#1a1a1a]/10" />

                {/* HCM dot */}
                <div
                  className="relative flex flex-col items-center gap-1 cursor-pointer"
                  onClick={() => setActiveBranch('hcm')}
                >
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50" />
                    <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white shadow-md transition-all ${activeBranch === 'hcm' ? 'bg-blue-500 scale-125' : 'bg-[#999]'}`} />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wide text-[#333] bg-white/80 px-2 py-0.5 rounded-full">TP. HCM</span>
                </div>
              </div>

              {/* Coordinate badge */}
              <div className="absolute top-4 left-4 bg-[#1a1a1a] text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider">
                {activeBranch === 'hanoi' ? '21.02°N · 105.85°E' : '10.82°N · 106.63°E'}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-16 items-start"
          >
            {/* Left: Title */}
            <div className="md:w-1/3 md:sticky md:top-32">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Hỏi đáp</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase mt-3 leading-tight">
                Câu hỏi<br />thường gặp
              </h2>
              <p className="text-[#666] text-sm mt-4 leading-relaxed">
                Không tìm thấy câu trả lời? <br />
                <a href="mailto:hello@aurafashion.vn" className="text-primary font-bold hover:underline">
                  Liên hệ trực tiếp →
                </a>
              </p>
            </div>

            {/* Right: Accordion */}
            <div className="md:w-2/3 space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                  className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-[#fafaf8] transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-black text-sm uppercase tracking-tight pr-4">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-[#999] shrink-0" />
                    }
                  </button>

                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-7 pb-6 text-sm text-[#555] leading-relaxed border-t border-[#f0e8d8] pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
