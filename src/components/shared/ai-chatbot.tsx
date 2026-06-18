'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  X,
  SendHorizontal,
  Trash2,
  Sparkles,
  Bot,
  User,
  ImagePlus,
  Copy,
  Check,
  ExternalLink,
  Tag,
  ShoppingBag,
} from 'lucide-react'
import { https } from '~/config/https'
import { toast } from 'react-toastify'
import { ConfirmModal } from '~/components/shared/confirm-modal'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'model'
  message: string
  timestamp: string
  imagePreview?: string // base64 data URL for FE preview
  products?: AIProductCard[]
  vouchers?: AIVoucherChip[]
}

interface AIProductCard {
  id: string
  name: string
  slug: string
  price: string
  thumbnail: string | null
}

interface AIVoucherChip {
  code: string
  discount: string
  description: string
  minOrder: string
}

interface AIResponse {
  text: string
  products?: AIProductCard[]
  vouchers?: AIVoucherChip[]
}

// ─── Helpers ──────────────────────────────────────────────────────
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Strip data URL prefix → pure base64
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const fileToDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

// Parse markdown links [text](url) → JSX
function parseMessageText(text: string) {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-600 underline underline-offset-2 font-medium hover:text-amber-700 inline-flex items-center gap-0.5"
      >
        {match[1]}
        <ExternalLink className="h-3 w-3 inline-block" />
      </a>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

// ─── Sub-components ───────────────────────────────────────────────
function ProductCardRow({ products }: { products: AIProductCard[] }) {
  return (
    <div className="flex flex-col gap-2 mt-2 w-full">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#5c4e43]">
        <ShoppingBag className="h-3 w-3" />
        Sản phẩm gợi ý
      </div>
      <div className="flex flex-col gap-2">
        {products.slice(0, 5).map((p) => (
          <Link
            key={p.id}
            href={`/shop/${p.slug}`}
            target="_blank"
            className="flex items-center gap-2.5 bg-[#FBF8F3] border border-solid border-[#e8e0d6] rounded-xl p-2 hover:border-[#5c4e43] hover:shadow-sm transition-all duration-200 group no-underline"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {p.thumbnail ? (
                <Image
                  src={p.thumbnail}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#231f20] truncate leading-tight group-hover:text-[#5c4e43] transition-colors">
                {p.name}
              </p>
              <p className="text-[11px] text-amber-600 font-bold mt-0.5">{p.price}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#5c4e43] shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}

function VoucherChipRow({ vouchers }: { vouchers: AIVoucherChip[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code)
      toast.success(`Đã copy mã "${code}"!`, { autoClose: 1500 })
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-2 mt-2 w-full">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#5c4e43]">
        <Tag className="h-3 w-3" />
        Mã giảm giá
      </div>
      <div className="flex flex-col gap-2">
        {vouchers.slice(0, 5).map((v) => (
          <div
            key={v.code}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-dashed border-amber-300 rounded-xl p-2.5 flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[13px] text-[#231f20] tracking-wider">{v.code}</span>
                <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  {v.discount}
                </span>
              </div>
              {v.minOrder && v.minOrder !== '0đ' && (
                <p className="text-[10px] text-gray-500 mt-0.5">Đơn tối thiểu {v.minOrder}</p>
              )}
            </div>
            <button
              onClick={() => handleCopy(v.code)}
              className="shrink-0 bg-[#231f20] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-[#5c4e43] transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedCode === v.code ? (
                <><Check className="h-3 w-3" /> Copied</>
              ) : (
                <><Copy className="h-3 w-3" /> Copy</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Quick Suggestions ───────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  { icon: '🔥', label: 'Sản phẩm hot nhất', message: 'Sản phẩm nổi bật nhất hiện tại là gì?' },
  { icon: '🏷️', label: 'Mã giảm giá', message: 'Có voucher hay mã giảm giá nào đang hoạt động không?' },
  { icon: '👗', label: 'Tư vấn phối đồ', message: 'Tư vấn giúp tôi cách phối đồ đi làm thanh lịch nhé!' },
  { icon: '📦', label: 'Tra đơn hàng', message: 'Tôi muốn kiểm tra tình trạng đơn hàng của mình.' },
  { icon: '🌊', label: 'Outfit đi biển', message: 'Gợi ý outfit đi biển mùa hè cho tôi nhé!' },
  { icon: '📷', label: 'Tư vấn qua ảnh', message: 'Tôi muốn tải ảnh lên để được tư vấn trang phục phù hợp.' },
]

function QuickSuggestions({ onSelect, disabled }: { onSelect: (msg: string) => void; disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-1 py-1">
      {QUICK_SUGGESTIONS.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelect(s.message)}
          disabled={disabled}
          className="flex items-center gap-1 bg-white border border-solid border-[#e8e0d6] text-[#231f20] text-[11px] font-semibold px-2.5 py-1.5 rounded-full hover:bg-[#231f20] hover:text-white hover:border-[#231f20] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
        >
          <span>{s.icon}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────
export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingImage, setPendingImage] = useState<{
    file: File
    base64: string
    dataUrl: string
    mimeType: string
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('nude_shop_ai_chat')
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat))
      } catch (e) {
        console.error('Failed to load saved chat history:', e)
      }
    } else {
      setMessages([
        {
          role: 'model',
          message:
            'Dạ xin chào anh/chị! Em là NUDE — trợ lý ảo thời trang của Nude Shop 👗\n\nEm có thể giúp anh/chị:\n• Tư vấn sản phẩm & phối đồ\n• Tra cứu mã giảm giá\n• Kiểm tra tình trạng đơn hàng\n• Phân tích ảnh trang phục\n\nAnh/chị cần tư vấn gì ạ?',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('nude_shop_ai_chat', JSON.stringify(messages))
    } else {
      localStorage.removeItem('nude_shop_ai_chat')
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle image file selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh dưới 4MB.')
      return
    }

    try {
      const [base64, dataUrl] = await Promise.all([
        fileToBase64(file),
        fileToDataURL(file),
      ])
      setPendingImage({
        file,
        base64,
        dataUrl,
        mimeType: file.type,
      })
    } catch {
      toast.error('Không thể đọc file ảnh.')
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Quick suggestion click → send directly
  const handleQuickSend = (msg: string) => {
    if (isLoading) return
    setInputValue('')
    // Trigger send with the suggestion text directly
    sendMessage(msg, null)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputValue.trim() && !pendingImage) || isLoading) return
    sendMessage(inputValue.trim() || 'Phân tích trang phục trong ảnh này và gợi ý sản phẩm tương tự nhé!', pendingImage)
    setInputValue('')
    setPendingImage(null)
  }

  const sendMessage = async (userMsg: string, imageData: typeof pendingImage) => {

    const imageSnapshot = imageData

    const timestamp = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const newUserMessage: Message = {
      role: 'user',
      message: userMsg,
      timestamp,
      imagePreview: imageSnapshot?.dataUrl,
    }

    const newMessages: Message[] = [...messages, newUserMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Build history (exclude imagePreview for API)
      const apiHistory = messages.map((m) => ({
        role: m.role,
        message: m.message,
      }))

      const payload: Record<string, any> = {
        message: userMsg,
        history: apiHistory,
      }

      if (imageSnapshot) {
        payload.imageBase64 = imageSnapshot.base64
        payload.mimeType = imageSnapshot.mimeType
      }

      const response = await https.post('/ai/chat', payload)
      const data: AIResponse = response.data.result || {}

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          message: data.text || 'Dạ, em chưa nhận được câu trả lời từ hệ thống. Anh/chị vui lòng thử lại nhé!',
          timestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          products: data.products,
          vouchers: data.vouchers,
        },
      ])
    } catch (error: any) {
      console.error('Failed to get response from AI:', error)
      const errorMsg =
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
      toast.error(errorMsg)
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          message:
            'Dạ, hệ thống kết nối AI đang bận. Anh/chị vui lòng thử lại sau giây lát ạ!',
          timestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => setIsConfirmOpen(true)

  const handleConfirmClear = () => {
    const welcomeMsg: Message = {
      role: 'model',
      message:
        'Dạ xin chào anh/chị! Em là NUDE — trợ lý ảo thời trang của Nude Shop 👗\n\nEm có thể giúp anh/chị:\n• Tư vấn sản phẩm & phối đồ\n• Tra cứu mã giảm giá\n• Kiểm tra tình trạng đơn hàng\n• Phân tích ảnh trang phục\n\nAnh/chị cần tư vấn gì ạ?',
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setMessages([welcomeMsg])
    setPendingImage(null)
    localStorage.setItem('nude_shop_ai_chat', JSON.stringify([welcomeMsg]))
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Xóa lịch sử"
        description="Anh/chị có muốn xóa toàn bộ lịch sử trò chuyện này không? Hành động này không thể hoàn tác."
        confirmText="Xóa tất cả"
        cancelText="Hủy"
        variant="destructive"
      />

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-[#231f20] hover:bg-[#5c4e43] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer border border-solid border-white/10"
          title="Trò chuyện với AI"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
          <Sparkles className="h-6 w-6 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="bg-[#FBF8F3] w-[360px] sm:w-[400px] h-[560px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-solid border-[#231f20]/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#231f20] text-white py-4 px-5 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#5c4e43] p-1.5 rounded-full flex items-center justify-center border border-solid border-white/20">
                <Bot className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wider uppercase m-0">Trợ Lý Ảo NUDE</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span className="text-[10px] text-[#bbbbbb]">AI • Đang trực tuyến</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                title="Xóa cuộc trò chuyện"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                title="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, index) => {
              const isAI = msg.role === 'model'
              return (
                <div
                  key={index}
                  className={`flex gap-2.5 ${isAI ? 'self-start max-w-full w-full' : 'self-end max-w-[85%] flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border border-solid mt-0.5 ${
                      isAI
                        ? 'bg-[#231f20] text-amber-400 border-white/10'
                        : 'bg-[#5c4e43] text-white border-black/10'
                    }`}
                  >
                    {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  {/* Bubble + Cards */}
                  <div className={`flex flex-col gap-1 ${isAI ? 'flex-1 min-w-0' : ''}`}>
                    {/* Image preview (user sent) */}
                    {msg.imagePreview && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-solid border-gray-200 mb-1">
                        <Image
                          src={msg.imagePreview}
                          alt="Ảnh tải lên"
                          fill
                          className="object-cover"
                          sizes="128px"
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`py-2.5 px-3.5 rounded-2xl text-[13px] leading-[1.6] border border-solid shadow-sm ${
                        isAI
                          ? 'bg-white text-[#231f20] border-[#eeeeee] rounded-tl-none'
                          : 'bg-[#231f20] text-white border-[#231f20] rounded-tr-none'
                      }`}
                    >
                      {msg.message.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className="m-0 min-h-[1em]">
                          {parseMessageText(line)}
                        </p>
                      ))}
                    </div>

                    {/* Product cards */}
                    {isAI && msg.products && msg.products.length > 0 && (
                      <ProductCardRow products={msg.products} />
                    )}

                    {/* Voucher chips */}
                    {isAI && msg.vouchers && msg.vouchers.length > 0 && (
                      <VoucherChipRow vouchers={msg.vouchers} />
                    )}

                    <span
                      className={`text-[9px] text-gray-400 ${isAI ? 'self-start pl-1' : 'self-end pr-1'}`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Quick Suggestions — hiện sau tin nhắn AI cuối, ẩn khi đang loading */}
            {!isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'model' && (
              <div className="self-start w-full pl-9">
                <QuickSuggestions onSelect={handleQuickSend} disabled={isLoading} />
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] self-start">
                <div className="h-7 w-7 rounded-full bg-[#231f20] text-amber-400 border border-solid border-white/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 animate-bounce" />
                </div>
                <div className="bg-white border border-solid border-[#eeeeee] py-3.5 px-5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#5c4e43] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#5c4e43] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#5c4e43] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image pending preview */}
          {pendingImage && (
            <div className="px-3 pt-2 shrink-0">
              <div className="relative inline-block">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-solid border-amber-400 shadow-md">
                  <Image
                    src={pendingImage.dataUrl}
                    alt="Ảnh sẽ gửi"
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                </div>
                <button
                  onClick={() => setPendingImage(null)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] cursor-pointer hover:bg-red-600 transition-colors shadow-sm"
                  style={{ width: 18, height: 18 }}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-solid border-[#eeeeee] flex items-center gap-2 shrink-0"
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageSelect}
            />

            {/* Image upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="text-gray-400 hover:text-[#5c4e43] transition-colors duration-200 p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0"
              title="Tải ảnh lên để AI phân tích"
            >
              <ImagePlus className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={pendingImage ? 'Hỏi về ảnh này...' : 'Nhập câu hỏi tư vấn...'}
              disabled={isLoading}
              className="flex-1 py-2 px-3 border border-solid border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20]/20 disabled:bg-gray-50 transition-all duration-200"
            />

            <button
              type="submit"
              disabled={isLoading || (!inputValue.trim() && !pendingImage)}
              className="bg-[#231f20] hover:bg-[#5c4e43] text-white p-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center disabled:opacity-40 disabled:hover:bg-[#231f20] cursor-pointer shrink-0"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
