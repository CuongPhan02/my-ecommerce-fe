'use client'
import React, { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/core/table'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { 
  Search, 
  Eye, 
  Filter, 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Clock,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { _orderService } from './order.query'
import { _orderApi } from './order.api'
import { exportOrdersToCSV } from './utils/export-orders'
import { Order, OrderStatus, PaymentStatus } from './types'
import { useDebounce } from '~/hooks/use-debounce'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { cn } from '~/lib/utils'

const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  SHIPPED: { label: 'Đang giao hàng', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'Hoàn thành', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  RETURNED: { label: 'Trả hàng', color: 'bg-orange-50 text-orange-700 border-orange-200' },
}

const paymentStatusMap: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  COMPLETED: { label: 'Đã thanh toán', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FAILED: { label: 'Thanh toán lỗi', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
}

export function OrderList() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_asc' | 'amount_desc'>('newest')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [isExporting, setIsExporting] = useState(false)

  // Fetch Orders
  const { data: ordersRes, isLoading } = _orderService.useOrders({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    paymentStatus: paymentFilter === 'ALL' ? undefined : paymentFilter,
    sort: sortBy,
  })

  // Fetch Order Detail
  const { data: orderDetailRes, isLoading: isLoadingDetail } = _orderService.useOrder(selectedOrderId || '')
  const selectedOrder = orderDetailRes?.result

  const updateOrderMutation = _orderService.useUpdateOrder()

  const orders = ordersRes?.result?.data || []
  const totalItems = ordersRes?.result?.meta?.total || 0
  const totalPages = ordersRes?.result?.meta?.totalPages || 0

  // Details and edit UI states
  const [editStatus, setEditStatus] = useState<OrderStatus>('PENDING')
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('PENDING')

  // Sync edit states when order detail loads
  React.useEffect(() => {
    if (selectedOrder) {
      setEditStatus(selectedOrder.status)
      setEditPaymentStatus(selectedOrder.payment?.status || 'PENDING')
    }
  }, [selectedOrder])

  // Update order status action
  const handleUpdateOrder = async () => {
    if (!selectedOrderId) return

    try {
      await updateOrderMutation.mutateAsync({
        id: selectedOrderId,
        data: {
          status: editStatus,
          paymentStatus: editPaymentStatus,
        },
      })
      setSelectedOrderId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm')
    } catch {
      return '-'
    }
  }

  const handleExportOrders = async () => {
    try {
      setIsExporting(true)
      toast.info('Đang chuẩn bị dữ liệu xuất báo cáo...', { autoClose: 2000 })
      
      const res = await _orderApi.fetchOrders({
        page: 1,
        limit: 10000,
        search: debouncedSearch || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        paymentStatus: paymentFilter === 'ALL' ? undefined : paymentFilter,
        sort: sortBy,
      })
      
      const allOrders = res.result?.data || []
      
      if (allOrders.length === 0) {
        toast.warning('Không có dữ liệu đơn hàng để xuất!')
        return
      }
      
      exportOrdersToCSV(allOrders)
      toast.success('Xuất dữ liệu đơn hàng thành công!')
    } catch (error) {
      console.error('Lỗi khi xuất đơn hàng:', error)
      toast.error('Có lỗi xảy ra khi xuất dữ liệu!')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className='flex flex-col gap-4 relative'>
      <div className='flex items-center justify-between'>
        <div className="flex flex-col gap-1">
          <h1 className='text-3xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600'>Danh sách đơn hàng</h1>
          <p className="text-muted-foreground text-sm font-medium">Theo dõi, kiểm tra chi tiết và cập nhật tiến độ đơn hàng.</p>
        </div>
        <Button 
          onClick={handleExportOrders}
          disabled={isExporting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang xuất...
            </>
          ) : 'Xuất dữ liệu'}
        </Button>
      </div>

      <Card className="border-gray-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className='pb-4 border-b border-gray-100 bg-gray-50/50'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                Bộ lọc đơn hàng
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tìm kiếm thông tin đơn hàng nhanh chóng
              </CardDescription>
            </div>
            <div className='flex items-center gap-3'>
              <div className='relative w-full md:w-[280px]'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  type='search'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  placeholder='Mã đơn, tên khách, email...'
                  className='pl-9 w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder-gray-400 h-10 text-sm font-medium'
                />
              </div>
              <Button 
                variant={showFilters ? 'default' : 'outline'} 
                size='icon' 
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-xl h-10 w-10 transition-all ${
                  showFilters ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Expandable Advanced Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái đơn hàng</label>
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val as any); setPage(1); }}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả đơn hàng</SelectItem>
                    {Object.entries(statusMap).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái thanh toán</label>
                <Select value={paymentFilter} onValueChange={(val) => { setPaymentFilter(val as any); setPage(1); }}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    {Object.entries(paymentStatusMap).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới đặt nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="amount_asc">Giá trị tăng dần</SelectItem>
                    <SelectItem value="amount_desc">Giá trị giảm dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="hover:bg-transparent border-b border-gray-100">
                <TableHead className='w-[120px] font-bold text-gray-600 pl-6'>Mã đơn</TableHead>
                <TableHead className="font-bold text-gray-600">Khách hàng</TableHead>
                <TableHead className="font-bold text-gray-600">Thanh toán</TableHead>
                <TableHead className="font-bold text-gray-600">Trạng thái đơn</TableHead>
                <TableHead className="font-bold text-gray-600">Ngày đặt</TableHead>
                <TableHead className='text-right font-bold text-gray-600'>Tổng tiền</TableHead>
                <TableHead className={cn(
                  'text-right font-bold text-gray-600 pr-6 sticky right-0 z-20 bg-gray-50/80 shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                )}>
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={7} className="h-16 bg-gray-50/20" />
                  </TableRow>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id} className="group hover:bg-gray-50/30 border-b border-gray-100 transition-colors">
                    <TableCell className='font-bold text-indigo-600 pl-6 text-[11px] truncate max-w-[100px]'>{order.id}</TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className="font-semibold text-gray-800 text-sm">{order.customer?.name || 'Ẩn danh'}</span>
                        <span className='text-muted-foreground text-xs font-medium'>
                          {order.customer?.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-gray-700">{order.payment?.method}</span>
                          <Badge className={`w-fit text-[10px] px-2 py-0 h-5 ${paymentStatusMap[order.payment?.status || 'PENDING'].color}`}>
                            {paymentStatusMap[order.payment?.status || 'PENDING'].label}
                          </Badge>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${statusMap[order.status].color}`}
                      >
                        {statusMap[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-medium text-xs">{formatDateTime(order.createdAt)}</TableCell>
                    <TableCell className='text-right font-bold text-gray-800 text-sm'>{order.totalAmountFormatted}</TableCell>
                    <TableCell className={cn(
                      'text-right pr-6 sticky right-0 z-10 bg-white dark:bg-slate-950 group-hover:bg-gray-50/30 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                    )}>
                      <Button 
                        variant='ghost' 
                        size='icon' 
                        onClick={() => setSelectedOrderId(order.id)}
                        title='Chi tiết & Cập nhật'
                        className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-all duration-200"
                      >
                        <Eye className='h-4.5 w-4.5' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-400 font-bold">
                    Không tìm thấy đơn hàng nào khớp với tìm kiếm.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-400">
                Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} trên {totalItems} đơn hàng
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-lg h-8 text-xs font-bold"
                >
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? 'default' : 'ghost'}
                      size='icon'
                      onClick={() => setPage(i + 1)}
                      className="h-8 w-8 rounded-lg text-xs font-bold"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-lg h-8 text-xs font-bold"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DETAILED ORDER EDIT & DETAILS DIALOG MODAL */}
      <Dialog open={selectedOrderId !== null} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
        <DialogContent className="max-w-3xl rounded-2xl overflow-hidden p-0 border-0 shadow-2xl bg-white max-h-[95vh] flex flex-col">
          {isLoadingDetail ? (
             <div className="h-96 flex flex-col items-center justify-center gap-4">
                <DialogTitle className="sr-only">Đang tải chi tiết đơn hàng</DialogTitle>
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-sm font-bold text-gray-500">Đang tải chi tiết đơn hàng...</p>
             </div>
          ) : !selectedOrder ? (
            <div className="p-10 text-center">
               <DialogTitle className="sr-only">Không tìm thấy đơn hàng</DialogTitle>
               <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
               <h3 className="text-lg font-bold">Không tìm thấy đơn hàng</h3>
            </div>
          ) : (
            <>
              {/* Header */}
              <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-black uppercase text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                    Chi tiết đơn hàng #{selectedOrder.id.slice(-8).toUpperCase()}
                  </DialogTitle>
                  <DialogDescription className="text-xs font-semibold text-gray-400 tracking-wider uppercase mt-1">
                    Mã đầy đủ: {selectedOrder.id}
                  </DialogDescription>
                </div>
              </DialogHeader>

              {/* Form and info Container (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Visual Timeline Stepper */}
                {selectedOrder.status !== 'CANCELLED' ? (
                  <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-5">
                    <h4 className="text-xs font-bold uppercase text-indigo-600 tracking-wider mb-4 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Tiến độ đơn hàng hiện tại
                    </h4>
                    <div className="flex items-center justify-between w-full max-w-lg mx-auto relative pt-2">
                      {/* Progress line */}
                      <div className="absolute top-[26px] left-[5%] right-[5%] h-0.5 bg-gray-200 z-0">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-500" 
                          style={{ 
                            width: 
                              editStatus === 'DELIVERED' ? '100%' :
                              editStatus === 'SHIPPED' ? '66%' : 
                              editStatus === 'PROCESSING' ? '33%' : '0%' 
                          }} 
                        />
                      </div>

                      {/* Step 1: Đã đặt */}
                      <div className="flex flex-col items-center gap-2 z-10 relative">
                        <div className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-500/25">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">Đặt hàng</span>
                      </div>

                      {/* Step 2: Đang xử lý */}
                      <div className="flex flex-col items-center gap-2 z-10 relative">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                          ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(editStatus)
                            ? 'bg-indigo-500 text-white shadow-indigo-500/25'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">Xử lý</span>
                      </div>

                      {/* Step 3: Đang giao hàng */}
                      <div className="flex flex-col items-center gap-2 z-10 relative">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                          ['SHIPPED', 'DELIVERED'].includes(editStatus)
                            ? 'bg-indigo-500 text-white shadow-indigo-500/25'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">Đang giao</span>
                      </div>

                      {/* Step 4: Hoàn thành */}
                      <div className="flex flex-col items-center gap-2 z-10 relative">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                          editStatus === 'DELIVERED'
                            ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">Hoàn thành</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-rose-800">Đơn hàng này đã bị hủy bỏ</h4>
                      <p className="text-xs text-rose-600 mt-0.5 font-medium">Toàn bộ quy trình hoàn tiền và hoàn kho đã được tự động xử lý bởi hệ thống.</p>
                    </div>
                  </div>
                )}

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-500" />
                      Thông tin nhận hàng
                    </h3>

                    <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Tên khách hàng</label>
                        <p className="text-sm font-bold text-gray-800">{selectedOrder.customer?.name}</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Số điện thoại / Email</label>
                        <p className="text-sm font-bold text-gray-800">{selectedOrder.customer?.phone} - {selectedOrder.customer?.email}</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Địa chỉ giao hàng</label>
                        <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                          {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Order and Transaction Status Edit */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      Quản lý trạng thái
                    </h3>

                    <div className="space-y-4">
                      {/* Status Dropdowns */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Trạng thái đơn hàng</label>
                        <Select 
                          value={editStatus} 
                          onValueChange={(val) => setEditStatus(val as OrderStatus)}
                        >
                          <SelectTrigger className="w-full rounded-xl border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 text-sm font-semibold h-11 bg-white">
                            <SelectValue placeholder="Trạng thái đơn hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusMap).map(([key, { label }]) => (
                               <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Trạng thái thanh toán</label>
                        <Select 
                          value={editPaymentStatus} 
                          onValueChange={(val) => setEditPaymentStatus(val as PaymentStatus)}
                        >
                          <SelectTrigger className="w-full rounded-xl border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 text-sm font-semibold h-11 bg-white">
                            <SelectValue placeholder="Trạng thái thanh toán" />
                          </SelectTrigger>
                          <SelectContent>
                             {Object.entries(paymentStatusMap).map(([key, { label }]) => (
                               <SelectItem key={key} value={key}>{label}</SelectItem>
                             ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                          <span>Phương thức:</span>
                          <span className="font-bold text-gray-800">{selectedOrder.payment?.method}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                          <span>Mã giao dịch:</span>
                          <span className="font-bold text-gray-800 text-[10px]">{selectedOrder.payment?.transactionId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2" />

                {/* Bottom Section: Ordered Items List Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-indigo-500" />
                    Sản phẩm đặt mua ({(selectedOrder.items || []).length})
                  </h3>
                  
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-100 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <th className="p-3 pl-4">Sản phẩm</th>
                          <th className="p-3 text-center">Số lượng</th>
                          <th className="p-3 text-right">Đơn giá</th>
                          <th className="p-3 text-right pr-4">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {(selectedOrder.items || []).map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/20 font-semibold text-gray-800">
                            <td className="p-3 pl-4 flex items-center gap-3">
                              <img 
                                src={item.product?.thumbnail?.url || ''} 
                                alt={item.product?.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                              />
                              <div className="flex flex-col">
                                <span className="line-clamp-1 max-w-[250px]">{item.product?.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">{item.variant?.sku}</span>
                              </div>
                            </td>
                            <td className="p-3 text-center text-gray-500 font-bold">x{item.quantity}</td>
                            <td className="p-3 text-right">{item.priceAtPurchaseFormatted}</td>
                            <td className="p-3 text-right pr-4 text-indigo-600 font-bold">
                               {(item.priceAtPurchase * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Summary Details */}
                  <div className="flex flex-col items-end gap-1.5 pt-2 pr-2">
                    <div className="flex items-center justify-between w-64 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <span>Tổng tiền hàng:</span>
                      <span className="font-bold text-gray-700">{selectedOrder.totalAmountFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between w-64 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <span>Giảm giá:</span>
                      <span className="text-rose-500 font-bold">-{selectedOrder.discountAmountFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between w-64 text-sm font-black uppercase tracking-tight text-indigo-600 border-t border-gray-100 pt-2 mt-1">
                      <span>Tổng thanh toán:</span>
                      <span className="text-lg text-gray-900 font-black">{selectedOrder.totalAmountFormatted}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Action Buttons */}
              <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrderId(null)}
                  className="rounded-xl border-gray-200 hover:bg-gray-100 font-bold text-gray-700 text-xs px-5 py-2.5 transition-colors"
                >
                  Hủy bỏ
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleUpdateOrder}
                    disabled={updateOrderMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5"
                  >
                    {updateOrderMutation.isPending ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Đang lưu...
                        </>
                    ) : 'Cập nhật đơn hàng'}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

