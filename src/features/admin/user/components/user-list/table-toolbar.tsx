import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { Trash2, Search, FilterX, UserPlus, Filter } from 'lucide-react'
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
import { User } from '../../types'

interface TableToolbarProps {
  filterValue: string
  setFilter: (key: string, value: any) => void
  onReset: () => void
  selectedRows: Row<User>[]
  onDelete: () => void
  onAdd: () => void
}

export function TableToolbar({
  filterValue,
  setFilter,
  onReset,
  selectedRows,
  onDelete,
  onAdd,
}: TableToolbarProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className='flex flex-col gap-4 mb-6'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex flex-1 min-w-[300px] items-center gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Tìm kiếm họ tên, email, số điện thoại...'
              value={filterValue || ''}
              onChange={(e) => setFilter('search', e.target.value)}
              className='pl-10 bg-white rounded-xl border-gray-200 h-10 text-sm'
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className={`gap-2 rounded-xl border-gray-200 h-10 ${
              showFilters ? 'bg-primary text-white hover:opacity-90' : 'hover:bg-gray-50'
            }`}
          >
            <Filter className='h-4 w-4' /> Bộ lọc
          </Button>
          <Button variant='outline' onClick={onReset} className='gap-2 rounded-xl border-gray-200 h-10 shrink-0'>
            <FilterX className='h-4 w-4' /> Đặt lại
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            onClick={onDelete}
            disabled={selectedRows.length === 0}
            variant='destructive'
            className='gap-2 rounded-xl h-10 shadow-lg shadow-red-500/10'
          >
            <Trash2 className='h-4 w-4' /> Xóa ({selectedRows.length})
          </Button>
          <Button onClick={onAdd} className='gap-2 rounded-xl h-10 shadow-lg shadow-primary/20'>
            <UserPlus className='h-4 w-4' /> Thêm người dùng
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className='bg-gray-50/60 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 flex-wrap animate-in fade-in slide-in-from-top-2 duration-200'>
          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-semibold text-slate-500 pl-1'>Vai trò</span>
            <Select
              onValueChange={(val) =>
                setFilter('role', val === 'all' ? null : val)
              }
            >
              <SelectTrigger className='bg-white w-[180px] rounded-xl border-gray-200 shadow-sm h-10'>
                <SelectValue placeholder='Chọn vai trò' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Vai trò</SelectLabel>
                  <SelectItem value='all'>Tất cả vai trò</SelectItem>
                  <SelectItem value='CUSTOMER'>Khách hàng (CUSTOMER)</SelectItem>
                  <SelectItem value='STAFF'>Nhân viên (STAFF)</SelectItem>
                  <SelectItem value='VENDOR'>Đối tác (VENDOR)</SelectItem>
                  <SelectItem value='SALES'>Kinh doanh (SALES)</SelectItem>
                  <SelectItem value='EDITOR'>Biên tập (EDITOR)</SelectItem>
                  <SelectItem value='INVENTORY'>Thủ kho (INVENTORY)</SelectItem>
                  <SelectItem value='ADMIN'>Admin (ADMIN)</SelectItem>
                  <SelectItem value='SUPER_ADMIN'>Super Admin (SUPER_ADMIN)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-semibold text-slate-500 pl-1'>Trạng thái</span>
            <Select
              onValueChange={(val) =>
                setFilter('status', val === 'all' ? null : val)
              }
            >
              <SelectTrigger className='bg-white w-[180px] rounded-xl border-gray-200 shadow-sm h-10'>
                <SelectValue placeholder='Chọn trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Trạng thái</SelectLabel>
                  <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                  <SelectItem value='ACTIVE'>Đang hoạt động</SelectItem>
                  <SelectItem value='BLOCKED'>Đã khóa</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-semibold text-slate-500 pl-1'>Sắp xếp theo</span>
            <Select onValueChange={(val) => setFilter('sort', val)}>
              <SelectTrigger className='bg-white w-[180px] rounded-xl border-gray-200 shadow-sm h-10'>
                <SelectValue placeholder='Mới tham gia' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sắp xếp</SelectLabel>
                  <SelectItem value='newest'>Mới tham gia</SelectItem>
                  <SelectItem value='oldest'>Cũ nhất</SelectItem>
                  <SelectItem value='name-asc'>Tên A-Z</SelectItem>
                  <SelectItem value='name-desc'>Tên Z-A</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

