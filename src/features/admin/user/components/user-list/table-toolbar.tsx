import { Row } from '@tanstack/react-table'
import { Trash2, Search, FilterX, UserPlus } from 'lucide-react'
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
  return (
    <div className='flex flex-col gap-4 mb-6'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex flex-1 min-w-[300px] items-center gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Tìm kiếm họ tên, email, số điện thoại...'
              value={filterValue || ''}
              onChange={(e) => setFilter('search', e.target.value)}
              className='pl-9 bg-white'
            />
          </div>
          <Button variant='outline' onClick={onReset} className='gap-2 rounded-xl border-gray-200'>
            <FilterX className='h-4 w-4' /> Đặt lại
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            onClick={onDelete}
            disabled={selectedRows.length === 0}
            variant='destructive'
            className='gap-2 rounded-xl shadow-lg shadow-red-500/10'
          >
            <Trash2 className='h-4 w-4' /> Xóa ({selectedRows.length})
          </Button>
          <Button onClick={onAdd} className='gap-2 rounded-xl shadow-lg shadow-primary/20'>
            <UserPlus className='h-4 w-4' /> Thêm người dùng
          </Button>
        </div>
      </div>

      <div className='flex items-center gap-3 flex-wrap'>
        <Select
          onValueChange={(val) =>
            setFilter('role', val === 'all' ? null : val)
          }
        >
          <SelectTrigger className='bg-white w-[180px] rounded-xl border-gray-100 shadow-sm'>
            <SelectValue placeholder='Chọn vai trò' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Vai trò</SelectLabel>
              <SelectItem value='all'>Tất cả vai trò</SelectItem>
              <SelectItem value='SUPER_ADMIN'>Super Admin</SelectItem>
              <SelectItem value='ADMIN'>Admin</SelectItem>
              <SelectItem value='VENDOR'>Vendor</SelectItem>
              <SelectItem value='CUSTOMER'>Customer</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) =>
            setFilter('status', val === 'all' ? null : val)
          }
        >
          <SelectTrigger className='bg-white w-[180px] rounded-xl border-gray-100 shadow-sm'>
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

        <Select onValueChange={(val) => setFilter('sort', val)}>
          <SelectTrigger className='bg-white w-[180px] rounded-xl border-gray-100 shadow-sm'>
            <SelectValue placeholder='Sắp xếp theo' />
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
  )
}
