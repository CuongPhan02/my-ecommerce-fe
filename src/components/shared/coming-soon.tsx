'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, ArrowRight, ShieldCheck, Sparkles, Instagram, Facebook, Twitter } from 'lucide-react'
import Link from 'next/link'

const ComingSoon = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col items-center justify-between px-6 py-12 overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[60%] w-[30%] aspect-square rounded-full bg-fuchsia-600/5 blur-[100px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header / Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-black text-xl uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            AURA FASHION
          </span>
        </div>

        <Link 
          href="/admin/staff"
          className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Hệ thống Admin</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl text-center z-10 py-16">
        {/* Coming Soon Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-indigo-300 mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          Website Under Construction
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6"
        >
          Trải Nghiệm Mua Sắm <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
            Sắp Được Ra Mắt
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-base md:text-lg font-medium max-w-xl mb-12 leading-relaxed"
        >
          Chúng tôi đang hoàn thiện bộ sưu tập thời trang cao cấp thế hệ mới cùng giao diện mua sắm trực tuyến thời thượng nhất. Đăng ký nhận thông báo để không bỏ lỡ ngày ra mắt!
        </motion.p>

        {/* Email Form / Success message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md"
        >
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="relative flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 focus-within:border-indigo-500/50 transition-all duration-300">
              <div className="flex items-center pl-4 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="flex-1 bg-transparent border-0 outline-none px-3 py-3 text-sm placeholder-gray-500 font-medium focus:ring-0"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Nhận tin
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-400 font-bold text-sm"
            >
              🎉 Cảm ơn bạn! Chúng tôi sẽ gửi thông báo ngay khi website sẵn sàng hoạt động.
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer / Socials */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8 z-10"
      >
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          © {new Date().getFullYear()} Aura Fashion. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-300">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-300">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-300">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default ComingSoon
