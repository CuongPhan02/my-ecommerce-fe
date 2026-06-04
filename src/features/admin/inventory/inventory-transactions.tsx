'use client'
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/core/table'
import { Badge } from '~/components/ui/core/badge'
import { Button } from '~/components/ui/core/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { _inventoryService } from './inventory.query'
import { Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw, Filter } from 'lucide-react'
import { format } from 'date-fns'

const PAGE_SIZE = 10

export function InventoryTransactions() {
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'IMPORT' | 'ADJUST' | 'EXPORT'>('ALL')

  const { data: txRes, isLoading } = _inventoryService.useTransactions({
    page,
    limit: PAGE_SIZE,
    type: typeFilter === 'ALL' ? undefined : typeFilter,
  })

  const transactions = txRes?.result?.data || []
  const totalItems = txRes?.result?.total || 0
  const totalPages = txRes?.result?.totalPages || 1

  // Reset page khi filter thay đổi
  React.useEffect(() => { setPage(1) }, [typeFilter])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tải lịch sử giao dịch...</p>
      </div>
    )
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'IMPORT':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 w-fit">
            <ArrowDownLeft className="w-3 h-3" />
            Nhập kho
          </Badge>
        )
      case 'EXPORT':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1 w-fit">
            <ArrowUpRight className="w-3 h-3" />
            Xuất kho
          </Badge>
        )
      case 'ADJUST':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 w-fit">
            <RefreshCcw className="w-3 h-3" />
            Điều chỉnh
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
      .reduce<(number | '...')[]>((acc, p, idx, arr) => {
        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
        acc.push(p)
        return acc
      }, [])
      .map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} className="px-1.5 text-xs font-bold text-gray-300">…</span>
        ) : (
          <Button
            key={p}
            variant={page === p ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setPage(p as number)}
            className={`h-8 w-8 rounded-lg text-xs font-bold ${
              page === p ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </Button>
        )
      )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400">
          {totalItems > 0 ? `Tổng ${totalItems} giao dịch` : 'Chưa có giao dịch'}
        </span>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger className="w-[160px] rounded-xl border-gray-200 text-xs font-semibold h-9 bg-white">
              <SelectValue placeholder="Loại giao dịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại</SelectItem>
              <SelectItem value="IMPORT">Nhập kho</SelectItem>
              <SelectItem value="ADJUST">Điều chỉnh</SelectItem>
              <SelectItem value="EXPORT">Xuất kho</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="pl-6 font-bold text-gray-600">Thời gian</TableHead>
              <TableHead className="font-bold text-gray-600">Mã SKU</TableHead>
              <TableHead className="font-bold text-gray-600">Loại giao dịch</TableHead>
              <TableHead className="text-right font-bold text-gray-600">Số lượng</TableHead>
              <TableHead className="font-bold text-gray-600">Người thực hiện</TableHead>
              <TableHead className="font-bold text-gray-600 pr-6">Ghi chú / Lý do</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-gray-50/30 transition-colors">
                  <TableCell className="pl-6 text-xs font-medium text-gray-500">
                    {format(new Date(tx.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] font-bold">
                      {tx.productVariant.sku}
                    </Badge>
                  </TableCell>
                  <TableCell>{getTypeBadge(tx.type)}</TableCell>
                  <TableCell className={`text-right font-bold ${tx.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-700">
                    {tx.creator?.name || 'Hệ thống'}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 pr-6 max-w-[200px] truncate">
                    {tx.reason || '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
                  Chưa có giao dịch kho nào được ghi lại.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-2">
          <span className="text-xs font-semibold text-gray-400">
            Hiển thị {(page - 1) * PAGE_SIZE + 1} – {Math.min(page * PAGE_SIZE, totalItems)} trên {totalItems} giao dịch
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-lg h-8 text-xs font-bold border-gray-200 hover:bg-gray-50"
            >
              Trước
            </Button>
            <div className="flex items-center gap-1">
              {renderPageNumbers()}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg h-8 text-xs font-bold border-gray-200 hover:bg-gray-50"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

