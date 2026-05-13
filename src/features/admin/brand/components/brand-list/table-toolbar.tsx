'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'

interface TableToolbarProps {
  filterValue: string
  setFilter: (key: string, value: any) => void
  selectedRows: any[] // Simplified from Row<Brand>[]
  onDelete: () => void
  onAdd: () => void
}

export function TableToolbar({
  filterValue,
  setFilter,
  selectedRows,
  onDelete,
  onAdd,
}: TableToolbarProps) {
  const [sort, setSort] = useState('newest')

  return (
    <div className='flex items-center justify-between flex-wrap mb-4 gap-4'>
      <div className='flex gap-2 items-center flex-1'>
        <Input
          placeholder='Tìm kiếm thương hiệu...'
          value={filterValue || ''}
          onChange={(e) => setFilter('search', e.target.value)}
          className='max-w-[300px] bg-white'
        />

        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value)
            setFilter('sort', value)
          }}
        >
          <SelectTrigger className='w-[150px] bg-white'>
            <SelectValue placeholder='Sắp xếp theo' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='newest'>Mới nhất</SelectItem>
              <SelectItem value='oldest'>Cũ nhất</SelectItem>
              <SelectItem value='name_asc'>Tên: A đến Z</SelectItem>
              <SelectItem value='name_desc'>Tên: Z đến A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-2'>
        {selectedRows.length > 0 && (
          <Button onClick={onDelete} variant={'destructive'}>
            <Trash2 className='mr-2 h-4 w-4' /> Xóa ({selectedRows.length})
          </Button>
        )}
        <Button onClick={onAdd} className='bg-primary hover:bg-primary/90'>
          <Plus className='mr-2 h-4 w-4' /> Thêm thương hiệu
        </Button>
      </div>
    </div>
  )
}
