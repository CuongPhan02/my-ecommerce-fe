'use client'

import { Plus, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/core/dialog'
import MultipleSelector, { Option } from '~/components/ui/core/multiselect'
import { ProductSchemaType } from '../../product.validate'
import { _collectionService } from '~/features/admin/collection/collection.query'
import { toast } from 'react-toastify'
import { generateRandomId, generateSlug } from '~/lib/utils'

const ProductCollections = () => {
  const { control } = useFormContext<ProductSchemaType>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  const [collectionLimit, setCollectionLimit] = useState(20)

  // 1. Lấy danh sách collection từ API
  const {
    data: collectionsRes,
    isLoading,
    isFetching,
    refetch,
  } = _collectionService.useCollections({ page: 1, limit: collectionLimit })
  const createCollectionMutation = _collectionService.useCreateCollection()

  const [collectionOptions, setCollectionOptions] = useState<Option[]>([])

  const collections = (collectionsRes?.result as any)?.data || []
  const hasMoreCollections = collections.length < ((collectionsRes?.result as any)?.meta?.totalItems || 0)

  useEffect(() => {
    const collectionOptions: Option[] =
      collections.map((c: any) => ({
        label: c.name,
        value: c.id,
      })) || []
    setCollectionOptions(collectionOptions)
  }, [collectionsRes])

  // 2. Logic tạo nhanh collection
  const handleQuickAdd = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Vui lòng nhập tên bộ sưu tập')
      return
    }

    try {
      await createCollectionMutation.mutateAsync({
        name: newCollectionName,
        slug: generateSlug(newCollectionName, generateRandomId()),
        description: '',
        isActive: true,
      } as any)

      setNewCollectionName('')
      setIsDialogOpen(false)
      refetch() // Reload danh sách để hiện collection mới
    } catch (error) {
      console.error('Quick add failed:', error)
    }
  }

  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-lg font-black uppercase tracking-tighter'>
          Bộ sưu tập
        </CardTitle>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all'
            >
              <Plus size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] bg-white dark:bg-slate-950'>
            <DialogHeader>
              <DialogTitle className='font-black tracking-tighter italic uppercase'>
                Thêm nhanh bộ sưu tập
              </DialogTitle>
              <DialogDescription className='text-slate-500'>
                Tạo mới một bộ sưu tập nhanh chóng. Bạn có thể thêm chi tiết
                sau.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name' className='font-bold'>
                  Tên bộ sưu tập
                </Label>
                <Input
                  id='name'
                  placeholder='vd: Bộ sưu tập mùa hè'
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleQuickAdd}
                disabled={createCollectionMutation.isPending}
                className='w-full font-black'
              >
                {createCollectionMutation.isPending ? (
                  <Loader2 className='animate-spin mr-2' size={18} />
                ) : (
                  'TẠO BỘ SƯU TẬP'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='space-y-4'>
          <Label className='text-xs font-black uppercase tracking-widest text-slate-500'>
            Chọn bộ sưu tập mục tiêu
          </Label>
          <Controller
            control={control}
            name='collectionIds'
            render={({ field }) => (
              <MultipleSelector
                {...field}
                value={collectionOptions.filter((opt) =>
                  field.value?.includes(opt.value),
                )}
                onChange={(options) => {
                  field.onChange(options.map((opt) => opt.value))
                }}
                options={collectionOptions}
                placeholder={
                  isLoading
                    ? 'Đang tải bộ sưu tập...'
                    : 'Tìm kiếm hoặc chọn bộ sưu tập...'
                }
                className='bg-muted border-gray-500'
                emptyIndicator={
                  <p className='text-center text-sm text-slate-500 py-2'>
                    {isLoading ? 'Đang lấy dữ liệu...' : 'Không tìm thấy bộ sưu tập.'}
                  </p>
                }
                listFooter={
                  hasMoreCollections && (
                    <div className='p-1 border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='w-full text-xs text-primary font-bold hover:bg-primary/10 py-1.5 h-auto rounded-none justify-center'
                        onPointerDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setCollectionLimit((prev) => prev + 20)
                        }}
                        disabled={isFetching}
                      >
                        {isFetching ? 'Đang tải...' : 'Xem thêm'}
                      </Button>
                    </div>
                  )
                }
              />
            )}
          />
        </div>
      </CardContent>

      <CardFooter className='border-t px-6 py-4'>
        <p className='text-[10px] text-slate-500 leading-relaxed italic'>
          Thêm sản phẩm này vào nhiều bộ sưu tập để tăng khả năng hiển thị trên
          các danh mục.
        </p>
      </CardFooter>
    </Card>
  )
}

export default ProductCollections
