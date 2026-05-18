'use client'
import React, { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
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
import { Review } from '../../types'
import {
  IconSearch,
  IconFilter,
  IconFilterOff,
  IconTrash,
  IconAdjustmentsHorizontal,
  IconStar,
} from '@tabler/icons-react'

interface TableToolbarProps {
  filterValue: string
  setFilter: (key: string, value: any) => void
  onReset: () => void
  selectedRows: Row<Review>[]
  onDelete: () => void
}

export function TableToolbar({
  filterValue,
  setFilter,
  onReset,
  selectedRows,
  onDelete,
}: TableToolbarProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Track if any active filters exist to display "Clear Filters"
  const hasActiveFilters = filterValue !== ''

  return (
    <div className='flex flex-col gap-4 mb-6'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        {/* Search bar & quick triggers */}
        <div className='flex flex-1 min-w-[300px] items-center gap-2'>
          <div className='relative flex-1'>
            <IconSearch size={16} className='absolute left-3.5 top-3.5 text-slate-400' />
            <Input
              placeholder='Tìm kiếm người dùng, nội dung bình luận...'
              value={filterValue || ''}
              onChange={(e) => setFilter('search', e.target.value)}
              className='pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-semibold'
            />
          </div>

          <Button
            variant={isFilterDrawerOpen ? 'default' : 'outline'}
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className='h-11 rounded-xl font-bold gap-2'
          >
            <IconAdjustmentsHorizontal size={18} />
            Bộ lọc nâng cao
          </Button>

          {(hasActiveFilters || isFilterDrawerOpen) && (
            <Button
              variant='ghost'
              onClick={() => {
                onReset()
                setIsFilterDrawerOpen(false)
              }}
              className='h-11 rounded-xl text-xs font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 gap-1'
            >
              <IconFilterOff size={16} /> Đặt lại
            </Button>
          )}
        </div>

        {/* Action button */}
        <div className='flex items-center gap-4'>
          <Button
            onClick={onDelete}
            disabled={selectedRows.length === 0}
            variant='destructive'
            className='h-11 gap-2 rounded-xl font-bold px-5 shadow-lg shadow-rose-500/10'
          >
            <IconTrash size={18} /> Xóa đã chọn ({selectedRows.length})
          </Button>
        </div>
      </div>

      {/* Retractable Advanced Filters Panel */}
      {isFilterDrawerOpen && (
        <div className='bg-slate-50/50 p-5 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-200'>
          {/* Status Select */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1'>Trạng thái phê duyệt</Label>
            <Select
              onValueChange={(val) =>
                setFilter('status', val === 'all' ? null : val)
              }
            >
              <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                <SelectValue placeholder='Chọn trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Trạng thái</SelectLabel>
                  <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                  <SelectItem value='PENDING'>Chờ duyệt</SelectItem>
                  <SelectItem value='APPROVED'>Đã duyệt hiển thị</SelectItem>
                  <SelectItem value='HIDDEN'>Đã ẩn danh sách</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Rating Stars Select */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1'>Điểm số đánh giá</Label>
            <Select
              onValueChange={(val) =>
                setFilter('rating', val === 'all' ? null : Number(val))
              }
            >
              <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                <SelectValue placeholder='Chọn số sao đánh giá' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Số sao</SelectLabel>
                  <SelectItem value='all'>Tất cả mức sao</SelectItem>
                  <SelectItem value='5'>5 Sao ⭐⭐⭐⭐⭐</SelectItem>
                  <SelectItem value='4'>4 Sao ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value='3'>3 Sao ⭐⭐⭐</SelectItem>
                  <SelectItem value='2'>2 Sao ⭐⭐</SelectItem>
                  <SelectItem value='1'>1 Sao ⭐</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Sorting Option */}
          <div className='flex flex-col gap-1.5'>
            <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1'>Sắp xếp kết quả</Label>
            <Select onValueChange={(val) => setFilter('sort', val)}>
              <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                <SelectValue placeholder='Sắp xếp theo' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sắp xếp</SelectLabel>
                  <SelectItem value='newest'>Đánh giá mới nhất</SelectItem>
                  <SelectItem value='oldest'>Đánh giá cũ nhất</SelectItem>
                  <SelectItem value='rating-desc'>Sao cao nhất trước</SelectItem>
                  <SelectItem value='rating-asc'>Sao thấp nhất trước</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
