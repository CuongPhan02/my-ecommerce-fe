/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Row } from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button, buttonVariants } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { Category } from '../../types'
import Link from 'next/link'

interface TableToolbarProps {
  filterValue: string
  setFilter: (key: string, value: string | boolean | undefined) => void
  selectedRows: Row<Category>[]
  onDelete: () => void
}

export function TableToolbar({
  filterValue,
  setFilter,
  selectedRows,
  onDelete,
}: TableToolbarProps) {
  const [status, setStatus] = useState('all')

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setFilter(
      'isActive',
      newStatus === 'all' ? undefined : newStatus === 'active'
    )
  }

  return (
    <div className='flex items-center justify-between flex-wrap mb-4 gap-4'>
      <div className='flex gap-2 items-center '>
        <Input
          placeholder='Search categpry name...'
          value={filterValue || ''}
          onChange={(e) => setFilter('name', e.target.value)}
        />

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select a fruit' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='inactive'>Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-4'>
        <Button
          onClick={onDelete}
          disabled={selectedRows.length > 0 ? false : true}
          variant={'destructive'}
        >
          <Trash2 /> Delete ({selectedRows.length})
        </Button>
        <Link href={'/admin/category/create'} className={`${buttonVariants()}`}>
          <Plus /> Add Products
        </Link>
      </div>
    </div>
  )
}
