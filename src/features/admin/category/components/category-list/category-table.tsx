'use client'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { columns } from './columns'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Category, TableMeta } from '../../types'
import { TableToolbar } from './table-toolbar'
import { categoryData } from '~/mock/mock-data'
import { TableSkeletonLoading } from '~/components/shared/table-skeleton-loading'

const fetchProductsFromServer = async (options: {
  pageIndex: number
  pageSize: number
}) => {
  console.log(`Đang tải dữ liệu cho trang: ${options.pageIndex + 1}...`)

  await new Promise((r) => setTimeout(r, 500))

  const { pageIndex, pageSize } = options

  const start = pageIndex * pageSize
  const end = start + pageSize
  const pageData = categoryData.slice(start, end)

  const pageCount = Math.ceil(categoryData.length / pageSize)
  return {
    data: pageData,
    pageCount: pageCount,
  }
}

const CategoryTable = () => {
  const [data, setData] = useState<Category[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [pageCount, setPageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  )

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await fetchProductsFromServer({ pageIndex, pageSize })
      setData(result.data)
      setPageCount(result.pageCount)
      setIsLoading(false)
    }
    fetchData()
  }, [pagination])

  const updateProductStatus = (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean
  ) => {
    setData((oldData) =>
      oldData.map((product) => {
        if (product.id === productId) {
          return { ...product, [columnId]: value }
        }
        return product
      })
    )
  }

  const table = useReactTable<Category>({
    data,
    columns,
    pageCount,
    meta: {
      updateProductStatus,
    } as TableMeta,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination,
    },

    manualPagination: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const selectedRows = table.getSelectedRowModel().rows

  const handleDelete = () => {
    const idsToDelete = selectedRows.map((row) => row.original.id)
    setData((prev) => prev.filter((item) => !idsToDelete.includes(item.id)))
    table.resetRowSelection()
  }

  return (
    <div className='w-full bg-accent p-6 min-h-screen rounded-2xl'>
      <h1 className='text-3xl font-bold mb-5'>Categories</h1>
      <TableToolbar
        filterValue={globalFilter}
        setFilter={(key: string, value: string | boolean | undefined) => {
          if (key === 'name') {
            setGlobalFilter(String(value || ''))
          } else {
            const otherFilters = columnFilters.filter((f) => f.id !== key)

            const newFilters =
              value !== undefined
                ? [...otherFilters, { id: key, value }]
                : otherFilters
            setColumnFilters(newFilters)
          }
        }}
        selectedRows={selectedRows}
        onDelete={handleDelete}
      />
      <ScrollArea className='w-full max-w-full rounded-md border whitespace-nowrap'>
        <table className='text-sm text-left w-full'>
          <thead className='bg-accent'>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className='p-3 font-semibold'>
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'flex items-center gap-2 cursor-pointer select-none'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getIsSorted() === 'desc'
                            ? 'Sorted descending'
                            : header.column.getIsSorted() === 'asc'
                            ? 'Sorted ascending'
                            : 'Sort'
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === 'asc' && (
                              <ArrowUp className='h-4 w-4' />
                            )}
                            {header.column.getIsSorted() === 'desc' && (
                              <ArrowDown className='h-4 w-4' />
                            )}
                            {header.column.getIsSorted() === false && (
                              <ChevronsUpDown className='h-4 w-4 text-muted-foreground' />
                            )}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              )
            })}
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeletonLoading
                rowCount={pageSize}
                colCount={columns.length}
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-4'>
                  No products found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className='border-t'>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='p-3 align-middle'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <div className='flex items-center justify-end space-x-4 py-4'>
        <span className='text-sm text-muted-foreground'>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CategoryTable
