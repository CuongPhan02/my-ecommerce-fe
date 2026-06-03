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
import { _inventoryService } from './inventory.query'
import { Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react'
import { format } from 'date-fns'

export function InventoryTransactions() {
  const [page, setPage] = useState(1)
  const { data: txRes, isLoading } = _inventoryService.useTransactions({
    page,
    limit: 10,
  })

  const transactions = txRes?.result?.data || []

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

  return (
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
  )
}
