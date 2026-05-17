import { Row } from '@tanstack/react-table'
import { Trash2, Search, FilterX } from 'lucide-react'
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
import { Review } from '../../types'

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
  return (
    <div className='flex flex-col gap-4 mb-6'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex flex-1 min-w-[300px] items-center gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Tìm kiếm người dùng, nội dung...'
              value={filterValue || ''}
              onChange={(e) => setFilter('search', e.target.value)}
              className='pl-9 bg-white'
            />
          </div>
          <Button variant='outline' onClick={onReset} className='gap-2 rounded-xl'>
            <FilterX className='h-4 w-4' /> Đặt lại
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            onClick={onDelete}
            disabled={selectedRows.length === 0}
            variant='destructive'
            className='gap-2 rounded-xl'
          >
            <Trash2 className='h-4 w-4' /> Xóa ({selectedRows.length})
          </Button>
        </div>
      </div>

      <div className='flex items-center gap-3 flex-wrap'>
        <Select
          onValueChange={(val) =>
            setFilter('status', val === 'all' ? null : val)
          }
        >
          <SelectTrigger className='bg-white w-[180px] rounded-xl'>
            <SelectValue placeholder='Chọn trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value='all'>Tất cả trạng thái</SelectItem>
              <SelectItem value='PENDING'>Chờ duyệt</SelectItem>
              <SelectItem value='APPROVED'>Đã duyệt</SelectItem>
              <SelectItem value='HIDDEN'>Đã ẩn</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) =>
            setFilter('rating', val === 'all' ? null : Number(val))
          }
        >
          <SelectTrigger className='bg-white w-[180px] rounded-xl'>
            <SelectValue placeholder='Chọn số sao' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Số sao</SelectLabel>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='5'>5 Sao</SelectItem>
              <SelectItem value='4'>4 Sao</SelectItem>
              <SelectItem value='3'>3 Sao</SelectItem>
              <SelectItem value='2'>2 Sao</SelectItem>
              <SelectItem value='1'>1 Sao</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setFilter('sort', val)}>
          <SelectTrigger className='bg-white w-[180px] rounded-xl'>
            <SelectValue placeholder='Sắp xếp theo' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sắp xếp</SelectLabel>
              <SelectItem value='newest'>Mới nhất</SelectItem>
              <SelectItem value='oldest'>Cũ nhất</SelectItem>
              <SelectItem value='rating-desc'>Đánh giá cao nhất</SelectItem>
              <SelectItem value='rating-asc'>Đánh giá thấp nhất</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
