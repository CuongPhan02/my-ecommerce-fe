'use client'

import React from 'react'
import { useQueryState, parseAsInteger } from 'nuqs'
import { cn } from '~/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ShopPaginationProps {
  totalPages: number
}

const ShopPagination = ({ totalPages }: ShopPaginationProps) => {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'push', shallow: false })
  )

  if (totalPages <= 1) return null

  // Generate page numbers
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    // Simple logic: show first, last, current, and +/- 1 from current
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pages.push(i)
    } else if (i === page - 2 || i === page + 2) {
      pages.push('...')
    }
  }

  // Deduplicate '...'
  const filteredPages = pages.filter((p, idx, arr) => {
    if (p === '...' && arr[idx - 1] === '...') return false
    return true
  })

  return (
    <div className='flex justify-center mt-20 gap-2 items-center'>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className='w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all'
      >
        <ChevronLeft className='w-5 h-5' />
      </button>

      {filteredPages.map((p, idx) => (
        <button
          key={idx}
          onClick={() => {
            if (typeof p === 'number') {
              setPage(p)
            }
          }}
          disabled={p === '...'}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
            p === page
              ? 'bg-black text-white'
              : p === '...'
              ? 'text-gray-400 cursor-default'
              : 'hover:bg-gray-100 text-gray-400 hover:text-black',
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className='w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all'
      >
        <ChevronRight className='w-5 h-5' />
      </button>
    </div>
  )
}

export default ShopPagination
