'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { cn } from '~/lib/utils'
import { Button } from '../ui/core/button'

type PaginationProps = {
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  variant?: 'simple' | 'numbers'
  className?: string
}

export default function Pagination({
  meta,
  variant = 'simple',
  className,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (!meta || meta.totalPages <= 1) return null

  const getPageNumbers = () => {
    const total = meta.totalPages
    const current = meta.page
    const delta = 2
    const range: (number | string)[] = []

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) {
      range.unshift('...')
    }
    if (current + delta < total - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (total > 1) range.push(total)

    return range
  }

  return (
    <div className={cn('flex items-center gap-2 mt-4', className)}>
      <Button
        onClick={() => updateQuery('page', String(meta.page - 1))}
        disabled={meta.page <= 1}
        className='px-3 py-1'
      >
        Prev
      </Button>

      {variant === 'simple' ? (
        <span className='text-sm'>
          Page {meta.page} / {meta.totalPages}
        </span>
      ) : (
        <div className='flex items-center gap-1'>
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={idx} className='px-2'>
                ...
              </span>
            ) : (
              <Button
                variant={`${meta.page === p ? 'default' : 'secondary'}`}
                key={idx}
                onClick={() => updateQuery('page', String(p))}
              >
                {p}
              </Button>
            )
          )}
        </div>
      )}

      <Button
        onClick={() => updateQuery('page', String(meta.page + 1))}
        disabled={meta.page >= meta.totalPages}
        className='px-3 py-1'
      >
        Next
      </Button>
    </div>
  )
}
