'use client'

import { useState } from 'react'
import {
  Edit,
  Trash2,
  FolderOpen,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Card, CardContent, CardFooter } from '~/components/ui/core/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/core/dropdown-menu'
import { Badge } from '~/components/ui/core/badge'
import { Checkbox } from '~/components/ui/core/checkbox'
import { TableToolbar } from './table-toolbar'
import { _categoryService } from '../../category.query'
import { useDebounce } from '~/hooks/use-debounce'
import AddCategoryModal from '../add-category'
import { Category } from '../../types'

const CategoryList = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const debouncedSearch = useDebounce(globalFilter, 500)
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [page, setPage] = useState(1)
  const pageSize = 12

  const { data: categoryResponse, isLoading } = _categoryService.useCategories({
    page,
    limit: pageSize,
    search: debouncedSearch || null,
    sort:
      (columnFilters.find((f) => f.id === 'sort')?.value as any) || 'newest',
  })

  const deleteCategoryMutation = _categoryService.useCategoryDelete()
  const deleteCategoriesMutation = _categoryService.useCategoriesDelete()

  const categories = categoryResponse?.result?.data || []
  const totalPages = categoryResponse?.result?.meta?.totalPages || 0

  const handleEdit = (id: string) => {
    setEditId(id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string | string[]) => {
    try {
      if (Array.isArray(id)) {
        await deleteCategoriesMutation.mutateAsync(id)
        setSelectedIds([])
      } else {
        await deleteCategoryMutation.mutateAsync(id)
        setSelectedIds((prev) => prev.filter((i) => i !== id))
      }
    } catch (error) {
      console.error('Xóa danh mục thất bại', error)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(categories.map((c: Category) => c.id))
    }
  }

  return (
    <div className='w-full bg-accent/40 p-6 min-h-screen rounded-2xl'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>Danh mục</h1>
        </div>

        <TableToolbar
          filterValue={globalFilter}
          setFilter={(key: string, value: any) => {
            if (key === 'search') {
              setGlobalFilter(String(value || ''))
            } else {
              setColumnFilters([{ id: key, value }])
            }
          }}
          selectedRows={selectedIds}
          onDelete={() => handleDelete(selectedIds)}
          onAdd={() => {
            setEditId(null)
            setIsModalOpen(true)
          }}
        />

        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <Card key={i} className='animate-pulse border-none shadow-sm'>
                <div className='h-48 bg-muted rounded-t-xl'></div>
                <CardContent className='p-4 space-y-3'>
                  <div className='h-4 bg-muted rounded w-3/4'></div>
                  <div className='h-3 bg-muted rounded w-1/2'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed'>
            <FolderOpen className='h-12 w-12 text-muted-foreground mb-4 opacity-20' />
            <p className='text-muted-foreground'>Không tìm thấy danh mục nào.</p>
          </div>
        ) : (
          <>
            <div className='flex items-center gap-2 mb-4 px-2'>
              <Checkbox
                checked={
                  selectedIds.length === categories.length &&
                  categories.length > 0
                }
                onCheckedChange={toggleSelectAll}
              />
              <span className='text-sm text-muted-foreground'>Chọn tất cả</span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {categories.map((category: Category) => (
                <Card
                  key={category.id}
                  className={`group relative gap-0  p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-sm ring-1 ring-black/5 ${
                    selectedIds.includes(category.id)
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                >
                  <div className='absolute top-3 left-3 z-10'>
                    <Checkbox
                      checked={selectedIds.includes(category.id)}
                      onCheckedChange={() => toggleSelect(category.id)}
                    />
                  </div>

                  <div className='absolute top-3 right-3 z-10'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='icon' className='h-8 w-8 '>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => handleEdit(category.id)}
                        >
                          <Edit className='mr-2 h-4 w-4' /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className='mr-2 h-4 w-4' /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className='aspect-square relative overflow-hidden bg-muted flex items-center justify-center transition-transform duration-500'>
                    {category.metaImage ? (
                      <img
                        src={category.metaImage}
                        alt={category.name}
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <FolderOpen className='h-16 w-16 text-muted-foreground/20' />
                    )}
                    <div className='absolute bottom-2 right-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-primary font-semibold'
                        onClick={() => handleEdit(category.id)}
                      >
                        <Edit />
                      </Button>
                    </div>
                  </div>
                  <CardContent className='p-4 space-y-2 relative'>
                    <div className='flex items-start justify-between gap-2'>
                      <h3 className='font-bold text-lg leading-snug line-clamp-1'>
                        {category.name}
                      </h3>
                      {category.isActive ? (
                        <Badge
                          className='capitalize bg-emerald-50 text-emerald-600 border border-emerald-100'
                          size='sm'
                        >
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge
                          className='capitalize bg-gray-100 text-gray-600 border border-gray-200'
                          size='sm'
                        >
                          Không hoạt động
                        </Badge>
                      )}
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='text-xs text-muted-foreground truncate font-mono'>
                        /{category.slug}
                      </p>
                      {category.parent && (
                        <div className='flex items-center gap-1 text-[11px] text-muted-foreground bg-accent px-2 py-0.5 rounded-full w-fit'>
                          <FolderOpen className='h-3 w-3' />
                          <span>{category.parent.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className='p-4 pt-0 flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1 text-xs'>
                        {category.isFeatured ? (
                          <span className='flex items-center gap-1 text-amber-600 font-medium'>
                            <CheckCircle2 className='h-3 w-3' /> Nổi bật
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className='flex items-center justify-center space-x-2 mt-12 py-4'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='bg-white'
                >
                  Trước
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setPage(i + 1)}
                    className={page !== i + 1 ? 'bg-white' : ''}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className='bg-white'
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AddCategoryModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditId(null)
        }}
        categoryId={editId}
      />
    </div>
  )
}

export default CategoryList
