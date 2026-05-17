'use client'
import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { Switch } from '~/components/ui/core/switch'
import { useForm, Controller } from 'react-hook-form'
import { Menu, MenuInput, MenuType, CategoryType } from '../types'
import { _menuService } from '../menu.query'

interface MenuFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMenu: Menu | null
  parentId: string | null
}

const MenuFormDialog = ({
  open,
  onOpenChange,
  selectedMenu,
  parentId,
}: MenuFormDialogProps) => {
  const createMutation = _menuService.useCreateMenu()
  const updateMutation = _menuService.useUpdateMenu()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<MenuInput>({
    defaultValues: {
      type: 'MAIN_LINK',
      label: '',
      href: null,
      categoryType: null,
      displayOrder: 0,
      parentId: parentId,
      isActive: true,
      isMegaMenu: false,
    },
  })

  useEffect(() => {
    if (selectedMenu) {
      reset({
        type: selectedMenu.type,
        label: selectedMenu.label,
        href: selectedMenu.href,
        categoryType: selectedMenu.categoryType,
        displayOrder: selectedMenu.displayOrder,
        parentId: selectedMenu.parentId,
        isActive: selectedMenu.isActive,
        isMegaMenu: selectedMenu.isMegaMenu,
      })
    } else {
      reset({
        type: 'MAIN_LINK',
        label: '',
        href: null,
        categoryType: null,
        displayOrder: 0,
        parentId: parentId,
        isActive: true,
        isMegaMenu: false,
      })
    }
  }, [selectedMenu, reset, parentId])

  const isMegaMenu = watch('isMegaMenu')

  const onSubmit = async (data: MenuInput) => {
    if (selectedMenu) {
      await updateMutation.mutateAsync({ id: selectedMenu.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] rounded-3xl'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{selectedMenu ? 'Chỉnh sửa Menu' : 'Thêm Menu mới'}</DialogTitle>
            <DialogDescription>
              Cấu hình thông tin điều hướng cho website.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-6 py-6'>
            <div className='grid gap-2'>
              <Label htmlFor='label'>Nhãn hiển thị</Label>
              <Input
                id='label'
                placeholder='Ví dụ: Trang chủ, Sản phẩm...'
                {...register('label', { required: 'Vui lòng nhập nhãn' })}
                className='rounded-xl'
              />
              {errors.label && <span className='text-xs text-red-500'>{errors.label.message}</span>}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label>Loại menu</Label>
                <Controller
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='rounded-xl'>
                        <SelectValue placeholder='Chọn loại' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='MAIN_LINK'>Liên kết chính</SelectItem>
                        <SelectItem value='SUB_LINK'>Liên kết phụ</SelectItem>
                        <SelectItem value='CUSTOM_LINK'>Tùy chỉnh</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='displayOrder'>Thứ tự hiển thị</Label>
                <Input
                  id='displayOrder'
                  type='number'
                  {...register('displayOrder', { valueAsNumber: true })}
                  className='rounded-xl'
                />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='href'>Đường dẫn (URL)</Label>
              <Input
                id='href'
                placeholder='/shop, /about...'
                {...register('href')}
                className='rounded-xl'
              />
            </div>

            <div className='grid gap-2'>
              <Label>Nhóm danh mục (Nếu có)</Label>
              <Controller
                name='categoryType'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || 'null'}>
                    <SelectTrigger className='rounded-xl'>
                      <SelectValue placeholder='Chọn nhóm' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='null'>Không có</SelectItem>
                      <SelectItem value='CATEGORY_GROUP'>Nhóm danh mục</SelectItem>
                      <SelectItem value='COLLECTION_GROUP'>Nhóm bộ sưu tập</SelectItem>
                      <SelectItem value='BRAND_GROUP'>Nhóm thương hiệu</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border'>
              <div className='flex flex-col gap-0.5'>
                <Label className='font-bold'>Kích hoạt</Label>
                <span className='text-[10px] text-muted-foreground'>Hiển thị trên website</span>
              </div>
              <Controller
                name='isActive'
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border'>
              <div className='flex flex-col gap-0.5'>
                <Label className='font-bold'>Mega Menu</Label>
                <span className='text-[10px] text-muted-foreground'>Hiển thị rộng với nhiều cột</span>
              </div>
              <Controller
                name='isMegaMenu'
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='ghost' onClick={() => onOpenChange(false)} className='rounded-xl'>
              Hủy
            </Button>
            <Button type='submit' className='rounded-xl px-8 shadow-lg shadow-primary/20' disabled={createMutation.isPending || updateMutation.isPending}>
              {selectedMenu ? 'Cập nhật' : 'Thêm ngay'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MenuFormDialog
