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
import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { columns } from './components/product-list/columns'
import { ArrowDown, ArrowUp, ChevronsUpDown, SearchIcon } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { cn } from '~/lib/utils'
import { Product, ProductParams, TableMeta } from './types'
import { TableToolbar } from './components/product-list/table-toolbar'
import { _productService } from './product.query'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { logger } from '~/lib/logger'
import { TableSkeletonLoading } from '~/components/shared/table-skeleton-loading'
import ProductFormAction from './product-form-action'
import ProductSaleTimerModal from './components/product-sale-timer-modal'

const ProductTable = () => {
  const [editId, setEditId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProductForSaleTimer, setSelectedProductForSaleTimer] = useState<Product | null>(null)
  const [isSaleTimerModalOpen, setIsSaleTimerModalOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  const debouncedSearch =
    (columnFilters.find((f) => f.id === 'search')?.value as string) || ''

  const params: ProductParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch || null,
    categoryId:
      (columnFilters.find((f) => f.id === 'categoryId')?.value as string) ||
      null,
    brandId:
      (columnFilters.find((f) => f.id === 'brandId')?.value as string) || null,
    minPrice:
      (columnFilters.find((f) => f.id === 'minPrice')?.value as number) || null,
    maxPrice:
      (columnFilters.find((f) => f.id === 'maxPrice')?.value as number) || null,
    sort:
      (columnFilters.find((f) => f.id === 'sort')?.value as string) || 'newest',
  }

  const { data: productsData, isLoading } = _productService.useProducts(params)

  logger.info('Products data:', productsData)

  const getPageNumbers = () => {
    const total = pageCount
    const current = pageIndex + 1
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

  const deleteProductMutation = _productService.useDeleteProduct()
  const deleteManyMutation = _productService.useDeleteManyProducts()
  const updateStatusMutation = _productService.useUpdateProductStatus()

  const data = (productsData?.result as any)?.data || []
  const pageCount = (productsData?.result as any)?.meta?.totalPages || 0

  const updateProductStatus = async (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean,
  ) => {
    await updateStatusMutation.mutateAsync({
      id: productId,
      data: { [columnId]: value },
    })
  }

  const handleEdit = (id: string) => {
    setEditId(id)
    setIsModalOpen(true)
  }

  const handleSaleTimer = (product: Product) => {
    setSelectedProductForSaleTimer(product)
    setIsSaleTimerModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      await deleteProductMutation.mutateAsync(id)
    }
  }

  const handleBulkDelete = async () => {
    const ids = table.getSelectedRowModel().rows.map((row) => row.original.id)
    if (confirm(`Bạn có chắc chắn muốn xóa ${ids.length} sản phẩm này không?`)) {
      await deleteManyMutation.mutateAsync(ids)
      table.resetRowSelection()
    }
  }

  const table = useReactTable<Product>({
    data,
    columns,
    pageCount,
    meta: {
      updateProductStatus,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onSaleTimer: handleSaleTimer,
    } as TableMeta,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const selectedRows = table.getSelectedRowModel().rows

  return (
    <>
      <div className='w-full '>
        <div className='mb-6'>
          <HeadingSectionAdmin title={' Quản lý sản phẩm'} />
        </div>

        <TableToolbar
          filterValue={debouncedSearch}
          setFilter={(key, value) => {
            const otherFilters = columnFilters.filter((f) => f.id !== key)
            setColumnFilters(
              value !== null
                ? [...otherFilters, { id: key, value }]
                : otherFilters,
            )
          }}
          onReset={() => {
            setColumnFilters([])
            setPagination({ pageIndex: 0, pageSize: 10 })
          }}
          selectedRows={selectedRows}
          onDelete={handleBulkDelete}
          onAdd={() => {
            setEditId(null)
            setIsModalOpen(true)
          }}
        />

        <ScrollArea className='w-full rounded-2xl border overflow-hidden shadow-sm'>
          <div className='min-h-[calc(100vh-400px)]'>
            <table className='text-sm text-left w-full border-collapse  whitespace-nowrap '>
              <thead className='backdrop-blur-sm bg-gray-200 dark:bg-muted'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isActions = header.id === 'actions'
                      return (
                        <th
                          key={header.id}
                          className={cn(
                            'p-4 font-semibold dark:text-slate-100 text-slate-900 border-b',
                            isActions && 'sticky right-0 z-20 bg-gray-200 dark:bg-muted shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                          )}
                        >
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'flex items-center gap-2 cursor-pointer select-none'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <span className='ml-1 dark:text-slate-100 text-slate-600 whitespace-nowrap'>
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ArrowUp size={14} />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ArrowDown size={14} />
                                ) : (
                                  <ChevronsUpDown
                                    size={14}
                                    className='opacity-30'
                                  />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeletonLoading
                    rowCount={10}
                    colCount={columns.length}
                  />
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className='text-center'>
                      <div className='flex flex-col items-center justify-center m-auto py-12 px-4 text-center min-h-[70vh] border-2 border-dashed border-gray-500 dark:bg-muted bg-gray-200'>
                        <div className='mb-4 p-4  bg-background rounded-full shadow-sm'>
                          <SearchIcon />
                        </div>
                        <h3 className='font-semibold text-lg'>
                          Không tìm thấy sản phẩm
                        </h3>
                        <p className=' text-muted-foreground mb-6 max-w-xs'>
                          Chúng tôi không tìm thấy sản phẩm nào khớp với bộ lọc
                          hiện tại. Hãy thử điều chỉnh tìm kiếm của bạn.
                        </p>
                        <Button
                          type='button'
                          variant='outline'
                          className='hover:bg-slate-100 transition-colors'
                          onClick={() => setColumnFilters([])}
                        >
                          Xóa tất cả bộ lọc
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table?.getRowModel()?.rows?.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className='group border-b transition-colors duration-200 hover:bg-slate-50/50'
                      >
                        {row.getVisibleCells().map((cell) => {
                          const isActions = cell.column.id === 'actions'
                          return (
                            <td
                              key={cell.id}
                              className={cn(
                                'p-4 align-middle',
                                isActions && 'sticky right-0 z-10 bg-white dark:bg-background group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {data.length > 0 && (
          <div className='flex items-center justify-between py-6 px-2 border-t mt-4'>
            <div className='text-sm font-medium text-slate-500'>
              Đang hiển thị{' '}
              <span className='font-bold text-slate-700'>{data.length}</span> sản phẩm
              (Trang{' '}
              <span className='font-bold text-slate-700'>
                {pageIndex + 1}
              </span>{' '}
              trên {pageCount})
            </div>
            <div className='flex items-center gap-1.5'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className='bg-white shadow-sm rounded-xl font-bold text-xs h-9'
              >
                Trước
              </Button>
              <div className='flex items-center gap-1.5'>
                {getPageNumbers().map((p, idx) =>
                  p === '...' ? (
                    <span key={idx} className='px-2 text-slate-400 text-sm font-bold'>
                      ...
                    </span>
                  ) : (
                    <Button
                      key={idx}
                      variant={pageIndex + 1 === p ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => table.setPageIndex((p as number) - 1)}
                      className={cn(
                        'h-9 w-9 rounded-xl font-bold text-xs shadow-sm',
                        pageIndex + 1 === p
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-white hover:bg-slate-50'
                      )}
                    >
                      {p}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className='bg-white shadow-sm rounded-xl font-bold text-xs h-9'
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductFormAction
        productId={editId}
        open={isModalOpen}
        isModal={true}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditId(null)
        }}
        onSuccess={() => {
          setIsModalOpen(false)
          setEditId(null)
        }}
        onCancel={() => {
          setIsModalOpen(false)
          setEditId(null)
        }}
      />

      <ProductSaleTimerModal
        product={selectedProductForSaleTimer}
        open={isSaleTimerModalOpen}
        onOpenChange={setIsSaleTimerModalOpen}
      />
    </>
  )
}

export default ProductTable
