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
import { Menu, MenuInput } from '../types'
import { _menuService } from '../menu.query'
import { _categoryService } from '~/features/admin/category/category.query'
import { _collectionService } from '~/features/admin/collection/collection.query'
import { _attributeService } from '~/features/admin/product/attribute.query'
import MultipleSelector, { Option } from '~/components/ui/core/multiselect'

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

  // 1. Fetch categories, collections, attributes
  const { data: categoriesData } = _categoryService.useCategories({ limit: 1000 })
  const { data: collectionsData } = _collectionService.useCollections({ limit: 1000 })
  const { data: attributesData } = _attributeService.useAllAttributes()

  const categories = categoriesData?.result?.data || []
  const collections = (collectionsData?.result as any)?.data || []
  const attributes = attributesData?.result || []

  // 2. Map options for selector
  const categoryOptions = React.useMemo<Option[]>(() => {
    return categories.map((c: any) => ({
      label: c.name,
      value: c.id,
    }))
  }, [categories])

  const collectionOptions = React.useMemo<Option[]>(() => {
    return collections.map((c: any) => ({
      label: c.name,
      value: c.id,
    }))
  }, [collections])

  const attributeOptions = React.useMemo<Option[]>(() => {
    return attributes.map((a: any) => ({
      label: a.name,
      value: a.id,
    }))
  }, [attributes])

  // 3. Selection States for Mega Menu contents
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>([])
  const [selectedCollectionIds, setSelectedCollectionIds] = React.useState<string[]>([])
  const [selectedAttributeIds, setSelectedAttributeIds] = React.useState<string[]>([])

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
      setSelectedCategoryIds(selectedMenu.megaMenu?.categories?.map((c) => c.id) || [])
      setSelectedCollectionIds(selectedMenu.megaMenu?.collections?.map((c) => c.id) || [])
      setSelectedAttributeIds(selectedMenu.megaMenu?.attributes?.map((a) => a.id) || [])
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
      setSelectedCategoryIds([])
      setSelectedCollectionIds([])
      setSelectedAttributeIds([])
    }
  }, [selectedMenu, reset, parentId, open])

  const isMegaMenu = watch('isMegaMenu')

  const onSubmit = async (data: MenuInput) => {
    const fullCategories = categories
      .filter((c: any) => selectedCategoryIds.includes(c.id))
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parentId,
      }))

    const fullCollections = collections
      .filter((c: any) => selectedCollectionIds.includes(c.id))
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || null,
        imageUrl: c.imageUrl || null,
        isActive: c.isActive,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))

    const fullAttributes = attributes
      .filter((a: any) => selectedAttributeIds.includes(a.id))
      .map((a: any) => ({
        id: a.id,
        name: a.name,
        values: a.values || [],
      }))

    const megaMenuPayload = data.isMegaMenu
      ? {
          categories: fullCategories,
          collections: fullCollections,
          attributes: fullAttributes,
        }
      : null

    const payload = {
      ...data,
      categoryType: (data.categoryType as any) === 'null' ? null : data.categoryType,
      href: data.href || null,
      displayOrder: Number(data.displayOrder) || 0,
      metadata: data.metadata || null,
      parentId: data.parentId || parentId || null,
      megaMenu: megaMenuPayload,
    }

    if (selectedMenu) {
      await updateMutation.mutateAsync({ id: selectedMenu.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`rounded-3xl transition-all duration-300 ${isMegaMenu ? 'sm:max-w-[750px]' : 'sm:max-w-[500px]'}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{selectedMenu ? 'Chỉnh sửa Menu' : 'Thêm Menu mới'}</DialogTitle>
            <DialogDescription>
              Cấu hình thông tin điều hướng cho website.
            </DialogDescription>
          </DialogHeader>

          <div className={`grid gap-6 py-6 transition-all duration-300 ${isMegaMenu ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            <div className='grid gap-6'>
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

            {isMegaMenu && (
              <div className='flex flex-col gap-5 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 border-gray-100'>
                <div className='flex flex-col gap-1 pb-3 border-b'>
                  <h4 className='font-bold text-sm text-foreground'>Cấu hình Nội dung Mega Menu</h4>
                  <p className='text-xs text-muted-foreground'>Chọn các danh mục, bộ sưu tập và thuộc tính hiển thị</p>
                </div>

                <div className='grid gap-4 max-h-[360px] overflow-y-auto pr-1'>
                  <div className='grid gap-2'>
                    <Label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Danh mục</Label>
                    <MultipleSelector
                      commandProps={{ label: 'Chọn danh mục...' }}
                      options={categoryOptions}
                      value={categoryOptions.filter(opt => selectedCategoryIds.includes(opt.value))}
                      onChange={(opts) => setSelectedCategoryIds(opts.map(o => o.value))}
                      placeholder='Tìm kiếm danh mục...'
                      emptyIndicator={<p className='text-center text-xs text-muted-foreground py-2'>Không tìm thấy danh mục</p>}
                      className='bg-white'
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Bộ sưu tập</Label>
                    <MultipleSelector
                      commandProps={{ label: 'Chọn bộ sưu tập...' }}
                      options={collectionOptions}
                      value={collectionOptions.filter(opt => selectedCollectionIds.includes(opt.value))}
                      onChange={(opts) => setSelectedCollectionIds(opts.map(o => o.value))}
                      placeholder='Tìm kiếm bộ sưu tập...'
                      emptyIndicator={<p className='text-center text-xs text-muted-foreground py-2'>Không tìm thấy bộ sưu tập</p>}
                      className='bg-white'
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Thuộc tính sản phẩm</Label>
                    <MultipleSelector
                      commandProps={{ label: 'Chọn thuộc tính...' }}
                      options={attributeOptions}
                      value={attributeOptions.filter(opt => selectedAttributeIds.includes(opt.value))}
                      onChange={(opts) => setSelectedAttributeIds(opts.map(o => o.value))}
                      placeholder='Chọn thuộc tính...'
                      emptyIndicator={<p className='text-center text-xs text-muted-foreground py-2'>Không tìm thấy thuộc tính</p>}
                      className='bg-white'
                    />
                  </div>
                </div>
              </div>
            )}
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
