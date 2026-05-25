'use client'

import React from 'react'
import { useQueryState, parseAsStringEnum } from 'nuqs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/core/dropdown-menu'
import { ChevronDown } from 'lucide-react'

const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' },
  { label: 'Giá tăng dần', value: 'price_asc' },
  { label: 'Giá giảm dần', value: 'price_desc' },
] as const

const SortDropdown = () => {
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsStringEnum(['newest', 'oldest', 'price_asc', 'price_desc'])
      .withDefault('newest')
      .withOptions({ history: 'push', shallow: false })
  )

  const currentSortLabel = sortOptions.find(o => o.value === sort)?.label || 'Mặc định'

  return (
    <div className='flex items-center gap-4'>
      <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
        Sắp xếp
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center gap-4 bg-gray-100 px-6 py-2.5 rounded-full text-sm font-bold group hover:bg-gray-200 transition-all outline-none'>
          {currentSortLabel}
          <ChevronDown className='w-4 h-4 text-gray-400 group-hover:text-black transition-colors' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-none shadow-xl p-2">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setSort(option.value)}
              className={`cursor-pointer rounded-lg py-2 px-4 text-sm font-medium transition-colors ${
                sort === option.value ? 'bg-black text-white focus:bg-black focus:text-white' : 'hover:bg-gray-100 focus:bg-gray-100'
              }`}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SortDropdown
