'use client'

import React, { useMemo, useState } from 'react'
import {
  Edit,
  Trash2,
  SlidersHorizontal,
  MoreVertical,
  Plus,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Card, CardContent } from '~/components/ui/core/card'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Badge } from '~/components/ui/core/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/core/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { useDebounce } from '~/hooks/use-debounce'
import { _attributeService } from '../../attribute.query'
import AddAttributeModal from './add-attribute'
import { ProductAttribute } from '../../types'
import { cn } from '~/lib/utils'

const AttributeList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    description: string
    actionText: string
    onConfirm: () => void
  } | null>(null)

  const triggerConfirm = (config: {
    title: string
    description: string
    actionText: string
    onConfirm: () => void
  }) => {
    setConfirmConfig(config)
    setConfirmOpen(true)
  }

  // Fetch paginated attributes
  const { data: attributeResponse, isLoading } = _attributeService.useAttributes({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
  })

  const deleteAttributeMutation = _attributeService.useDeleteAttribute()
  const deleteManyMutation = _attributeService.useDeleteManyAttributes()

  const attributes = useMemo(() => attributeResponse?.result?.data || [], [attributeResponse])
  const meta = attributeResponse?.result?.meta
  const totalPages = meta?.totalPages || 0
  const totalItems = meta?.totalItems || 0

  const handleEdit = (id: string) => {
    setEditId(id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    triggerConfirm({
      title: 'Xóa thuộc tính sản phẩm',
      description: 'Bạn có chắc chắn muốn xóa thuộc tính này không? Tất cả các sản phẩm sử dụng thuộc tính này có thể bị ảnh hưởng.',
      actionText: 'XÓA THUỘC TÍNH',
      onConfirm: async () => {
        try {
          await deleteAttributeMutation.mutateAsync(id)
          setSelectedIds((prev) => prev.filter((i) => i !== id))
        } catch (error) {
          console.error(error)
        }
      },
    })
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return

    triggerConfirm({
      title: 'Xóa nhiều thuộc tính',
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} thuộc tính đã chọn? Hành động này không thể hoàn tác và có thể ảnh hưởng đến sản phẩm sử dụng chúng.`,
      actionText: `XÓA ${selectedIds.length} THUỘC TÍNH`,
      onConfirm: async () => {
        try {
          await deleteManyMutation.mutateAsync(selectedIds)
          setSelectedIds([])
        } catch (error) {
          console.error(error)
        }
      },
    })
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === attributes.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(attributes.map((attr: ProductAttribute) => attr.id))
    }
  }

  return (
    <div className='w-full bg-accent/30 p-4 md:p-8 min-h-screen rounded-[2.5rem]'>
      <div className='flex flex-col gap-6 max-w-7xl mx-auto'>
        
        {/* Heading Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='space-y-1.5'>
            <h1 className='text-3xl font-extrabold tracking-tight flex items-center gap-3 text-slate-900 dark:text-white'>
              <div className='p-2.5 bg-primary/10 rounded-2xl'>
                <SlidersHorizontal className='h-8 w-8 text-primary' />
              </div>
              Thuộc tính sản phẩm
            </h1>
            <p className='text-muted-foreground text-sm font-medium'>
              Quản lý các biến thể sản phẩm như Kích thước (Size), Màu sắc (Color), Chất liệu, dung tích...
            </p>
          </div>
          <Button
            onClick={() => {
              setEditId(null)
              setIsModalOpen(true)
            }}
            className='rounded-xl font-bold flex gap-2 self-start md:self-auto shadow-lg shadow-primary/20 transition-all hover:scale-102 hover:shadow-xl'
          >
            <Plus className='h-5 w-5' /> Thêm thuộc tính
          </Button>
        </div>

        {/* Toolbar (Search & Actions) */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl border shadow-sm'>
          <div className='relative w-full sm:max-w-md'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground' />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1) // Reset page on filter
              }}
              placeholder='Tìm kiếm thuộc tính...'
              className='rounded-xl pl-10 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 transition-all font-medium py-5'
            />
          </div>

          {selectedIds.length > 0 && (
            <Button
              variant='destructive'
              onClick={handleBulkDelete}
              className='rounded-xl font-bold flex gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-top-1 duration-200'
            >
              <Trash2 className='h-4 w-4' /> Xóa {selectedIds.length} đã chọn
            </Button>
          )}
        </div>

        {/* Table Content */}
        <Card className='border rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-slate-950'>
          <CardContent className='p-0'>
            <div className='overflow-x-auto w-full'>
              <table className='text-sm text-left w-full border-collapse whitespace-nowrap'>
                <thead>
                  <tr className='bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'>
                    <th className='p-5 w-12 text-center align-middle'>
                      <Checkbox
                        checked={
                          attributes.length > 0 &&
                          selectedIds.length === attributes.length
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className='p-5 font-bold text-slate-850 dark:text-slate-100 align-middle'>
                      Tên thuộc tính
                    </th>
                    <th className='p-5 font-bold text-slate-850 dark:text-slate-100 align-middle'>
                      Các giá trị
                    </th>

                    <th className={cn(
                      'p-5 font-bold text-slate-850 dark:text-slate-100 align-middle w-24 text-center sticky right-0 z-20 bg-slate-50 dark:bg-slate-900 shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                    )}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
                  {isLoading ? (
                    Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i} className='animate-pulse'>
                        <td className='p-5 text-center'><div className='h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded mx-auto' /></td>
                        <td className='p-5'><div className='h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded' /></td>
                        <td className='p-5'><div className='flex gap-2'><div className='h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-full' /><div className='h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full' /></div></td>
                        <td className='p-5'><div className='h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto' /></td>
                      </tr>
                    ))
                  ) : attributes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className='p-0'>
                        <div className='flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-950'>
                          <div className='p-4 bg-muted rounded-full mb-4 dark:bg-slate-800'>
                            <Layers className='h-12 w-12 text-muted-foreground/60' />
                          </div>
                          <h3 className='font-bold text-lg text-slate-850 dark:text-slate-100'>
                            Không tìm thấy thuộc tính nào
                          </h3>
                          <p className='text-muted-foreground text-sm max-w-xs mt-1 mb-6'>
                            {searchQuery ? 'Không có thuộc tính nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác.' : 'Hệ thống hiện chưa có thuộc tính sản phẩm nào.'}
                          </p>
                          {!searchQuery && (
                            <Button
                              variant='outline'
                              className='rounded-xl font-bold'
                              onClick={() => {
                                setEditId(null)
                                setIsModalOpen(true)
                              }}
                            >
                              Tạo thuộc tính đầu tiên
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    attributes.map((attr: ProductAttribute) => {
                      const isSelected = selectedIds.includes(attr.id)
                      return (
                        <tr
                          key={attr.id}
                          className={cn(
                            'group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150',
                            isSelected && 'bg-primary/[0.01] dark:bg-primary/[0.02]'
                          )}
                        >
                          <td className='p-5 text-center align-middle'>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelect(attr.id)}
                            />
                          </td>
                          <td className='p-5 align-middle font-semibold text-slate-900 dark:text-slate-100'>
                            {attr.name}
                          </td>
                          <td className='p-5 align-middle max-w-md'>
                            <div className='flex flex-wrap gap-1.5 items-center'>
                              {attr?.values?.slice(0, 5)?.map((v) => (
                                <Badge
                                  key={v.id}
                                  variant='outline'
                                  size='xs'
                                  className='rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-100 font-medium'
                                >
                                  {v.name && v.name !== v.value ? `${v.name} (${v.value})` : v.value}
                                </Badge>
                              ))}
                              {attr?.values && attr.values.length > 5 && (
                                <Badge
                                  variant='outline'
                                  size='xs'
                                  className='rounded-lg bg-slate-100 text-slate-500 font-bold border-transparent dark:bg-slate-800 dark:text-slate-400'
                                >
                                  +{attr.values.length - 5} khác
                                </Badge>
                              )}
                            </div>
                          </td>

                          <td className={cn(
                            'p-5 align-middle text-center sticky right-0 z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)]',
                            isSelected ? 'bg-indigo-50/10' : 'bg-white dark:bg-slate-950',
                            'group-hover:bg-slate-50/50 dark:group-hover:bg-slate-900/30 transition-colors'
                          )}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800'
                                >
                                  <MoreVertical className='h-4.5 w-4.5' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end' className='rounded-xl w-36 shadow-lg border border-slate-100 dark:border-slate-800'>
                                <DropdownMenuItem
                                  onClick={() => handleEdit(attr.id)}
                                  className='gap-2 py-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300'
                                >
                                  <Edit className='h-4 w-4 text-primary' />
                                  <span>Chỉnh sửa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(attr.id)}
                                  className='gap-2 py-2 cursor-pointer font-medium text-destructive focus:text-destructive'
                                >
                                  <Trash2 className='h-4 w-4' />
                                  <span>Xóa</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-slate-950/40 backdrop-blur-sm rounded-3xl border shadow-sm'>
            <div className='text-sm font-medium text-muted-foreground'>
              Đang hiển thị <span className='text-foreground font-semibold'>{(page - 1) * pageSize + 1}</span> đến{' '}
              <span className='text-foreground font-semibold'>
                {Math.min(page * pageSize, totalItems)}
              </span>{' '}
              trong tổng số <span className='text-foreground font-semibold'>{totalItems}</span> thuộc tính
            </div>
            <div className='flex items-center gap-1.5'>
              <Button
                variant='outline'
                size='sm'
                className='rounded-xl h-9 px-3.5 font-bold border-slate-200 dark:border-slate-800'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Trước
              </Button>
              <div className='flex gap-1 items-center px-1'>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150',
                      page === i + 1
                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                        : 'bg-white/50 hover:bg-slate-100 text-muted-foreground dark:bg-slate-950'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant='outline'
                size='sm'
                className='rounded-xl h-9 px-3.5 font-bold border-slate-200 dark:border-slate-800'
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddAttributeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        attributeId={editId}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className='sm:max-w-[425px] bg-slate-900 border-slate-800 text-white rounded-2xl'>
          <DialogHeader>
            <DialogTitle className='text-xl font-black uppercase tracking-tighter italic text-red-500'>
              {confirmConfig?.title}
            </DialogTitle>
            <DialogDescription className='text-slate-400 mt-2 text-sm leading-relaxed'>
              {confirmConfig?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-6 gap-3 sm:gap-0'>
            <Button
              variant='outline'
              onClick={() => setConfirmOpen(false)}
              className='bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl'
            >
              HỦY
            </Button>
            <Button
              variant='destructive'
              onClick={async () => {
                if (confirmConfig?.onConfirm) {
                  await confirmConfig.onConfirm()
                }
                setConfirmOpen(false)
              }}
              className='bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-tighter'
            >
              {confirmConfig?.actionText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AttributeList
