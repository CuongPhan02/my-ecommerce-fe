'use client'
import React, { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Badge } from '~/components/ui/core/badge'
import { Input } from '~/components/ui/core/input'
import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/core/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '~/components/ui/core/select'
import { Label } from '~/components/ui/core/label'
import { Switch } from '~/components/ui/core/switch'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { toast } from 'react-toastify'
import {
  IconTicket,
  IconPlus,
  IconSearch,
  IconFilter,
  IconTrash,
  IconEdit,
  IconCalendarEvent,
  IconUsers,
  IconShieldCheck,
  IconPlayerPause,
  IconPlayerPlay,
  IconAlertTriangle,
  IconInfoCircle,
  IconFilterOff,
} from '@tabler/icons-react'

// Voucher interface definition
interface Voucher {
  id: string
  code: string
  description: string
  discountType: 'PERCENT' | 'FIXED' | 'SHIPPING'
  value: number // 20 for PERCENT (20%), 50000 for FIXED (50k)
  minOrderValue: number
  usageLimit: number
  usedCount: number
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED'
  validUntil: string
}

// Initial mock dataset
const INITIAL_DISCOUNTS: Voucher[] = [
  {
    id: 'DISC-001',
    code: 'SUMMER24',
    description:
      'Giảm 20% cho toàn bộ các đơn hàng mua sắm trong dịp mùa hè năng động',
    discountType: 'PERCENT',
    value: 20,
    minOrderValue: 200000,
    usageLimit: 500,
    usedCount: 150,
    status: 'ACTIVE',
    validUntil: '2026-08-31',
  },
  {
    id: 'DISC-002',
    code: 'FREESHIP100K',
    description:
      'Miễn phí chi phí vận chuyển tối đa 30k áp dụng cho các đơn hàng từ 100k',
    discountType: 'SHIPPING',
    value: 30000,
    minOrderValue: 100000,
    usageLimit: 1000,
    usedCount: 89,
    status: 'ACTIVE',
    validUntil: '2026-12-31',
  },
  {
    id: 'DISC-003',
    code: 'WELCOME50',
    description:
      'Tặng voucher giảm ngay 50.000đ dành riêng cho tài khoản đăng ký mới',
    discountType: 'FIXED',
    value: 50000,
    minOrderValue: 0,
    usageLimit: 1000,
    usedCount: 1000,
    status: 'EXPIRED',
    validUntil: '2025-12-31',
  },
  {
    id: 'DISC-004',
    code: 'KHAITRUONG100',
    description:
      'Ưu đãi cực khủng tri ân khai trương giảm trực tiếp 100.000đ vào đơn hàng',
    discountType: 'FIXED',
    value: 100000,
    minOrderValue: 500000,
    usageLimit: 200,
    usedCount: 45,
    status: 'ACTIVE',
    validUntil: '2026-06-30',
  },
  {
    id: 'DISC-005',
    code: 'MIDYEARSALE',
    description: 'Giảm giá giữa năm lên tới 15% cho mọi sản phẩm thời trang',
    discountType: 'PERCENT',
    value: 15,
    minOrderValue: 150000,
    usageLimit: 300,
    usedCount: 0,
    status: 'PAUSED',
    validUntil: '2026-07-15',
  },
]

export function DiscountList() {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_DISCOUNTS)

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortOption, setSortOption] = useState<string>('newest')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Dialog States
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null)
  const [voucherToToggle, setVoucherToToggle] = useState<Voucher | null>(null)

  // Form Field States
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [discountType, setDiscountType] = useState<
    'PERCENT' | 'FIXED' | 'SHIPPING'
  >('PERCENT')
  const [value, setValue] = useState<number>(0)
  const [minOrderValue, setMinOrderValue] = useState<number>(0)
  const [usageLimit, setUsageLimit] = useState<number>(0)
  const [validUntil, setValidUntil] = useState('')
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // KPI statistics calculation
  const stats = useMemo(() => {
    const total = vouchers.length
    const active = vouchers.filter((v) => v.status === 'ACTIVE').length
    const paused = vouchers.filter((v) => v.status === 'PAUSED').length
    const totalUsed = vouchers.reduce((acc, curr) => acc + curr.usedCount, 0)
    return { total, active, paused, totalUsed }
  }, [vouchers])

  // Populate form fields for Edit or Create
  const handleOpenForm = (voucher?: Voucher) => {
    if (voucher) {
      setSelectedVoucher(voucher)
      setCode(voucher.code)
      setDescription(voucher.description)
      setDiscountType(voucher.discountType)
      setValue(voucher.value)
      setMinOrderValue(voucher.minOrderValue)
      setUsageLimit(voucher.usageLimit)
      setValidUntil(voucher.validUntil)
      setStatus(voucher.status === 'EXPIRED' ? 'ACTIVE' : voucher.status)
    } else {
      setSelectedVoucher(null)
      setCode('')
      setDescription('')
      setDiscountType('PERCENT')
      setValue(0)
      setMinOrderValue(0)
      setUsageLimit(0)
      setValidUntil('')
      setStatus('ACTIVE')
    }
    setIsFormOpen(true)
  }

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !description.trim() || value <= 0) {
      toast.error('Vui lòng điền đầy đủ và đúng định dạng các trường bắt buộc!')
      return
    }

    if (selectedVoucher) {
      // Update
      setVouchers((prev) =>
        prev.map((v) =>
          v.id === selectedVoucher.id
            ? {
                ...v,
                code: code.trim().toUpperCase(),
                description: description.trim(),
                discountType,
                value,
                minOrderValue,
                usageLimit,
                validUntil,
                status: v.status === 'EXPIRED' ? 'ACTIVE' : status,
              }
            : v,
        ),
      )
      toast.success('Cập nhật mã giảm giá thành công!')
    } else {
      // Create new
      const newVoucher: Voucher = {
        id: `DISC-${Math.floor(100 + Math.random() * 900)}`,
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        value,
        minOrderValue,
        usageLimit,
        usedCount: 0,
        status: status,
        validUntil,
      }
      setVouchers((prev) => [newVoucher, ...prev])
      toast.success('Thêm mã giảm giá mới thành công!')
    }
    setIsFormOpen(false)
  }

  // Handle Deletion Confirmation
  const confirmDelete = () => {
    if (voucherToDelete) {
      setVouchers((prev) => prev.filter((v) => v.id !== voucherToDelete.id))
      toast.success(`Đã xóa thành công mã giảm giá ${voucherToDelete.code}`)
      setVoucherToDelete(null)
    }
  }

  // Handle Pause/Resume status toggle
  const confirmToggleStatus = () => {
    if (voucherToToggle) {
      const nextStatus =
        voucherToToggle.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
      setVouchers((prev) =>
        prev.map((v) =>
          v.id === voucherToToggle.id ? { ...v, status: nextStatus } : v,
        ),
      )
      toast.success(
        nextStatus === 'ACTIVE'
          ? `Kích hoạt thành công mã ${voucherToToggle.code}`
          : `Đã tạm ngưng hoạt động mã ${voucherToToggle.code}`,
      )
      setVoucherToToggle(null)
    }
  }

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val)
  }

  const formatVoucherValue = (type: string, value: number) => {
    if (type === 'PERCENT') return `${value}%`
    return formatCurrency(value)
  }

  const getStatusBadge = (status: 'ACTIVE' | 'PAUSED' | 'EXPIRED') => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className='bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 gap-1 rounded-full px-3 py-1 font-bold'>
            ● Đang hoạt động
          </Badge>
        )
      case 'PAUSED':
        return (
          <Badge className='bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 gap-1 rounded-full px-3 py-1 font-bold'>
            ● Tạm ngưng
          </Badge>
        )
      case 'EXPIRED':
        return (
          <Badge className='bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200 gap-1 rounded-full px-3 py-1 font-bold'>
            ● Hết hạn
          </Badge>
        )
    }
  }

  // Filtered and Sorted list
  const filteredVouchers = useMemo(() => {
    return vouchers
      .filter((v) => {
        const matchesSearch =
          v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType =
          typeFilter === 'all' || v.discountType === typeFilter
        const matchesStatus =
          statusFilter === 'all' || v.status === statusFilter
        return matchesSearch && matchesType && matchesStatus
      })
      .sort((a, b) => {
        if (sortOption === 'newest') return b.id.localeCompare(a.id)
        if (sortOption === 'value-desc') return b.value - a.value
        if (sortOption === 'value-asc') return a.value - b.value
        if (sortOption === 'limit-desc') return b.usageLimit - a.usageLimit
        return 0
      })
  }, [vouchers, searchTerm, typeFilter, statusFilter, sortOption])

  // Pagination calculation
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage) || 1
  const paginatedVouchers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredVouchers.slice(start, start + itemsPerPage)
  }, [filteredVouchers, currentPage])

  return (
    <div className='flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4 md:p-6'>
      {/* Title block */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-primary shadow-sm shadow-indigo-100'>
            <IconTicket size={24} />
          </div>
          <div>
            <h1 className='text-2xl font-black text-slate-900 tracking-tight'>
              Khuyến mãi & Voucher
            </h1>
            <p className='text-sm text-slate-400 font-medium'>
              Quản lý các chương trình ưu đãi, mã giảm giá và chiết khấu cửa
              hàng.
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className='rounded-xl bg-primary hover:opacity-90 font-bold gap-2 px-5 py-5 shadow-lg shadow-primary/20 transition-all self-start sm:self-auto'
        >
          <IconPlus size={20} /> Tạo mã voucher mới
        </Button>
      </div>

      {/* Modern KPI Stats row */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Tổng số mã
              </p>
              <h3 className='text-3xl font-extrabold text-slate-900'>
                {stats.total}
              </h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:scale-105 transition-transform'>
              <IconTicket size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Đang hoạt động
              </p>
              <h3 className='text-3xl font-extrabold text-emerald-600'>
                {stats.active}
              </h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform'>
              <IconShieldCheck size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Tạm ngưng
              </p>
              <h3 className='text-3xl font-extrabold text-amber-500'>
                {stats.paused}
              </h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform'>
              <IconPlayerPause size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Số lượt đã dùng
              </p>
              <h3 className='text-3xl font-extrabold text-indigo-600'>
                {stats.totalUsed}
              </h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-105 transition-transform'>
              <IconUsers size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content listing container */}
      <Card className='rounded-3xl border border-slate-100/80 shadow-md bg-white overflow-hidden'>
        <CardHeader className='pb-3 border-b border-slate-100/60 bg-slate-50/30'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div>
              <CardTitle className='text-lg font-bold text-slate-900'>
                Mã voucher & Khuyến mãi
              </CardTitle>
              <CardDescription className='text-xs text-slate-400 font-medium'>
                Danh sách đầy đủ các ưu đãi đang được triển khai trên website
                thương mại.
              </CardDescription>
            </div>

            {/* Quick search and drawer filter toggle */}
            <div className='flex items-center gap-2 flex-wrap'>
              <div className='relative flex-1 sm:flex-none min-w-[240px]'>
                <IconSearch
                  size={16}
                  className='absolute left-3.5 top-3.5 text-slate-400'
                />
                <Input
                  type='search'
                  placeholder='Tìm kiếm mã code, mô tả...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-semibold'
                />
              </div>

              <Button
                variant={isFilterDrawerOpen ? 'default' : 'outline'}
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className='h-11 rounded-xl font-bold gap-2'
              >
                <IconFilter size={18} />
                Bộ lọc nâng cao
              </Button>

              {(searchTerm ||
                typeFilter !== 'all' ||
                statusFilter !== 'all') && (
                <Button
                  variant='ghost'
                  onClick={() => {
                    setSearchTerm('')
                    setTypeFilter('all')
                    setStatusFilter('all')
                    setCurrentPage(1)
                  }}
                  className='h-11 rounded-xl text-xs font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 gap-1'
                >
                  <IconFilterOff size={16} /> Xóa lọc
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Retractable Filters Drawer */}
          {isFilterDrawerOpen && (
            <div className='mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-4 duration-200'>
              {/* Type Filter */}
              <div className='flex flex-col gap-1'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-1'>
                  Phân loại ưu đãi
                </Label>
                <Select
                  value={typeFilter}
                  onValueChange={(val) => {
                    setTypeFilter(val)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                    <SelectValue placeholder='Chọn phân loại' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='all'>Tất cả phân loại</SelectItem>
                      <SelectItem value='PERCENT'>Phần trăm (%)</SelectItem>
                      <SelectItem value='FIXED'>Số tiền cố định (đ)</SelectItem>
                      <SelectItem value='SHIPPING'>
                        Hỗ trợ vận chuyển (đ)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className='flex flex-col gap-1'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-1'>
                  Trạng thái ưu đãi
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                      <SelectItem value='ACTIVE'>Đang hoạt động</SelectItem>
                      <SelectItem value='PAUSED'>
                        Tạm ngưng hoạt động
                      </SelectItem>
                      <SelectItem value='EXPIRED'>
                        Đã hết hạn sử dụng
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className='flex flex-col gap-1'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-1'>
                  Sắp xếp danh sách
                </Label>
                <Select
                  value={sortOption}
                  onValueChange={(val) => {
                    setSortOption(val)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                    <SelectValue placeholder='Chọn sắp xếp' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='newest'>Mới cập nhật</SelectItem>
                      <SelectItem value='value-desc'>
                        Mức giảm: Cao đến thấp
                      </SelectItem>
                      <SelectItem value='value-asc'>
                        Mức giảm: Thấp đến cao
                      </SelectItem>
                      <SelectItem value='limit-desc'>
                        Số lượng giới hạn: Nhiều nhất
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className='p-0'>
          <ScrollArea className='w-full overflow-hidden'>
            <div className='min-h-[300px]'>
              <table className='text-sm text-left w-full border-collapse whitespace-nowrap'>
                <thead className='bg-slate-50 dark:bg-muted'>
                  <tr className='border-b border-slate-100/80'>
                    <th className='p-4 font-bold text-slate-900 border-b w-[160px]'>
                      Mã Voucher
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b max-w-[280px]'>
                      Mô tả & Điều kiện
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b'>
                      Phân loại
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b'>
                      Mức giảm
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b'>
                      Đơn tối thiểu
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b'>
                      Trạng thái
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b'>
                      Đã dùng / Giới hạn
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b'>
                      Hạn sử dụng
                    </th>
                    <th className='p-4 font-bold text-slate-900 border-b text-right'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVouchers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className='text-center py-20 bg-white'>
                        <div className='flex flex-col items-center gap-4 text-slate-400'>
                          <IconTicket size={48} className='opacity-20' />
                          <p className='text-sm font-semibold'>
                            Không tìm thấy mã giảm giá nào phù hợp
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedVouchers.map((voucher) => (
                      <tr
                        key={voucher.id}
                        className='border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors'
                      >
                        {/* Code */}
                        <td className='p-4 align-middle'>
                          <div className='flex items-center gap-2'>
                            <div className='h-8 w-8 rounded-lg bg-indigo-50/80 flex items-center justify-center text-primary font-black text-xs border border-indigo-100/40'>
                              %
                            </div>
                            <span className='font-black text-indigo-600 text-sm tracking-wide bg-indigo-50/40 border border-indigo-100/40 rounded-lg px-2.5 py-1'>
                              {voucher.code}
                            </span>
                          </div>
                        </td>

                        {/* Description */}
                        <td className='p-4 align-middle max-w-[280px] break-words whitespace-normal'>
                          <span className='text-xs font-semibold text-slate-600 leading-relaxed block'>
                            {voucher.description}
                          </span>
                        </td>

                        {/* Type */}
                        <td className='p-4 align-middle font-bold text-slate-500 text-xs'>
                          {voucher.discountType === 'PERCENT' ? (
                            <Badge
                              variant='outline'
                              className='rounded-md border-indigo-100 bg-indigo-50/10 text-indigo-700 font-bold'
                            >
                              Phần trăm (%)
                            </Badge>
                          ) : voucher.discountType === 'FIXED' ? (
                            <Badge
                              variant='outline'
                              className='rounded-md border-emerald-100 bg-emerald-50/10 text-emerald-700 font-bold'
                            >
                              Số tiền cố định (đ)
                            </Badge>
                          ) : (
                            <Badge
                              variant='outline'
                              className='rounded-md border-sky-100 bg-sky-50/10 text-sky-700 font-bold'
                            >
                              Hỗ trợ ship (đ)
                            </Badge>
                          )}
                        </td>

                        {/* Value */}
                        <td className='p-4 align-middle font-extrabold text-slate-800 text-sm'>
                          {formatVoucherValue(
                            voucher.discountType,
                            voucher.value,
                          )}
                        </td>

                        {/* Min Order Value */}
                        <td className='p-4 align-middle font-semibold text-slate-500 text-xs'>
                          {voucher.minOrderValue === 0 ? (
                            <span className='text-slate-400 font-medium italic'>
                              Không có
                            </span>
                          ) : (
                            formatCurrency(voucher.minOrderValue)
                          )}
                        </td>

                        {/* Status */}
                        <td className='p-4 align-middle text-xs'>
                          {getStatusBadge(voucher.status)}
                        </td>

                        {/* Usage usageLimit */}
                        <td className='p-4 align-middle text-xs font-semibold text-slate-600'>
                          <div className='flex flex-col gap-1 w-[120px]'>
                            <div className='flex justify-between text-[10px] text-slate-400'>
                              <span>{voucher.usedCount} lượt dùng</span>
                              <span>{voucher.usageLimit} tối đa</span>
                            </div>
                            <div className='w-full bg-slate-100 h-1.5 rounded-full overflow-hidden'>
                              <div
                                className='bg-primary h-full transition-all'
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (voucher.usedCount / voucher.usageLimit) *
                                      100,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Valid until */}
                        <td className='p-4 align-middle text-xs font-bold text-slate-500'>
                          <div className='flex items-center gap-1.5'>
                            <IconCalendarEvent
                              size={16}
                              className='text-slate-400'
                            />
                            <span>{voucher.validUntil}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className='p-4 align-middle text-right'>
                          <div className='flex justify-end items-center gap-1'>
                            {/* Toggle status: Pause / Play */}
                            {voucher.status !== 'EXPIRED' && (
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => setVoucherToToggle(voucher)}
                                className={`rounded-xl hover:bg-slate-100 ${
                                  voucher.status === 'ACTIVE'
                                    ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                                    : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={
                                  voucher.status === 'ACTIVE'
                                    ? 'Tạm ngưng hoạt động'
                                    : 'Kích hoạt'
                                }
                              >
                                {voucher.status === 'ACTIVE' ? (
                                  <IconPlayerPause size={18} />
                                ) : (
                                  <IconPlayerPlay size={18} />
                                )}
                              </Button>
                            )}

                            {/* Edit */}
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleOpenForm(voucher)}
                              className='rounded-xl hover:bg-slate-100 text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                              title='Chỉnh sửa thông tin'
                            >
                              <IconEdit size={18} />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setVoucherToDelete(voucher)}
                              className='rounded-xl hover:bg-slate-100 text-rose-500 hover:text-rose-600 hover:bg-rose-50'
                              title='Xóa vĩnh viễn'
                            >
                              <IconTrash size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>

          {/* Table pagination block */}
          {filteredVouchers.length > 0 && (
            <div className='flex items-center justify-between py-5 px-6 border-t border-slate-100/60 bg-slate-50/10'>
              <div className='text-xs font-bold text-slate-500'>
                Hiển thị {paginatedVouchers.length} mã (Trang {currentPage}/
                {totalPages})
              </div>
              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9'
                >
                  Trước
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9'
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 1. ADD / EDIT VOUCHER FORM DIALOG */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary'>
                <IconTicket size={24} />
              </div>
              <div>
                <DialogTitle className='text-xl font-extrabold text-slate-900'>
                  {selectedVoucher
                    ? 'Cập nhật mã giảm giá'
                    : 'Tạo mới mã giảm giá'}
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  {selectedVoucher
                    ? `Mã ID: ${selectedVoucher.id}`
                    : 'Thiết lập mã coupon và các điều kiện áp dụng.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className='space-y-4 my-2 text-slate-700'
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Voucher Code */}
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='voucherCode'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Mã Code giảm giá <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='voucherCode'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder='VD: SUMMER50K'
                  className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-black uppercase tracking-wider focus:bg-white'
                  required
                />
              </div>

              {/* Discount Type */}
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs font-bold text-slate-600 pl-1'>
                  Phân loại ưu đãi
                </Label>
                <Select
                  value={discountType}
                  onValueChange={(val) => {
                    setDiscountType(val as any)
                    setValue(0)
                  }}
                >
                  <SelectTrigger className='bg-slate-50/50 h-11 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white'>
                    <SelectValue placeholder='Chọn phân loại' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='PERCENT'>
                        Giảm giá theo Phần trăm (%)
                      </SelectItem>
                      <SelectItem value='FIXED'>
                        Khấu trừ Số tiền cố định (đ)
                      </SelectItem>
                      <SelectItem value='SHIPPING'>
                        Miễn phí / Hỗ trợ ship (đ)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='voucherDesc'
                className='text-xs font-bold text-slate-600 pl-1'
              >
                Mô tả chi tiết voucher <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='voucherDesc'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Nhập mô tả và thông tin chương trình...'
                className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-medium focus:bg-white'
                required
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Discount Value */}
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='voucherVal'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Mức giảm tối đa <span className='text-red-500'>*</span>
                  {discountType === 'PERCENT' && (
                    <span className='text-slate-400 font-medium pl-1'>
                      (Tối đa 100%)
                    </span>
                  )}
                </Label>
                <Input
                  id='voucherVal'
                  type='number'
                  value={value || ''}
                  onChange={(e) => setValue(Number(e.target.value))}
                  placeholder={
                    discountType === 'PERCENT' ? '20 (%)' : '50000 (đ)'
                  }
                  className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-bold focus:bg-white'
                  min={1}
                  max={discountType === 'PERCENT' ? 100 : undefined}
                  required
                />
              </div>

              {/* Min Order Value */}
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='voucherMinOrder'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Giá trị đơn hàng tối thiểu
                </Label>
                <Input
                  id='voucherMinOrder'
                  type='number'
                  value={minOrderValue || ''}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  placeholder='VD: 200000 (đ)'
                  className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-bold focus:bg-white'
                  min={0}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Usage usageLimit */}
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='voucherLimit'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Giới hạn lượt sử dụng
                </Label>
                <Input
                  id='voucherLimit'
                  type='number'
                  value={usageLimit || ''}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  placeholder='VD: 500 (lượt)'
                  className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-bold focus:bg-white'
                  min={1}
                />
              </div>

              {/* End Date */}
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='voucherValidUntil'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Hạn sử dụng <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='voucherValidUntil'
                  type='date'
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white'
                  required
                />
              </div>
            </div>

            {/* Status Switch (Only for Create or Edit) */}
            <div className='flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100/80 my-2'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs font-bold text-slate-800'>
                  Trạng thái mã ngay khi lưu
                </span>
                <span className='text-[10px] text-slate-400 font-medium'>
                  {status === 'ACTIVE'
                    ? 'Kích hoạt và hiển thị cho người mua ngay.'
                    : 'Tạm ẩn mã để phát hành vào thời điểm khác.'}
                </span>
              </div>
              <Switch
                checked={status === 'ACTIVE'}
                onCheckedChange={(checked) =>
                  setStatus(checked ? 'ACTIVE' : 'PAUSED')
                }
              />
            </div>

            <DialogFooter className='pt-4 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsFormOpen(false)}
                className='gap-2 rounded-xl h-11 font-bold'
              >
                Hủy bỏ
              </Button>
              <Button
                type='submit'
                className='gap-2 rounded-xl h-11 font-bold bg-primary hover:opacity-90 shadow-lg shadow-primary/20'
              >
                Lưu ưu đãi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. CUSTOM DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={!!voucherToDelete}
        onOpenChange={(open) => !open && setVoucherToDelete(null)}
      >
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-red-100 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm'>
                <IconAlertTriangle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Xóa vĩnh viễn voucher?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  Xác nhận xóa hoàn toàn mã giảm giá này.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {voucherToDelete && (
            <div className='bg-red-50/50 p-4 rounded-2xl border border-red-100/50 space-y-2 my-2 text-sm text-slate-700'>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Mã Voucher:</span>
                <span className='font-black text-rose-600 bg-rose-50 border border-rose-100 rounded px-2 py-0.5'>
                  {voucherToDelete.code}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Giá trị giảm:</span>
                <span className='font-semibold'>
                  {formatVoucherValue(
                    voucherToDelete.discountType,
                    voucherToDelete.value,
                  )}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Hạn dùng:</span>
                <span className='font-medium text-slate-500'>
                  {voucherToDelete.validUntil}
                </span>
              </div>
              <p className='text-xs text-red-600 font-semibold pt-2 border-t border-red-100/80 leading-relaxed'>
                ⚠️ Lưu ý: Hành động này là phá hủy và không thể khôi phục.
                Voucher này sẽ biến mất khỏi giỏ hàng của khách hàng đã lưu.
              </p>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setVoucherToDelete(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={confirmDelete}
              className='bg-red-500 text-white hover:bg-red-600 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-red-500/20'
            >
              Đồng ý xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. CUSTOM STATUS CONFIRMATION DIALOG */}
      <Dialog
        open={!!voucherToToggle}
        onOpenChange={(open) => !open && setVoucherToToggle(null)}
      >
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-blue-50 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm'>
                <IconInfoCircle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Thay đổi trạng thái mã giảm giá?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  Điều chỉnh tính khả dụng của mã đối với khách hàng mua sắm.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {voucherToToggle && (
            <div className='space-y-4 my-2 text-sm text-slate-700'>
              <div className='bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-slate-900'>Mã voucher:</span>
                  <span className='font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5'>
                    {voucherToToggle.code}
                  </span>
                </div>
                <div className='flex items-center gap-3 pt-2 border-t border-blue-100/80'>
                  <div className='flex items-center gap-1'>
                    <span className='text-xs font-semibold text-slate-400'>
                      Hiện tại:
                    </span>
                    <Badge
                      variant='outline'
                      className='text-[10px] rounded-full px-2 py-0.5'
                    >
                      {voucherToToggle.status}
                    </Badge>
                  </div>
                  <span className='text-blue-500 font-bold'>➜</span>
                  <div className='flex items-center gap-1'>
                    <span className='text-xs font-semibold text-slate-900'>
                      Thay đổi:
                    </span>
                    <Badge className='text-[10px] bg-blue-600 text-white rounded-full px-2 py-0.5'>
                      {voucherToToggle.status === 'ACTIVE'
                        ? 'PAUSED'
                        : 'ACTIVE'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='text-xs text-slate-500 leading-relaxed px-1 font-medium'>
                {voucherToToggle.status === 'ACTIVE' ? (
                  <span className='text-amber-600'>
                    ⛔ Khi tạm ngưng hoạt động (PAUSED), khách hàng sẽ KHÔNG THỂ
                    áp dụng mã voucher này khi thực hiện thanh toán giỏ hàng.
                  </span>
                ) : (
                  <span className='text-emerald-600'>
                    ✅ Khi tái kích hoạt (ACTIVE), mã giảm giá sẽ được mở khóa
                    ngay lập tức và áp dụng bình thường cho các đơn hàng thỏa
                    mãn điều kiện.
                  </span>
                )}
              </div>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setVoucherToToggle(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy
            </Button>
            <Button
              onClick={confirmToggleStatus}
              className='bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-blue-600/20'
            >
              {voucherToToggle?.status === 'ACTIVE'
                ? 'Tạm ngưng hoạt động'
                : 'Kích hoạt sử dụng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
