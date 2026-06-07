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
import { cn } from '~/lib/utils'

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

  // 2. Selection States for Mega Menu contents
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>([])
  const [selectedCollectionIds, setSelectedCollectionIds] = React.useState<string[]>([])
  const [selectedAttributeIds, setSelectedAttributeIds] = React.useState<string[]>([])

  // 3. Search States for panels
  const [categorySearch, setCategorySearch] = React.useState('')
  const [collectionSearch, setCollectionSearch] = React.useState('')
  const [attributeSearch, setAttributeSearch] = React.useState('')

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
      setCategorySearch('')
      setCollectionSearch('')
      setAttributeSearch('')
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
      setCategorySearch('')
      setCollectionSearch('')
      setAttributeSearch('')
    }
  }, [selectedMenu, reset, parentId, open])

  const isMegaMenu = watch('isMegaMenu')

  const filteredCategories = React.useMemo(() => {
    return categories.filter((c: any) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase())
    )
  }, [categories, categorySearch])

  const filteredCollections = React.useMemo(() => {
    return collections.filter((c: any) =>
      c.name.toLowerCase().includes(collectionSearch.toLowerCase())
    )
  }, [collections, collectionSearch])

  const filteredAttributes = React.useMemo(() => {
    return attributes.filter((a: any) =>
      a.name.toLowerCase().includes(attributeSearch.toLowerCase())
    )
  }, [attributes, attributeSearch])

  const handleToggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleToggleCollection = (id: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleToggleAttribute = (id: string) => {
    setSelectedAttributeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

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
      <DialogContent className={`rounded-3xl transition-all duration-300 ${isMegaMenu ? 'sm:max-w-[1050px]' : 'sm:max-w-[500px]'}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{selectedMenu ? 'Chỉnh sửa Menu' : 'Thêm Menu mới'}</DialogTitle>
            <DialogDescription>
              Cấu hình thông tin điều hướng cho website.
            </DialogDescription>
          </DialogHeader>

          <div className={`grid gap-6 py-6 transition-all duration-300 ${isMegaMenu ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
            <div className={`grid gap-6 ${isMegaMenu ? 'lg:col-span-4' : ''}`}>
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
              <div className='lg:col-span-8 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 border-gray-100'>
                <div className='flex flex-col gap-0.5 pb-2 border-b'>
                  <h4 className='font-bold text-sm text-foreground'>Cấu hình Nội dung Mega Menu</h4>
                  <p className='text-xs text-muted-foreground'>Chọn các danh mục, bộ sưu tập và thuộc tính hiển thị</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {/* Danh mục Column */}
                  <div className='flex flex-col border rounded-2xl p-3 bg-slate-50/50 h-[320px]'>
                    <div className='flex items-center justify-between mb-2 px-1'>
                      <span className='font-bold text-xs text-slate-500 uppercase tracking-wider'>Danh mục</span>
                      <span className='text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full'>
                        {selectedCategoryIds.length}
                      </span>
                    </div>
                    <Input
                      placeholder='Tìm danh mục...'
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className='mb-2 h-8 text-xs bg-white rounded-xl'
                    />
                    <div className='flex-1 overflow-y-auto space-y-1 pr-1 text-xs'>
                      {filteredCategories.length === 0 ? (
                        <div className='text-center text-slate-400 py-10 text-[11px]'>Không tìm thấy</div>
                      ) : (
                        filteredCategories.map((c: any) => {
                          const isChecked = selectedCategoryIds.includes(c.id)
                          return (
                            <label
                              key={c.id}
                              className={cn(
                                'flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent select-none',
                                isChecked && 'bg-primary/5 border-primary/10 font-semibold text-primary'
                              )}
                            >
                              <input
                                type='checkbox'
                                checked={isChecked}
                                onChange={() => handleToggleCategory(c.id)}
                                className='rounded border-slate-300 text-primary focus:ring-primary size-3.5'
                              />
                              <span className='truncate'>{c.name}</span>
                            </label>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Bộ sưu tập Column */}
                  <div className='flex flex-col border rounded-2xl p-3 bg-slate-50/50 h-[320px]'>
                    <div className='flex items-center justify-between mb-2 px-1'>
                      <span className='font-bold text-xs text-slate-500 uppercase tracking-wider'>Bộ sưu tập</span>
                      <span className='text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full'>
                        {selectedCollectionIds.length}
                      </span>
                    </div>
                    <Input
                      placeholder='Tìm bộ sưu tập...'
                      value={collectionSearch}
                      onChange={(e) => setCollectionSearch(e.target.value)}
                      className='mb-2 h-8 text-xs bg-white rounded-xl'
                    />
                    <div className='flex-1 overflow-y-auto space-y-1 pr-1 text-xs'>
                      {filteredCollections.length === 0 ? (
                        <div className='text-center text-slate-400 py-10 text-[11px]'>Không tìm thấy</div>
                      ) : (
                        filteredCollections.map((c: any) => {
                          const isChecked = selectedCollectionIds.includes(c.id)
                          return (
                            <label
                              key={c.id}
                              className={cn(
                                'flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent select-none',
                                isChecked && 'bg-primary/5 border-primary/10 font-semibold text-primary'
                              )}
                            >
                              <input
                                type='checkbox'
                                checked={isChecked}
                                onChange={() => handleToggleCollection(c.id)}
                                className='rounded border-slate-300 text-primary focus:ring-primary size-3.5'
                              />
                              <span className='truncate'>{c.name}</span>
                            </label>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Thuộc tính Column */}
                  <div className='flex flex-col border rounded-2xl p-3 bg-slate-50/50 h-[320px]'>
                    <div className='flex items-center justify-between mb-2 px-1'>
                      <span className='font-bold text-xs text-slate-500 uppercase tracking-wider'>Thuộc tính lọc</span>
                      <span className='text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full'>
                        {selectedAttributeIds.length}
                      </span>
                    </div>
                    <Input
                      placeholder='Tìm thuộc tính...'
                      value={attributeSearch}
                      onChange={(e) => setAttributeSearch(e.target.value)}
                      className='mb-2 h-8 text-xs bg-white rounded-xl'
                    />
                    <div className='flex-1 overflow-y-auto space-y-1 pr-1 text-xs'>
                      {filteredAttributes.length === 0 ? (
                        <div className='text-center text-slate-400 py-10 text-[11px]'>Không tìm thấy</div>
                      ) : (
                        filteredAttributes.map((a: any) => {
                          const isChecked = selectedAttributeIds.includes(a.id)
                          return (
                            <label
                              key={a.id}
                              className={cn(
                                'flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent select-none',
                                isChecked && 'bg-primary/5 border-primary/10 font-semibold text-primary'
                              )}
                            >
                              <input
                                type='checkbox'
                                checked={isChecked}
                                onChange={() => handleToggleAttribute(a.id)}
                                className='rounded border-slate-300 text-primary focus:ring-primary size-3.5'
                              />
                              <span className='truncate'>{a.name}</span>
                            </label>
                          )
                        })
                      )}
                    </div>
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
