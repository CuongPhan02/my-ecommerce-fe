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
import { columns } from './review-list/columns'
import { ArrowDown, ArrowUp, ChevronsUpDown, SearchIcon } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Review, ReviewParams, ReviewTableMeta, ReviewStatus } from '../types'
import { TableToolbar } from './review-list/table-toolbar'
import { _reviewService } from '../review.query'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { TableSkeletonLoading } from '~/components/shared/table-skeleton-loading'
import ReviewDetailDialog from './review-detail-dialog'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/core/dialog'
import {
  IconAlertTriangle,
  IconInfoCircle,
  IconStar,
} from '@tabler/icons-react'
import { Badge } from '~/components/ui/core/badge'

const ReviewTable = () => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  // Premium Radix confirmation states
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null)
  const [statusChangeReview, setStatusChangeReview] = useState<{
    id: string
    status: ReviewStatus
  } | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  const debouncedSearch =
    (columnFilters.find((f) => f.id === 'search')?.value as string) || ''

  const params: ReviewParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch || null,
    status:
      (columnFilters.find((f) => f.id === 'status')?.value as ReviewStatus) ||
      null,
    rating:
      (columnFilters.find((f) => f.id === 'rating')?.value as number) || null,
    sort:
      (columnFilters.find((f) => f.id === 'sort')?.value as string) || 'newest',
  }

  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = _reviewService.useReviews(params)

  const updateStatusMutation = _reviewService.useUpdateReviewStatus()
  const deleteReviewMutation = _reviewService.useDeleteReview()

  const data = (reviewsData?.result as any)?.data || []
  const pageCount = (reviewsData?.result as any)?.meta?.totalPages || 0

  // Confirm and execute Status Update
  const handleConfirmStatusChange = async () => {
    if (statusChangeReview) {
      try {
        await updateStatusMutation.mutateAsync({
          id: statusChangeReview.id,
          status: statusChangeReview.status,
        })
        toast.success(
          statusChangeReview.status === 'APPROVED'
            ? 'Đã duyệt hiển thị bình luận thành công!'
            : 'Đã ẩn bình luận khỏi website thành công!',
        )
      } catch (error) {
        toast.error('Có lỗi xảy ra khi cập nhật trạng thái bình luận!')
      } finally {
        setStatusChangeReview(null)
      }
    }
  }

  // Confirm and execute Single Deletion
  const handleConfirmDelete = async () => {
    if (reviewToDeleteId) {
      try {
        await deleteReviewMutation.mutateAsync(reviewToDeleteId)
        toast.success('Đã xóa đánh giá thành công!')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa đánh giá!')
      } finally {
        setReviewToDeleteId(null)
      }
    }
  }

  // Confirm and execute Bulk Deletion
  const handleConfirmBulkDelete = async () => {
    try {
      // Execute deletion sequence for selected rows
      const selectedIds = selectedRows.map((r) => r.original.id)
      await Promise.all(
        selectedIds.map((id) => deleteReviewMutation.mutateAsync(id)),
      )
      table.resetRowSelection()
      toast.success(
        `Đã xóa thành công ${selectedIds.length} đánh giá được chọn!`,
      )
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa hàng loạt!')
    } finally {
      setIsBulkDeleteOpen(false)
    }
  }

  const handleView = (review: Review) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const table = useReactTable<Review>({
    data,
    columns,
    pageCount,
    meta: {
      onView: handleView,
      onUpdateStatus: (id: string, status: ReviewStatus) => {
        setStatusChangeReview({ id, status })
      },
      onDelete: (id: string) => {
        setReviewToDeleteId(id)
      },
    } as ReviewTableMeta,
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

  // Find info about current review targeted for modal detail displays
  const reviewTarget = useMemo(() => {
    if (reviewToDeleteId) {
      return data.find((r: Review) => r.id === reviewToDeleteId)
    }
    if (statusChangeReview) {
      return data.find((r: Review) => r.id === statusChangeReview.id)
    }
    return null
  }, [reviewToDeleteId, statusChangeReview, data])

  return (
    <>
      <div className='w-full max-w-[1400px] mx-auto p-2'>
        <div className='mb-6'>
          <HeadingSectionAdmin title={' Quản lý bình luận & đánh giá'} />
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
            setPagination({ pageIndex: 0, pageSize: 10 })
          }}
          onReset={() => {
            setColumnFilters([])
            setPagination({ pageIndex: 0, pageSize: 10 })
          }}
          selectedRows={selectedRows}
          onDelete={() => setIsBulkDeleteOpen(true)}
        />

        <ScrollArea className='w-full rounded-3xl border border-slate-100 shadow-md bg-white overflow-hidden'>
          <div className='min-h-[400px]'>
            <table className='text-sm text-left w-full border-collapse whitespace-nowrap'>
              <thead className='bg-slate-50/50 dark:bg-muted border-b border-slate-100'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          className='p-4 font-bold text-slate-800 dark:text-slate-100'
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
                              <span className='ml-1 text-slate-400'>
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
                    rowCount={pageSize}
                    colCount={columns.length}
                  />
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className='text-center py-20 bg-white'
                    >
                      <div className='flex flex-col items-center gap-4 text-slate-400'>
                        <SearchIcon size={40} className='opacity-20' />
                        <p className='text-sm font-semibold'>
                          Không tìm thấy bình luận đánh giá nào
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table?.getRowModel()?.rows?.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className='border-b border-slate-100 hover:bg-slate-50/40 transition-colors'
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className='p-4 align-middle'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {/* Dynamic footer Pagination */}
        {data.length > 0 && (
          <div className='flex items-center justify-between py-6 px-4 bg-slate-50/10 border-t border-slate-100/50 mt-2 rounded-2xl'>
            <div className='text-xs font-bold text-slate-500'>
              Hiển thị {data.length} đánh giá (Trang {pageIndex + 1}/{pageCount}
              )
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

      {/* 1. VIEW & REPLY DETAIL MODAL */}
      {selectedReview && (
        <ReviewDetailDialog
          review={selectedReview}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      {/* 2. CUSTOM DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={!!reviewToDeleteId}
        onOpenChange={(open) => !open && setReviewToDeleteId(null)}
      >
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-rose-100 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm'>
                <IconAlertTriangle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Xóa đánh giá của khách hàng?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  Hành động này sẽ xóa vĩnh viễn nội dung bình luận khỏi hệ
                  thống.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {reviewTarget && (
            <div className='bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 space-y-2.5 my-2 text-sm text-slate-700'>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-slate-900'>Khách hàng:</span>
                <span className='font-extrabold text-slate-700'>
                  {reviewTarget.userName}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-slate-900'>Điểm đánh giá:</span>
                <div className='flex items-center gap-1 font-extrabold text-amber-500'>
                  <span>{reviewTarget.rating}</span>
                  <IconStar
                    size={16}
                    className='fill-amber-400 text-amber-400'
                  />
                </div>
              </div>
              <div className='flex flex-col gap-1 pt-1.5 border-t border-rose-100/60'>
                <span className='font-bold text-slate-950 text-xs'>
                  Nội dung bình luận:
                </span>
                <p className='text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 leading-relaxed max-h-[80px] overflow-y-auto'>
                  "{reviewTarget.comment}"
                </p>
              </div>
              <p className='text-[11px] text-rose-600 font-bold leading-relaxed pt-1'>
                ⚠️ Lưu ý: Thao tác này sẽ gỡ bỏ bình luận và giảm tổng số lượng
                feedback của sản phẩm tương ứng. Không thể hoàn tác.
              </p>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setReviewToDeleteId(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className='bg-rose-500 text-white hover:bg-rose-600 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-rose-500/20'
            >
              Đồng ý xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. CUSTOM STATUS TRANSITION DIALOG */}
      <Dialog
        open={!!statusChangeReview}
        onOpenChange={(open) => !open && setStatusChangeReview(null)}
      >
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-indigo-50 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary shadow-sm'>
                <IconInfoCircle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Cập nhật hiển thị đánh giá?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  Thay đổi trạng thái kiểm duyệt của bình luận đánh giá.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {reviewTarget && statusChangeReview && (
            <div className='space-y-4 my-2 text-sm text-slate-700'>
              <div className='bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 space-y-2.5'>
                <div className='flex items-center justify-between'>
                  <span className='font-bold text-slate-900'>Người gửi:</span>
                  <span className='font-extrabold text-slate-700'>
                    {reviewTarget.userName}
                  </span>
                </div>
                <div className='flex items-center justify-between pt-1 border-t border-indigo-100/40'>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-xs font-semibold text-slate-400'>
                      Hiện tại:
                    </span>
                    <Badge
                      variant='outline'
                      className='text-[10px] rounded-full font-bold uppercase'
                    >
                      {reviewTarget.status === 'APPROVED'
                        ? 'Đã duyệt'
                        : reviewTarget.status === 'HIDDEN'
                          ? 'Đã ẩn'
                          : 'Chờ duyệt'}
                    </Badge>
                  </div>
                  <span className='text-indigo-500 font-bold'>➜</span>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-xs font-semibold text-slate-900'>
                      Thay đổi thành:
                    </span>
                    <Badge
                      className={`text-[10px] rounded-full text-white font-bold uppercase ${
                        statusChangeReview.status === 'APPROVED'
                          ? 'bg-emerald-600'
                          : 'bg-rose-600'
                      }`}
                    >
                      {statusChangeReview.status === 'APPROVED'
                        ? 'Đã duyệt'
                        : 'Đã ẩn'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='text-xs text-slate-500 leading-relaxed font-semibold pl-1'>
                {statusChangeReview.status === 'APPROVED' ? (
                  <span className='text-emerald-600 flex items-center gap-1'>
                    ✅ Bình luận sẽ xuất hiện công khai trên trang sản phẩm chi
                    tiết của khách mua hàng.
                  </span>
                ) : (
                  <span className='text-rose-600 flex items-center gap-1'>
                    ⛔ Bình luận sẽ bị ẩn khỏi mọi giao diện public của website
                    (chỉ lưu trữ nội bộ).
                  </span>
                )}
              </div>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setStatusChangeReview(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className={`rounded-xl h-11 font-bold flex-1 text-white shadow-lg ${
                statusChangeReview?.status === 'APPROVED'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
              }`}
            >
              Xác nhận thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. CUSTOM BULK DELETE CONFIRMATION DIALOG */}
      <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-rose-100 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm'>
                <IconAlertTriangle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Xóa hàng loạt đánh giá?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  Xóa nhiều bình luận đánh giá cùng một lúc.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className='bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 space-y-2.5 my-2 text-sm text-slate-700'>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-900'>
                Số lượng đã chọn:
              </span>
              <span className='font-black text-rose-600 bg-rose-50 border border-rose-100 rounded px-2.5 py-0.5'>
                {selectedRows.length} bình luận
              </span>
            </div>
            <p className='text-xs text-slate-500 leading-relaxed font-medium pt-1.5 border-t border-rose-100/60'>
              Hành động này sẽ gỡ bỏ vĩnh viễn toàn bộ {selectedRows.length}{' '}
              bình luận đánh giá này khỏi website và không thể phục hồi.
            </p>
          </div>

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsBulkDeleteOpen(false)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirmBulkDelete}
              className='bg-rose-500 text-white hover:bg-rose-600 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-rose-500/20'
            >
              Xác nhận xóa hết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ReviewTable
