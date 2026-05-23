import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { ProductSchemaType } from '../../product.validate'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import MultipleSelector, { Option } from '~/components/ui/core/multiselect'
import { FieldError } from '~/components/ui/core/field'
import { generateRandomId, generateSlug } from '~/lib/utils'
import { Button } from '~/components/ui/core/button'
import { _categoryService } from '~/features/admin/category/category.query'
import AddCategoryModal from '~/features/admin/category/components/add-category'
import { _brandService } from '~/features/admin/brand/brand.query'
import AddBrandModal from '~/features/admin/brand/components/add-brand'
import { useMemo } from 'react'

const ProductInfoForm = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    React.useState(false)
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = React.useState(false)
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()

  const name = watch('name')
  const randomId = useMemo(() => generateRandomId(), [])

  useEffect(() => {
    if (name) {
      setValue('slug', generateSlug(name, randomId), { shouldValidate: true })
    }
  }, [name, setValue, randomId])

  const [categoryLimit, setCategoryLimit] = React.useState(20)
  const [brandLimit, setBrandLimit] = React.useState(20)

  const { data: categoriesData, isLoading: isLoadingCategories, isFetching: isFetchingCategories } =
    _categoryService.useCategories({ page: 1, limit: categoryLimit })

  const { data: brandsData, isLoading: isLoadingBrands, isFetching: isFetchingBrands } =
    _brandService.useBrands({ page: 1, limit: brandLimit })

  const categories = categoriesData?.result || []
  const brands = brandsData?.result || []

  const hasMoreCategories = categories?.data?.length < (categoriesData?.result?.meta?.totalItems || 0)
  const hasMoreBrands = brands?.data?.length < (brandsData?.result?.meta?.totalItems || 0)

  const PRODUCT_TAG_OPTIONS: Option[] = [
    { value: 'sale', label: 'Khuyến mãi' },
    { value: 'new', label: 'Mới' },
    { value: 'hot', label: 'Nổi bật' },
  ]
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>
        Thông tin sản phẩm
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Tên <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Input
            {...register('name')}
            placeholder='Tên sản phẩm'
            type='text'
            required
            className='bg-white'
            aria-invalid={errors.name && errors.name.message ? true : false}
            errorMessage={errors.name?.message}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Đường dẫn <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Input
            {...register('slug')}
            placeholder='duong-dan-san-pham'
            type='text'
            required
            className='bg-white'
            aria-invalid={errors.slug && errors.slug.message ? true : false}
            errorMessage={errors.slug?.message}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Danh mục <span className='text-destructive'>*</span>
            </Label>
          </div>
          <div className='flex item-center  gap-2'>
            <div className='flex flex-col gap-2 flex-1'>
              <Controller
                control={control}
                name='categoryId'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger
                      className='w-full bg-white'
                      aria-invalid={
                        errors.categoryId && errors.categoryId.message
                          ? true
                          : false
                      }
                    >
                      <SelectValue
                        placeholder={
                          isLoadingCategories
                            ? 'Đang tải danh mục...'
                            : 'Chọn danh mục'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectGroup>
                        <SelectLabel>Danh mục</SelectLabel>
                        {categories?.data?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                        {hasMoreCategories && (
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
                                setCategoryLimit((prev) => prev + 20)
                              }}
                              disabled={isFetchingCategories}
                            >
                              {isFetchingCategories ? 'Đang tải...' : 'Xem thêm'}
                            </Button>
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError className='pl-2'>
                {errors.categoryId?.message}
              </FieldError>
            </div>
            <Button
              type='button'
              variant='outline'
              className='h-fit'
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              Thêm danh mục
            </Button>
          </div>
        </div>

        <AddCategoryModal
          open={isAddCategoryModalOpen}
          onOpenChange={setIsAddCategoryModalOpen}
        />

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Thương hiệu <span className='text-destructive'>*</span>
            </Label>
          </div>

          <div className='flex item-center  gap-2'>
            <div className='flex flex-col gap-2 flex-1'>
              <Controller
                control={control}
                name='brandId'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={isLoadingBrands}
                  >
                    <SelectTrigger
                      className='w-full bg-white'
                      aria-invalid={
                        errors.brandId && errors.brandId.message ? true : false
                      }
                    >
                      <SelectValue
                        placeholder={
                          isLoadingBrands ? 'Đang tải thương hiệu...' : 'Chọn thương hiệu'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectGroup>
                        <SelectLabel>Thương hiệu</SelectLabel>
                        {brands?.data?.map((brand: any) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                        {hasMoreBrands && (
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
                                setBrandLimit((prev) => prev + 20)
                              }}
                              disabled={isFetchingBrands}
                            >
                              {isFetchingBrands ? 'Đang tải...' : 'Xem thêm'}
                            </Button>
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError className='pl-2'>
                {errors.brandId?.message}
              </FieldError>
            </div>
            <Button
              type='button'
              variant='outline'
              className='h-fit'
              onClick={() => setIsAddBrandModalOpen(true)}
            >
              Thêm thương hiệu
            </Button>
          </div>
        </div>

        <AddBrandModal
          open={isAddBrandModalOpen}
          onOpenChange={setIsAddBrandModalOpen}
        />

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Thẻ <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Controller
            control={control}
            name='tags'
            render={({ field }) => (
              <MultipleSelector
                {...field}
                className='bg-white dark:bg-muted'
                commandProps={{
                  label: 'Chọn thẻ',
                }}
                defaultOptions={PRODUCT_TAG_OPTIONS}
                placeholder='Chọn thẻ'
                hideClearAllButton
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className='text-center text-sm'>Không tìm thấy kết quả</p>
                }
                onChange={(options) => {
                  field.onChange(options.map((o) => o.value))
                }}
                value={PRODUCT_TAG_OPTIONS.filter((f: Option) => field.value?.includes(f.value))}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInfoForm
