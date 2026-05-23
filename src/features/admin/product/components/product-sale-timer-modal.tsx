'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { Product } from '../types'
import { _productService } from '../product.query'
import { IconClock, IconDiscount2, IconCalendar, IconTrash, IconInfoCircle } from '@tabler/icons-react'
import { toast } from 'react-toastify'

interface ProductSaleTimerModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductSaleTimerModal({
  product,
  open,
  onOpenChange,
}: ProductSaleTimerModalProps) {
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE')
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const setSaleTimerMutation = _productService.useSetSaleTimer()

  // Format date to local datetime string format required by input type="datetime-local" (YYYY-MM-DDThh:mm)
  const formatDateToLocalInput = (dateStr: string | null | undefined): string => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return ''
      // Offset local timezone
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
      return ''
    }
  }

  useEffect(() => {
    if (product && open) {
      setDiscountType(product.discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE')
      setDiscountValue(product.discountValue || 0)
      setStartDate(formatDateToLocalInput(product.discountStartDate))
      setEndDate(formatDateToLocalInput(product.discountEndDate))
    }
  }, [product, open])

  if (!product) return null

  // Compute prices
  const prices = product.variants?.map((v) => v.price) || []
  const hasVariants = prices.length > 0
  const minPrice = hasVariants ? Math.min(...prices) : 0
  const maxPrice = hasVariants ? Math.max(...prices) : 0

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val)
  }

  // Calculate discounted price
  const calculateDiscounted = (original: number) => {
    if (discountType === 'PERCENTAGE') {
      const discount = (original * discountValue) / 100
      return Math.max(0, original - discount)
    } else {
      return Math.max(0, original - discountValue)
    }
  }

  const handleSave = async () => {
    if (discountValue < 0) {
      toast.error('Giá trị giảm giá không được âm')
      return
    }

    if (discountType === 'PERCENTAGE' && discountValue > 100) {
      toast.error('Giá trị giảm giá theo phần trăm không được vượt quá 100%')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc')
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('Thời gian bắt đầu phải trước thời gian kết thúc')
      return
    }

    try {
      await setSaleTimerMutation.mutateAsync({
        id: product.id,
        data: {
          discountType,
          discountValue,
          discountStartDate: new Date(startDate).toISOString(),
          discountEndDate: new Date(endDate).toISOString(),
        },
      })
      onOpenChange(false)
    } catch {
      // Handled by react query
    }
  }

  const handleClear = async () => {
    if (!product.discountValue && !product.discountStartDate && !product.discountEndDate) {
      onOpenChange(false)
      return
    }

    if (confirm('Bạn có chắc chắn muốn xóa thiết lập Sale Timer cho sản phẩm này không?')) {
      try {
        await setSaleTimerMutation.mutateAsync({
          id: product.id,
          data: {
            discountType: 'PERCENTAGE',
            discountValue: 0,
            discountStartDate: null,
            discountEndDate: null,
          },
        })
        onOpenChange(false)
      } catch {
        // Handled by react query
      }
    }
  }

  const activeTimer = product.discountValue && product.discountStartDate && product.discountEndDate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px] p-6 rounded-3xl overflow-hidden border border-slate-100 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300'>
        <DialogHeader className='flex flex-col gap-1 pb-4 border-b border-slate-100 dark:border-slate-800'>
          <div className='flex items-center gap-2 text-amber-500'>
            <IconClock className='w-6 h-6 animate-pulse' />
            <DialogTitle className='text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100'>
              Thiết lập Sale Timer
            </DialogTitle>
          </div>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            Thiết lập thời gian chạy chương trình khuyến mãi tự động cho sản phẩm của bạn.
          </p>
        </DialogHeader>

        {/* Product Brief Summary */}
        <div className='flex items-center gap-4 p-3 my-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60'>
          {product.thumbnail?.url ? (
            <img
              src={product.thumbnail.url}
              alt={product.name}
              className='w-16 h-16 object-cover rounded-xl shadow-inner border border-white'
            />
          ) : (
            <div className='w-16 h-16 bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-xl text-slate-400 text-xs font-semibold'>
              No Image
            </div>
          )}
          <div className='flex-1 min-w-0'>
            <h4 className='font-bold text-sm text-slate-800 dark:text-slate-200 truncate' title={product.name}>
              {product.name}
            </h4>
            <div className='text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-col gap-0.5'>
              <span className='font-medium text-slate-600 dark:text-slate-300'>
                Giá gốc: {hasVariants ? (minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`) : 'Chưa có biến thể'}
              </span>
              {activeTimer && (
                <span className='inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full w-fit'>
                  <IconDiscount2 size={13} />
                  Đang chạy Sale ({product.discountType === 'PERCENTAGE' ? `${product.discountValue}%` : formatCurrency(product.discountValue || 0)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Configurations */}
        <div className='grid gap-5 py-2'>
          <div className='grid grid-cols-2 gap-4'>
            {/* Discount Type */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                Loại giảm giá
              </label>
              <Select
                value={discountType}
                onValueChange={(val: 'PERCENTAGE' | 'FIXED') => {
                  setDiscountType(val)
                  setDiscountValue(0)
                }}
              >
                <SelectTrigger className='w-full border-slate-200 rounded-xl h-11 focus-visible:ring-amber-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'>
                  <SelectValue placeholder='Chọn loại giảm giá' />
                </SelectTrigger>
                <SelectContent className='bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 z-[120]'>
                  <SelectItem value='PERCENTAGE'>Phần trăm (%)</SelectItem>
                  <SelectItem value='FIXED'>Số tiền cố định (VND)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Value */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                Giá trị giảm
              </label>
              <Input
                type='number'
                value={discountValue || ''}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                placeholder={discountType === 'PERCENTAGE' ? 'Ví dụ: 10' : 'Ví dụ: 50000'}
                className='border-slate-200 rounded-xl h-11 focus-visible:ring-amber-500 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                min={0}
                max={discountType === 'PERCENTAGE' ? 100 : undefined}
              />
            </div>
          </div>

          {/* Pricing Preview Real-time */}
          {hasVariants && (
            <div className='p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/30 flex flex-col gap-2'>
              <div className='flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-semibold'>
                <IconInfoCircle size={15} />
                <span>Xem trước giá sau giảm:</span>
              </div>
              <div className='flex items-baseline gap-2 mt-1'>
                <span className='text-lg font-extrabold text-amber-600 dark:text-amber-400'>
                  {minPrice === maxPrice
                    ? formatCurrency(calculateDiscounted(minPrice))
                    : `${formatCurrency(calculateDiscounted(minPrice))} - ${formatCurrency(calculateDiscounted(maxPrice))}`}
                </span>
                <span className='text-xs text-slate-400 dark:text-slate-500 line-through'>
                  {minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                </span>
              </div>
            </div>
          )}

          {/* Date Picker Form */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Start Date */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1'>
                <IconCalendar size={15} className='text-slate-400' />
                Thời gian bắt đầu
              </label>
              <Input
                type='datetime-local'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='border-slate-200 rounded-xl h-11 focus-visible:ring-amber-500 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100'
              />
            </div>

            {/* End Date */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1'>
                <IconCalendar size={15} className='text-slate-400' />
                Thời gian kết thúc
              </label>
              <Input
                type='datetime-local'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='border-slate-200 rounded-xl h-11 focus-visible:ring-amber-500 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100'
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <DialogFooter className='flex items-center justify-between gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800'>
          <Button
            type='button'
            variant='ghost'
            onClick={handleClear}
            className='text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl h-11 flex items-center gap-1.5 font-semibold'
          >
            <IconTrash size={16} />
            Xóa hẹn giờ
          </Button>

          <div className='flex items-center gap-2 ml-auto'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 rounded-xl h-11 font-semibold text-slate-700 dark:text-slate-300'
            >
              Hủy
            </Button>
            <Button
              type='button'
              onClick={handleSave}
              disabled={setSaleTimerMutation.isPending}
              className='bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-xl h-11 px-5 font-semibold flex items-center gap-1 shadow-md shadow-amber-500/10'
            >
              {setSaleTimerMutation.isPending ? 'Đang lưu...' : 'Lưu thiết lập'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
