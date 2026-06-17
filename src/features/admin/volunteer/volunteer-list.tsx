'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/core/table'
import { Input } from '~/components/ui/core/input'
import { Button } from '~/components/ui/core/button'
import { 
  Search, 
  Trash2, 
  Mail, 
  Loader2, 
  Heart,
  Calendar,
  Phone,
  MessageSquare
} from 'lucide-react'
import { _volunteerService } from './volunteer.query'
import { Volunteer } from './volunteer.api'
import { SendEmailModal } from './send-email-modal'
import { ConfirmModal } from '~/components/shared/confirm-modal'
import { toast } from 'react-toastify'
import { useDebounce } from '~/hooks/use-debounce'

export function VolunteerList() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  
  // Delete States
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  // Fetch volunteers
  const { data: volunteerRes, isLoading, refetch } = _volunteerService.useVolunteers({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  })

  const deleteMutation = _volunteerService.useDeleteVolunteer()

  const volunteers = volunteerRes?.result?.items || []
  const meta = volunteerRes?.result?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(volunteers.map((v) => v.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleDeleteConfirm = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Đã xóa thông tin đăng ký thành công')
        setDeleteId(null)
        // Clear selection if deleted item was selected
        setSelectedIds((prev) => prev.filter((id) => id !== deleteId))
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Không thể xóa thông tin đăng ký.')
      },
    })
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className='flex-1 space-y-6'>
      <div className='mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
        <div>
          <h1 className='text-3xl font-black uppercase tracking-tight flex items-center gap-2'>
            <Heart className='w-8 h-8 text-red-500 fill-red-500' />
            Tình nguyện viên
          </h1>
          <p className='text-xs text-neutral-500 uppercase tracking-widest font-bold mt-1'>
            Quản lý chiến dịch Hành trình yêu thương
          </p>
        </div>
        
        <div className='flex items-center gap-2'>
          <Button 
            onClick={() => setIsEmailModalOpen(true)}
            className="rounded-xl font-bold text-xs uppercase tracking-widest bg-black hover:bg-primary text-white py-5 px-6 shadow-md transition-all flex items-center gap-2"
          >
            <Mail className='w-4 h-4' />
            {selectedIds.length > 0 ? `Gửi Email (${selectedIds.length})` : 'Gửi Email Hàng Loạt'}
          </Button>
        </div>
      </div>

      <Card className='rounded-2xl border-muted/50 overflow-hidden shadow-sm'>
        <CardHeader className='pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <CardTitle className="text-base font-black uppercase tracking-widest">Danh sách đăng ký</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest">
              Tổng số: {meta.total} tình nguyện viên
            </CardDescription>
          </div>
          <div className='relative w-full sm:w-72'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Tìm kiếm tên, email, sđt...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 rounded-xl border-neutral-200 bg-white focus-visible:ring-primary focus:border-[#231f20] font-medium text-sm w-full py-4'
            />
          </div>
        </CardHeader>
        
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='py-20 flex flex-col items-center justify-center gap-3 text-neutral-400'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
              <span className='text-xs font-bold uppercase tracking-widest'>Đang tải danh sách...</span>
            </div>
          ) : volunteers.length === 0 ? (
            <div className='py-20 text-center text-neutral-400 font-bold uppercase tracking-widest text-xs'>
              Không tìm thấy đăng ký nào
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/30'>
                  <TableRow>
                    <TableHead className='w-[50px] text-center pl-6'>
                      <input
                        type='checkbox'
                        className='rounded border-gray-300 text-primary focus:ring-primary cursor-pointer w-4 h-4'
                        checked={volunteers.length > 0 && selectedIds.length === volunteers.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead className='font-bold text-[10px] uppercase tracking-widest text-neutral-500'>Họ và tên</TableHead>
                    <TableHead className='font-bold text-[10px] uppercase tracking-widest text-neutral-500'>Thông tin liên hệ</TableHead>
                    <TableHead className='font-bold text-[10px] uppercase tracking-widest text-neutral-500'>Lời nhắn</TableHead>
                    <TableHead className='font-bold text-[10px] uppercase tracking-widest text-neutral-500'>Ngày đăng ký</TableHead>
                    <TableHead className='w-[100px] text-center pr-6'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((vol) => (
                    <TableRow key={vol.id} className='hover:bg-muted/10 transition-colors'>
                      <TableCell className='text-center pl-6'>
                        <input
                          type='checkbox'
                          className='rounded border-gray-300 text-primary focus:ring-primary cursor-pointer w-4 h-4'
                          checked={selectedIds.includes(vol.id)}
                          onChange={(e) => handleSelectRow(vol.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className='font-bold text-slate-800 text-sm'>{vol.fullName}</div>
                      </TableCell>
                      <TableCell className='space-y-1 py-4'>
                        <div className='flex items-center gap-1.5 text-xs text-neutral-600 font-medium'>
                          <Mail className='w-3 h-3 text-neutral-400' />
                          <span>{vol.email}</span>
                        </div>
                        <div className='flex items-center gap-1.5 text-xs text-neutral-600 font-medium'>
                          <Phone className='w-3 h-3 text-neutral-400' />
                          <span>{vol.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-xs'>
                        {vol.message ? (
                          <div className='flex items-start gap-1.5 text-xs text-neutral-600 font-medium leading-relaxed italic'>
                            <MessageSquare className='w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5' />
                            <span>{vol.message}</span>
                          </div>
                        ) : (
                          <span className='text-[10px] text-neutral-400 font-medium italic uppercase tracking-wider'>Không có lời nhắn</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1.5 text-xs text-neutral-500 font-medium'>
                          <Calendar className='w-3.5 h-3.5 text-neutral-400' />
                          <span>{formatDate(vol.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right pr-6'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => setDeleteId(vol.id)}
                          className='h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Footer/Pagination */}
        {!isLoading && meta.totalPages > 1 && (
          <div className='flex items-center justify-between border-t border-muted/50 px-6 py-4 bg-muted/10'>
            <div className='text-xs font-bold text-gray-500 uppercase tracking-widest'>
              Trang {meta.page} / {meta.totalPages} (Tổng {meta.total} dòng)
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                className='px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl'
              >
                Trước
              </Button>
              <Button
                variant='outline'
                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                disabled={page >= meta.totalPages}
                className='px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl'
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Email Send Modal */}
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        selectedIds={selectedIds}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Xóa đăng ký tình nguyện"
        description="Bạn có chắc chắn muốn xóa thông tin đăng ký của tình nguyện viên này? Hành động này không thể hoàn tác."
        confirmText="Xoá đăng ký"
        cancelText="Hủy"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
