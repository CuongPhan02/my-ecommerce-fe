'use client'
import React, { useState } from 'react'
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
  AlertCircle
} from 'lucide-react'

// Realistic Mock Order Data with detailed items
interface OrderItem {
  id: string
  name: string
  qty: number
  price: number
  image: string
}

interface Order {
  id: string
  customer: string
  email: string
  phone: string
  address: string
  status: 'Hoàn thành' | 'Đang xử lý' | 'Đang giao hàng' | 'Đã hủy'
  paymentMethod: string
  paymentStatus: 'Đã thanh toán' | 'Chờ thanh toán' | 'Đã hoàn tiền'
  date: string
  amount: string
  items: OrderItem[]
}

const initialOrders: Order[] = [
  {
    id: 'ORD-7352',
    customer: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    phone: '0987654321',
    address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    status: 'Hoàn thành',
    paymentMethod: 'Chuyển khoản',
    paymentStatus: 'Đã thanh toán',
    date: '2023-10-25 14:30',
    amount: '$250.00',
    items: [
      { id: 'p1', name: 'Áo sơ mi lụa tơ tằm cổ vest', qty: 1, price: 120, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=60' },
      { id: 'p2', name: 'Quần âu ống suông nam tính', qty: 1, price: 130, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100&auto=format&fit=crop&q=60' },
    ]
  },
  {
    id: 'ORD-7351',
    customer: 'Tran Thi B',
    email: 'tranthib@example.com',
    phone: '0901234567',
    address: '456 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    status: 'Đang xử lý',
    paymentMethod: 'COD',
    paymentStatus: 'Chờ thanh toán',
    date: '2023-10-24 09:15',
    amount: '$120.50',
    items: [
      { id: 'p3', name: 'Đầm lụa trễ vai quyến rũ', qty: 1, price: 120.5, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'ORD-7350',
    customer: 'Le Van C',
    email: 'levanc@example.com',
    phone: '0918888888',
    address: '789 Đường CMT8, Phường 15, Quận 10, TP. Hồ Chí Minh',
    status: 'Đã hủy',
    paymentMethod: 'Thẻ tín dụng',
    paymentStatus: 'Đã hoàn tiền',
    date: '2023-10-23 16:45',
    amount: '$45.00',
    items: [
      { id: 'p4', name: 'Áo thun polo dệt kim ôm dáng', qty: 1, price: 45, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'ORD-7349',
    customer: 'Phạm D',
    email: 'phamd@example.com',
    phone: '0933445566',
    address: '101 Đường Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, TP. Hồ Chí Minh',
    status: 'Đang giao hàng',
    paymentMethod: 'COD',
    paymentStatus: 'Chờ thanh toán',
    date: '2023-10-22 10:20',
    amount: '$721.11',
    items: [
      { id: 'p5', name: 'Áo khoác Blazer dáng rộng thanh lịch', qty: 2, price: 350, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&auto=format&fit=crop&q=60' },
      { id: 'p6', name: 'Quần Short Kaki Hàn Quốc', qty: 1, price: 21.11, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=100&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'ORD-7348',
    customer: 'Hoang E',
    email: 'hoange@example.com',
    phone: '0977665544',
    address: '202 Đường Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
    status: 'Hoàn thành',
    paymentMethod: 'Chuyển khoản',
    paymentStatus: 'Đã thanh toán',
    date: '2023-10-22 08:00',
    amount: '$55.00',
    items: [
      { id: 'p7', name: 'Thắt lưng da bò cao cấp', qty: 1, price: 55, image: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5519?w=100&auto=format&fit=crop&q=60' }
    ]
  },
]

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('LATEST')

  // Details and edit UI states
  const [editStatus, setEditStatus] = useState<Order['status']>('Đang xử lý')
  const [editPaymentStatus, setEditPaymentStatus] = useState<Order['paymentStatus']>('Chờ thanh toán')
  const [editCustomerName, setEditCustomerName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Open details and prefill edit states
  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order)
    setEditStatus(order.status)
    setEditPaymentStatus(order.paymentStatus)
    setEditCustomerName(order.customer)
    setEditPhone(order.phone)
    setEditAddress(order.address)
  }

  // Update order detail action
  const handleUpdateOrder = () => {
    if (!selectedOrder) return

    const updatedOrders = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        // Calculate new amount based on possible edits to list or items
        return {
          ...o,
          customer: editCustomerName,
          phone: editPhone,
          address: editAddress,
          status: editStatus,
          paymentStatus: editPaymentStatus,
        }
      }
      return o
    })

    setOrders(updatedOrders)
    setSelectedOrder(null)

    // Trigger success notification banner
    setToastMessage(`Cập nhật đơn hàng ${selectedOrder.id} thành công!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Filter and Sort orders based on query + filters
  const filteredOrders = orders
    .filter((o) => {
      const matchesSearch = 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter
      const matchesPayment = paymentFilter === 'ALL' || o.paymentStatus === paymentFilter

      return matchesSearch && matchesStatus && matchesPayment
    })
    .sort((a, b) => {
      if (sortBy === 'LATEST') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === 'OLDEST') {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      const amtA = parseFloat(a.amount.replace('$', ''))
      const amtB = parseFloat(b.amount.replace('$', ''))
      if (sortBy === 'PRICE_ASC') return amtA - amtB
      if (sortBy === 'PRICE_DESC') return amtB - amtA
      return 0
    })

  return (
    <div className='flex flex-col gap-4 relative'>
      {/* Dynamic Toast Success Message */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-200 flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-emerald-400/30 animate-in fade-in slide-in-from-top-3 duration-300 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div className="flex flex-col gap-1">
          <h1 className='text-3xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600'>Danh sách đơn hàng</h1>
          <p className="text-muted-foreground text-sm font-medium">Theo dõi, kiểm tra chi tiết và cập nhật tiến độ đơn hàng thời trang.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10">Xuất dữ liệu</Button>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Tìm mã đơn, tên khách, email...'
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái giao hàng</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả đơn hàng</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đang giao hàng">Đang giao hàng</SelectItem>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái thanh toán</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Chờ thanh toán">Chờ thanh toán</SelectItem>
                    <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                    <SelectItem value="Đã hoàn tiền">Đã hoàn tiền</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LATEST">Mới đặt nhất</SelectItem>
                    <SelectItem value="OLDEST">Cũ nhất</SelectItem>
                    <SelectItem value="PRICE_ASC">Giá trị tăng dần</SelectItem>
                    <SelectItem value="PRICE_DESC">Giá trị giảm dần</SelectItem>
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
                <TableHead className="font-bold text-gray-600">Phương thức thanh toán</TableHead>
                <TableHead className="font-bold text-gray-600">Trạng thái giao hàng</TableHead>
                <TableHead className="font-bold text-gray-600">Ngày đặt</TableHead>
                <TableHead className='text-right font-bold text-gray-600'>Tổng tiền</TableHead>
                <TableHead className='text-right font-bold text-gray-600 pr-6'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/30 border-b border-gray-100 transition-colors">
                    <TableCell className='font-bold text-indigo-600 pl-6 text-sm'>{order.id}</TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className="font-semibold text-gray-800 text-sm">{order.customer}</span>
                        <span className='text-muted-foreground text-xs font-medium'>
                          {order.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-700 text-sm">{order.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          order.status === 'Hoàn thành'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'Đang giao hàng'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'Đang xử lý'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-medium text-xs">{order.date}</TableCell>
                    <TableCell className='text-right font-bold text-gray-800 text-sm'>{order.amount}</TableCell>
                    <TableCell className='text-right pr-6'>
                      <Button 
                        variant='ghost' 
                        size='icon' 
                        onClick={() => handleOpenDetails(order)}
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
        </CardContent>
      </Card>

      {/* DETAILED ORDER EDIT & DETAILS DIALOG MODAL */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl rounded-2xl overflow-hidden p-0 border-0 shadow-2xl bg-white max-h-[90vh] flex flex-col">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-black uppercase text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                Chi tiết đơn hàng {selectedOrder?.id}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-gray-400 tracking-wider uppercase mt-1">
                Xem toàn bộ thông tin mua hàng và cập nhật trạng thái giao dịch
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Form and info Container (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Visual Timeline Stepper */}
            {selectedOrder?.status !== 'Đã hủy' ? (
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
                          editStatus === 'Hoàn thành' ? '100%' :
                          editStatus === 'Đang giao hàng' ? '66%' : 
                          editStatus === 'Đang xử lý' ? '33%' : '0%' 
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
                      editStatus === 'Đang xử lý' || editStatus === 'Đang giao hàng' || editStatus === 'Hoàn thành'
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
                      editStatus === 'Đang giao hàng' || editStatus === 'Hoàn thành'
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
                      editStatus === 'Hoàn thành'
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
              
              {/* Left Column: Customer Information & Edit Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  Thông tin nhận hàng
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tên khách hàng</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        className="pl-9 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="pl-9 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Địa chỉ giao hàng</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        rows={3}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 focus:outline-hidden text-sm font-semibold transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order and Transaction Status */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-500" />
                  Giao dịch & Thanh toán
                </h3>

                <div className="space-y-4">
                  {/* Status Dropdowns */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Trạng thái đơn hàng</label>
                    <Select 
                      value={editStatus} 
                      onValueChange={(val) => setEditStatus(val as Order['status'])}
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 text-sm font-semibold h-11 bg-white">
                        <SelectValue placeholder="Trạng thái đơn hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Đang xử lý">Đang xử lý (Processing)</SelectItem>
                        <SelectItem value="Đang giao hàng">Đang giao hàng (Shipping)</SelectItem>
                        <SelectItem value="Hoàn thành">Hoàn thành (Completed)</SelectItem>
                        <SelectItem value="Đã hủy">Đã hủy (Cancelled)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Trạng thái thanh toán</label>
                    <Select 
                      value={editPaymentStatus} 
                      onValueChange={(val) => setEditPaymentStatus(val as Order['paymentStatus'])}
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 text-sm font-semibold h-11 bg-white">
                        <SelectValue placeholder="Trạng thái thanh toán" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chờ thanh toán">Chờ thanh toán (Unpaid)</SelectItem>
                        <SelectItem value="Đã thanh toán">Đã thanh toán (Paid)</SelectItem>
                        <SelectItem value="Đã hoàn tiền">Đã hoàn tiền (Refunded)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                      <span>Phương thức:</span>
                      <span className="font-bold text-gray-800">{selectedOrder?.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                      <span>Ngày lập đơn:</span>
                      <span className="font-bold text-gray-800">{selectedOrder?.date}</span>
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
                Sản phẩm đặt mua ({selectedOrder?.items.length})
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
                    {selectedOrder?.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/20 font-semibold text-gray-800">
                        <td className="p-3 pl-4 flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                          />
                          <span className="line-clamp-1 max-w-[250px]">{item.name}</span>
                        </td>
                        <td className="p-3 text-center text-gray-500 font-bold">x{item.qty}</td>
                        <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                        <td className="p-3 text-right pr-4 text-indigo-600 font-bold">${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Details */}
              <div className="flex flex-col items-end gap-1.5 pt-2 pr-2">
                <div className="flex items-center justify-between w-64 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-bold text-gray-700">{selectedOrder?.amount}</span>
                </div>
                <div className="flex items-center justify-between w-64 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <span>Phí vận chuyển:</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between w-64 text-sm font-black uppercase tracking-tight text-indigo-600 border-t border-gray-100 pt-2 mt-1">
                  <span>Tổng thanh toán:</span>
                  <span className="text-lg text-gray-900 font-black">{selectedOrder?.amount}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Action Buttons */}
          <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedOrder(null)}
              className="rounded-xl border-gray-200 hover:bg-gray-100 font-bold text-gray-700 text-xs px-5 py-2.5 transition-colors"
            >
              Hủy bỏ
            </Button>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleUpdateOrder}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5"
              >
                Cập nhật đơn hàng
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
