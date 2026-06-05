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
  Coins,
  Loader2
} from 'lucide-react'
import { _refundService } from './refund.query'
import { Refund, RefundStatus } from './refund.types'
import { useDebounce } from '~/hooks/use-debounce'
import { format } from 'date-fns'
import { cn } from '~/lib/utils'

const statusMap: Record<RefundStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  APPROVED: { label: 'Đã hoàn tiền', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Từ chối', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export function OrderRefunds() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<RefundStatus | 'ALL'>('ALL')
  const [sortBy, setSortBy] = useState<'desc' | 'asc'>('desc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Fetch Refunds
  const { data: refundsRes, isLoading } = _refundService.useRefunds({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    sort: sortBy,
  })

  const approveMutation = _refundService.useApproveRefund()
  const rejectMutation = _refundService.useRejectRefund()

  const refunds = refundsRes?.result?.data || []
  const totalItems = refundsRes?.result?.meta?.total || 0
  const totalPages = refundsRes?.result?.meta?.totalPages || 0

  // Dialog States
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null)
  const [adminNoteInput, setAdminNoteInput] = useState('')
  const [rejectReasonInput, setRejectReasonInput] = useState('')
  const [refundMethod, setRefundMethod] = useState('BANK_TRANSFER')

  // Open confirmation handler
  const handleOpenConfirm = (refund: Refund, type: 'APPROVE' | 'REJECT') => {
    setSelectedRefund(refund)
    setActionType(type)
    setAdminNoteInput(refund.internalNote || '')
    setRejectReasonInput(refund.rejectReason || '')
    setRefundMethod('BANK_TRANSFER')
  }

  // Handle action execution
  const handleExecuteAction = async () => {
    if (!selectedRefund || !actionType) return

    try {
      if (actionType === 'APPROVE') {
        await approveMutation.mutateAsync({
          id: selectedRefund.id,
          data: {
            refundMethod,
            internalNote: adminNoteInput,
          },
        })
      } else {
        await rejectMutation.mutateAsync({
          id: selectedRefund.id,
          data: {
            rejectReason: rejectReasonInput,
          },
        })
      }
      setSelectedRefund(null)
      setActionType(null)
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

  return (
    <div className='flex flex-col gap-4 relative'>
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
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
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val as any); setPage(1); }}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    {Object.entries(statusMap).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Mới nhất</SelectItem>
                    <SelectItem value="asc">Cũ nhất</SelectItem>
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
                <TableHead className="font-bold text-gray-600">Ngày gửi</TableHead>
                <TableHead className='text-right font-bold text-gray-600'>Số tiền hoàn</TableHead>
                <TableHead className={cn(
                  'text-right font-bold text-gray-600 pr-6 sticky right-0 z-20 bg-gray-50/80 shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                )}>
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={8} className="h-16 bg-gray-50/20" />
                  </TableRow>
                ))
              ) : refunds.length > 0 ? (
                refunds.map((refund) => (
                  <TableRow key={refund.id} className="group hover:bg-gray-50/30 border-b border-gray-100 transition-colors">
                    <TableCell className='font-bold text-indigo-600 pl-6 text-[10px] truncate max-w-[80px]'>{refund.code}</TableCell>
                    <TableCell className="font-semibold text-gray-700 text-[10px] truncate max-w-[80px]">{refund.orderId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs">{refund.user?.name || 'Ẩn danh'}</span>
                        <span className="text-gray-400 text-[10px] font-medium">{refund.user?.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-[200px]'>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-gray-700 text-xs font-medium block truncate" title={refund.reason}>
                          {refund.reason}
                        </span>
                        {refund.internalNote && (
                          <span className="text-[10px] text-amber-600 font-semibold italic flex items-center gap-1">
                            <FileText className="w-3 h-3 inline shrink-0" />
                            Ghi chú: {refund.internalNote}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-full px-2 py-0 h-5 text-[10px] font-bold shadow-sm transition-all border ${statusMap[refund.status].color}`}
                      >
                        {statusMap[refund.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-[10px] font-semibold">{formatDateTime(refund.createdAt)}</TableCell>
                    <TableCell className='text-right font-extrabold text-rose-600 pl-4 text-xs'>{refund.amountFormatted}</TableCell>
                    <TableCell className={cn(
                      'text-right pr-6 sticky right-0 z-10 bg-white dark:bg-slate-950 group-hover:bg-gray-50/30 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                    )}>
                      {refund.status === 'PENDING' ? (
                        <div className='flex justify-end gap-2'>
                          <Button 
                            variant='outline' 
                            size='sm' 
                            onClick={() => handleOpenConfirm(refund, 'APPROVE')}
                            className='text-emerald-600 hover:text-white hover:bg-emerald-600 border-emerald-200 font-bold text-[10px] h-7 px-2 rounded-lg flex items-center gap-1 transition-all'
                          >
                            <CheckCircle2 className='h-3 w-3' />
                            Duyệt
                          </Button>
                          <Button 
                            variant='outline' 
                            size='sm' 
                            onClick={() => handleOpenConfirm(refund, 'REJECT')}
                            className='text-rose-600 hover:text-white hover:bg-rose-600 border-rose-200 font-bold text-[10px] h-7 px-2 rounded-lg flex items-center gap-1 transition-all'
                          >
                            <XCircle className='h-3 w-3' />
                            Từ chối
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold italic">
                          {refund.status === 'APPROVED' ? `Bằng ${refund.refundMethod || 'N/A'}` : 'Đã từ chối'}
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

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-400">
                Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} trên {totalItems} yêu cầu
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
                    Yêu cầu {selectedRefund.code} cho đơn hàng {selectedRefund.orderId}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-5 space-y-4 pt-3 border-t border-gray-100">
              {/* Detailed Context Banner */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">Khách hàng:</span>
                  <span className="font-bold text-gray-800">{selectedRefund.user?.name} ({selectedRefund.user?.phone})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">Số tiền yêu cầu:</span>
                  <span className="font-extrabold text-rose-600 text-base">{selectedRefund.amountFormatted}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1">
                  <span className="font-semibold text-gray-500">Lý do từ khách hàng:</span>
                  <p className="font-medium text-gray-600 text-xs italic bg-white p-2 rounded-lg border border-gray-100">
                    "{selectedRefund.reason}"
                  </p>
                </div>
              </div>

              {/* Conditional options for approval */}
              {actionType === 'APPROVE' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phương thức hoàn tiền</label>
                    <Select value={refundMethod} onValueChange={setRefundMethod}>
                      <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-bold h-10.5 bg-white">
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BANK_TRANSFER">Chuyển khoản ngân hàng</SelectItem>
                        <SelectItem value="CASH">Tiền mặt</SelectItem>
                        <SelectItem value="WALLET">Ví Aura (Nếu có)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ghi chú nội bộ</label>
                    <textarea
                      rows={2}
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder='Ví dụ: Đã nhận lại hàng, đủ điều kiện hoàn tiền.'
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-medium placeholder-gray-400 bg-white"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do từ chối *</label>
                  <textarea
                    rows={3}
                    value={rejectReasonInput}
                    onChange={(e) => setRejectReasonInput(e.target.value)}
                    placeholder='Ví dụ: Sản phẩm đã qua sử dụng, mất nhãn mác...'
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-medium placeholder-gray-400 bg-white"
                  />
                </div>
              )}
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
                disabled={approveMutation.isPending || rejectMutation.isPending || (actionType === 'REJECT' && !rejectReasonInput.trim())}
                className={`rounded-xl font-bold text-sm h-10.5 text-white ${
                  actionType === 'APPROVE' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10' 
                    : 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/10'
                }`}
              >
                {(approveMutation.isPending || rejectMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  actionType === 'APPROVE' ? 'Xác nhận duyệt hoàn tiền' : 'Xác nhận từ chối'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

