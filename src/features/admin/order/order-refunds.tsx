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
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  User, 
  Calendar, 
  ShoppingBag,
  ArrowUpDown,
  FileText,
  BadgePercent,
  CheckCircle,
  Coins
} from 'lucide-react'

interface Refund {
  id: string
  orderId: string
  customer: string
  email: string
  phone: string
  reason: string
  status: 'Chờ duyệt' | 'Đã hoàn tiền' | 'Từ chối'
  date: string
  amount: string
  adminNote?: string
  paymentMethodUsed?: string
}

const initialRefunds: Refund[] = [
  {
    id: 'REF-001',
    orderId: 'ORD-7350',
    customer: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0918888888',
    reason: 'Sản phẩm lỗi dệt kim, rách đường chỉ ở vai áo',
    status: 'Chờ duyệt',
    date: '2023-10-24 10:00',
    amount: '$45.00',
  },
  {
    id: 'REF-002',
    orderId: 'ORD-7210',
    customer: 'Mai Thị G',
    email: 'maithig@example.com',
    phone: '0933556677',
    reason: 'Giao sai mẫu áo blazer (đặt màu Đen nhưng giao màu Xám)',
    status: 'Đã hoàn tiền',
    date: '2023-10-20 14:15',
    amount: '$150.00',
    paymentMethodUsed: 'Ví Aura (Aura Wallet)',
    adminNote: 'Đã xác nhận lỗi gửi nhầm từ bộ phận đóng gói. Duyệt hoàn tiền ngay.'
  },
  {
    id: 'REF-003',
    orderId: 'ORD-7199',
    customer: 'Trần Văn H',
    email: 'tranvanh@example.com',
    phone: '0977443322',
    reason: 'Sản phẩm mặc không vừa (muốn đổi kích thước nhưng hết hàng)',
    status: 'Từ chối',
    date: '2023-10-18 09:30',
    amount: '$89.00',
    adminNote: 'Sản phẩm đã qua sử dụng, có mùi nước hoa và bị mất nhãn mác, không đáp ứng điều kiện đổi trả.'
  },
]

export function OrderRefunds() {
  const [refunds, setRefunds] = useState<Refund[]>(initialRefunds)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('LATEST')

  // Dialog States
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null)
  const [adminNoteInput, setAdminNoteInput] = useState('')
  const [refundMethod, setRefundMethod] = useState('AURA_WALLET')

  // Open confirmation handler
  const handleOpenConfirm = (refund: Refund, type: 'APPROVE' | 'REJECT') => {
    setSelectedRefund(refund)
    setActionType(type)
    setAdminNoteInput(refund.adminNote || '')
    setRefundMethod('AURA_WALLET')
  }

  // Handle action execution
  const handleExecuteAction = () => {
    if (!selectedRefund || !actionType) return

    const updatedRefunds = refunds.map((r) => {
      if (r.id === selectedRefund.id) {
        if (actionType === 'APPROVE') {
          const methodLabels: Record<string, string> = {
            AURA_WALLET: 'Ví Aura (Instant)',
            CREDIT_CARD: 'Thẻ tín dụng liên kết',
            BANK_TRANSFER: 'Chuyển khoản ngân hàng'
          }
          return {
            ...r,
            status: 'Đã hoàn tiền' as const,
            paymentMethodUsed: methodLabels[refundMethod] || 'Ví Aura (Instant)',
            adminNote: adminNoteInput || 'Đã duyệt hoàn tiền.'
          }
        } else {
          return {
            ...r,
            status: 'Từ chối' as const,
            adminNote: adminNoteInput || 'Không đủ điều kiện đổi trả hoàn tiền.'
          }
        }
      }
      return r
    })

    setRefunds(updatedRefunds)
    
    // Set notification
    const actionText = actionType === 'APPROVE' ? 'Duyệt hoàn tiền' : 'Từ chối yêu cầu'
    setToastMessage(`${actionText} ${selectedRefund.id} thành công!`)
    setTimeout(() => setToastMessage(null), 3000)

    // Reset modals states
    setSelectedRefund(null)
    setActionType(null)
  }

  // Filter and sort refunds logic
  const filteredRefunds = refunds
    .filter((r) => {
      const matchesSearch = 
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter

      return matchesSearch && matchesStatus
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
      if (sortBy === 'AMOUNT_DESC') return amtB - amtA
      if (sortBy === 'AMOUNT_ASC') return amtA - amtB
      return 0
    })

  return (
    <div className='flex flex-col gap-4 relative'>
      {/* Premium Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-200 flex items-center gap-3 bg-indigo-600 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-indigo-400/30 animate-in fade-in slide-in-from-top-3 duration-300 font-bold text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div className="flex flex-col gap-1">
          <h1 className='text-3xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600'>Đổi trả & Hoàn tiền</h1>
          <p className="text-muted-foreground text-sm font-medium">Quản lý và giải quyết các khiếu nại đổi trả sản phẩm, hoàn tiền từ khách hàng.</p>
        </div>
      </div>

      <Card className="border-gray-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className='pb-4 border-b border-gray-100 bg-gray-50/50'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Coins className="w-5 h-5 text-indigo-500" />
                Yêu cầu hoàn trả phí dịch vụ & hàng lỗi
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Kiểm tra thông tin chi tiết và đưa ra quyết định duyệt/từ chối
              </CardDescription>
            </div>
            <div className='flex items-center gap-3'>
              <div className='relative w-full md:w-[280px]'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  type='search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Tìm mã yêu cầu, mã đơn, khách...'
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

          {/* Expandable Filter Grid */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái xử lý</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
                    <SelectItem value="Đã hoàn tiền">Đã hoàn tiền</SelectItem>
                    <SelectItem value="Từ chối">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LATEST">Yêu cầu mới nhất</SelectItem>
                    <SelectItem value="OLDEST">Yêu cầu cũ nhất</SelectItem>
                    <SelectItem value="AMOUNT_DESC">Giá trị giảm dần</SelectItem>
                    <SelectItem value="AMOUNT_ASC">Giá trị tăng dần</SelectItem>
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
                <TableHead className='w-[120px] font-bold text-gray-600 pl-6'>Mã Y/C</TableHead>
                <TableHead className="font-bold text-gray-600">Mã đơn hàng</TableHead>
                <TableHead className="font-bold text-gray-600">Khách hàng</TableHead>
                <TableHead className="font-bold text-gray-600">Lý do hoàn trả</TableHead>
                <TableHead className="font-bold text-gray-600">Trạng thái</TableHead>
                <TableHead className="font-bold text-gray-600">Ngày gửi yêu cầu</TableHead>
                <TableHead className='text-right font-bold text-gray-600'>Số tiền hoàn</TableHead>
                <TableHead className='text-right font-bold text-gray-600 pr-6'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.length > 0 ? (
                filteredRefunds.map((refund) => (
                  <TableRow key={refund.id} className="hover:bg-gray-50/30 border-b border-gray-100 transition-colors">
                    <TableCell className='font-bold text-indigo-600 pl-6 text-sm'>{refund.id}</TableCell>
                    <TableCell className="font-semibold text-gray-700">{refund.orderId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{refund.customer}</span>
                        <span className="text-gray-400 text-xs font-medium">{refund.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-[240px]'>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-gray-700 text-sm font-medium block truncate" title={refund.reason}>
                          {refund.reason}
                        </span>
                        {refund.adminNote && (
                          <span className="text-xs text-amber-600 font-semibold italic flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 inline shrink-0" />
                            Ghi chú: {refund.adminNote}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm transition-all border ${
                          refund.status === 'Đã hoàn tiền'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : refund.status === 'Chờ duyệt'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {refund.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs font-semibold">{refund.date}</TableCell>
                    <TableCell className='text-right font-extrabold text-rose-600 pl-4'>{refund.amount}</TableCell>
                    <TableCell className='text-right pr-6'>
                      {refund.status === 'Chờ duyệt' ? (
                        <div className='flex justify-end gap-2.5'>
                          <Button 
                            variant='outline' 
                            size='sm' 
                            onClick={() => handleOpenConfirm(refund, 'APPROVE')}
                            className='text-emerald-600 hover:text-white hover:bg-emerald-600 border-emerald-200 font-bold text-xs h-8 px-3 rounded-lg flex items-center gap-1.5 transition-all'
                          >
                            <CheckCircle2 className='h-3.5 w-3.5' />
                            Duyệt
                          </Button>
                          <Button 
                            variant='outline' 
                            size='sm' 
                            onClick={() => handleOpenConfirm(refund, 'REJECT')}
                            className='text-rose-600 hover:text-white hover:bg-rose-600 border-rose-200 font-bold text-xs h-8 px-3 rounded-lg flex items-center gap-1.5 transition-all'
                          >
                            <XCircle className='h-3.5 w-3.5' />
                            Từ chối
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-semibold italic">
                          {refund.status === 'Đã hoàn tiền' ? `Bằng ${refund.paymentMethodUsed}` : 'Yêu cầu bị từ chối'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400 font-semibold">
                    Không tìm thấy yêu cầu hoàn trả nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation & Note Form Dialog */}
      {selectedRefund && actionType && (
        <Dialog open={!!selectedRefund} onOpenChange={() => setSelectedRefund(null)}>
          <DialogContent className="max-w-lg rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl p-6">
            <DialogHeader className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${
                  actionType === 'APPROVE' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' 
                    : 'bg-rose-50 text-rose-600 border border-rose-200/50'
                }`}>
                  {actionType === 'APPROVE' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-gray-800">
                    {actionType === 'APPROVE' ? 'Xác nhận Duyệt Hoàn Tiền' : 'Từ chối yêu cầu hoàn tiền'}
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-400">
                    Yêu cầu {selectedRefund.id} cho đơn hàng {selectedRefund.orderId}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-5 space-y-4 pt-3 border-t border-gray-100">
              {/* Detailed Context Banner */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">Khách hàng:</span>
                  <span className="font-bold text-gray-800">{selectedRefund.customer} ({selectedRefund.phone})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">Số tiền yêu cầu:</span>
                  <span className="font-extrabold text-rose-600 text-base">{selectedRefund.amount}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1">
                  <span className="font-semibold text-gray-500">Lý do từ khách hàng:</span>
                  <p className="font-medium text-gray-600 text-xs italic bg-white p-2 rounded-lg border border-gray-100">
                    "{selectedRefund.reason}"
                  </p>
                </div>
              </div>

              {/* Conditional options for approval */}
              {actionType === 'APPROVE' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phương thức hoàn tiền</label>
                  <Select value={refundMethod} onValueChange={setRefundMethod}>
                    <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-bold h-10.5 bg-white">
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AURA_WALLET">Ví Aura (Cộng điểm thưởng Aura Wallet - Instant)</SelectItem>
                      <SelectItem value="CREDIT_CARD">Hoàn về thẻ tín dụng đã liên kết (2 - 5 ngày)</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Chuyển khoản thủ công qua ngân hàng ngân lượng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* General Admin Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {actionType === 'APPROVE' ? 'Ghi chú phê duyệt (Nội bộ)' : 'Lý do từ chối (Gửi đến khách hàng) *'}
                </label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder={actionType === 'APPROVE' ? 'Ví dụ: Đã nhận lại hàng lỗi tại kho, sản phẩm đủ điều kiện hoàn trả.' : 'Ví dụ: Hàng đã mất mác nhãn, có dấu hiệu đã giặt ủi...'}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-medium placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setSelectedRefund(null)}
                className="rounded-xl border-gray-200 font-bold text-sm h-10.5 hover:bg-gray-50"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleExecuteAction}
                disabled={actionType === 'REJECT' && !adminNoteInput.trim()}
                className={`rounded-xl font-bold text-sm h-10.5 text-white ${
                  actionType === 'APPROVE' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10' 
                    : 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/10'
                }`}
              >
                {actionType === 'APPROVE' ? 'Xác nhận duyệt hoàn tiền' : 'Xác nhận từ chối'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
