'use client'
import { Trash2, Loader2, Plus } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import MultipleSelector, { Option } from '~/components/ui/core/multiselect'
import { RadioGroup, RadioGroupItem } from '~/components/ui/core/radio-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/core/table'
import { ProductSchemaType } from '../../product.validate'
import { _attributeService } from '../../attribute.query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { CreateAttributeDialog } from './create-attribute-dialog'

interface Variation {
  id: string | number
  name: string
  values: Option[]
}

// Hàm tạo tổ hợp chéo (Cartesian Product)
const getCombinations = (
  arrays: Option[][],
  optionNames: string[],
): string[] => {
  if (
    !arrays ||
    arrays.length === 0 ||
    arrays.some((arr) => arr.length === 0)
  ) {
    return []
  }

  let result: string[][] = [[]]
  for (const arr of arrays) {
    const newResult: string[][] = []
    for (const res of result) {
      for (const item of arr) {
        newResult.push([...res, item.label])
      }
    }
    result = newResult
  }

  // Format the output string
  return result.map((combo) =>
    combo.map((value, index) => `${optionNames[index]}:${value}`).join(' | '),
  )
}

const ProductVariantForm = () => {
  const { control, register, watch, setValue } =
    useFormContext<ProductSchemaType>()
  const { fields: variants, replace } = useFieldArray({
    control,
    name: 'variants',
  })

  const productType = watch('type')

  // API Integration
  const { data: attributesData, isLoading: isLoadingAttributes } =
    _attributeService.useAllAttributes()

  console.log(attributesData, '####=>')
  const [variations, setVariations] = useState<Variation[]>([
    { id: Date.now(), name: '', values: [] },
  ])
  const [isOpenCreateAttribute, setIsOpenCreateAttribute] = useState(false)

  // Map API data to options format for MultipleSelector
  const attributeOptionsMap = useMemo(() => {
    const map: Record<string, Option[]> = {}
    attributesData?.result?.forEach((attr) => {
      map[attr.name] = attr.values.map((v) => ({
        label: v.value,
        value: v.value,
      }))
    })
    return map
  }, [attributesData])

  // Initialize variations from form options (for editing)
  useEffect(() => {
    const formOptions = watch('options')
    if (formOptions && formOptions.length > 0) {
      // Check if variations actually need initializing from options
      const hasUninitializedVariations = variations.length === 1 && variations[0].name === ''
      if (hasUninitializedVariations) {
        const initialVariations = formOptions.map((opt, index) => ({
          id: `init-${index}`,
          name: opt.name,
          values: opt.values.map((v) => ({ label: v, value: v })),
        }))
        setVariations(initialVariations)
      }
    }
  }, [watch('options')])

  useEffect(() => {
    if (productType === 'VARIANT') {
      const activeVariations = variations.filter(
        (v) => v.name && v.values.length > 0,
      )

      // Update options field in form
      const optionsData = activeVariations.map((v) => ({
        name: v.name,
        values: v.values.map((val) => val.label),
      }))
      setValue('options', optionsData)

      const optionValues = activeVariations.map((v) => v.values)
      const optionNames = activeVariations.map((v) => v.name)

      const combinations = getCombinations(optionValues, optionNames)

      if (combinations.length > 0) {
        // Use getValues instead of watch to avoid potential stale data in high-frequency updates
        const currentVariants = watch('variants') || []

        const newVariants = combinations.map((combo) => {
          const comboAttributes = combo.split(' | ').map((part) => {
            const [name, value] = part.split(':')
            return { name, value }
          })

          // Create a stable key for comparison
          const comboKey = comboAttributes
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((a) => `${a.name}:${a.value}`)
            .join(' | ')

          // Try to find existing variant data to preserve it
          const existingVariant = currentVariants.find((v) => {
            if (!v.attributes) return false
            const vKey = v.attributes
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((a: any) => `${a.name}:${a.value}`)
              .join(' | ')
            return vKey === comboKey
          })

          const skuSuffix = comboAttributes.map((a) => a.value).join('-')

          return {
            id: existingVariant?.id, // Keep ID if available (crucial for updates)
            sku: existingVariant?.sku || skuSuffix,
            price: existingVariant?.price || 0,
            stock: existingVariant?.stock || 0,
            purchasePrice: existingVariant?.purchasePrice || 0,
            attributes: comboAttributes,
          }
        })

        // Only replace if count or content changed to avoid unnecessary re-renders
        // and losing data while typing if lookups fail
        const isIdentical =
          currentVariants.length === newVariants.length &&
          newVariants.every((nv, i) => nv.sku === currentVariants[i]?.sku)

        if (!isIdentical) {
          replace(newVariants)
        }
      } else {
        // Only clear if we actually had variations set up before
        if (activeVariations.length > 0) {
          replace([])
        }
      }
    } else if (productType === 'SINGLE') {
      const currentVariants = watch('variants')
      if (
        !currentVariants ||
        currentVariants.length === 0 ||
        (currentVariants[0]?.attributes &&
          currentVariants[0].attributes.length > 0)
      ) {
        replace([
          {
            sku: '',
            price: 0,
            stock: 0,
            purchasePrice: 0,
            attributes: [],
          },
        ])
      }
    }
  }, [variations, productType, setValue, replace])

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: '', values: [] }])
  }

  const removeVariation = (id: string | number) => {
    setVariations(variations.filter((v) => v.id !== id))
  }

  const handleVariationNameChange = (id: string | number, newName: string) => {
    setVariations(
      variations.map((v) =>
        v.id === id ? { ...v, name: newName, values: [] } : v,
      ),
    )
  }

  const handleVariationValuesChange = (
    id: string | number,
    newValues: Option[],
  ) => {
    setVariations(
      variations.map((v) => (v.id === id ? { ...v, values: newValues } : v)),
    )
  }

  return (
    <div className='space-y-10'>
      <Card className='bg-muted shadow-none '>
        <CardHeader className='border-b font-bold'>Loại sản phẩm</CardHeader>
        <CardContent>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className='flex items-center gap-8'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='SINGLE' id='r1' />
                  <Label htmlFor='r1'>Sản phẩm đơn giản</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='VARIANT' id='r2' />
                  <Label htmlFor='r2'>Sản phẩm có biến thể</Label>
                </div>
              </RadioGroup>
            )}
          />
        </CardContent>
      </Card>

      {/* --- Form for Single Product --- */}
      {productType === 'SINGLE' && variants[0] && (
        <Card className='bg-muted shadow-none '>
          <CardHeader>
            <CardTitle>Giá và tồn kho sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Giá nhập hàng</Label>
              <Input
                type='number'
                {...register(`variants.${0}.purchasePrice`, {
                  valueAsNumber: true,
                })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Giá bán</Label>
              <Input
                type='number'
                {...register(`variants.${0}.price`, { valueAsNumber: true })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Số lượng</Label>
              <Input
                type='number'
                {...register(`variants.${0}.stock`, { valueAsNumber: true })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Mã SKU</Label>
              <Input
                {...register(`variants.${0}.sku`)}
                placeholder='Nhập mã SKU sản phẩm'
                className='bg-white'
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Form for Variant Product --- */}
      {productType === 'VARIANT' && (
        <>
          <Card className='bg-muted shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4 border-b gap-4 flex-wrap'>
              <CardTitle>Biến thể sản phẩm</CardTitle>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsOpenCreateAttribute(true)}
                  className='bg-white border-dashed text-primary hover:text-primary-hover border-primary/40'
                  type='button'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Tạo thuộc tính
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={addVariation}
                  className='bg-white'
                  type='button'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Thêm biến thể
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              {!isLoadingAttributes && (!attributesData?.result || attributesData.result.length === 0) ? (
                <div className='flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-lg bg-background/30 space-y-4 text-center'>
                  <div className='p-3 bg-primary/10 text-primary rounded-full'>
                    <Plus className='h-6 w-6' />
                  </div>
                  <div className='space-y-1'>
                    <h4 className='font-semibold text-sm'>Chưa có thuộc tính nào được tạo</h4>
                    <p className='text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed'>
                      Sản phẩm có biến thể yêu cầu ít nhất một thuộc tính (ví dụ: Màu sắc, Kích thước) để cấu hình các phân loại hàng bán.
                    </p>
                  </div>
                  <Button 
                    type='button' 
                    size='sm' 
                    onClick={() => setIsOpenCreateAttribute(true)}
                  >
                    Tạo thuộc tính đầu tiên
                  </Button>
                </div>
              ) : (
                variations.map((variation) => (
                  <div
                    key={variation.id}
                    className='grid grid-cols-1 md:grid-cols-[200px_1fr_auto] items-start gap-4 p-4 rounded-lg  border'
                  >
                    <div className='space-y-2'>
                      <Label>Tên thuộc tính</Label>
                      <Select
                        value={variation.name || undefined}
                        onValueChange={(value) =>
                          handleVariationNameChange(variation.id, value)
                        }
                      >
                        <SelectTrigger className='bg-muted'>
                          <SelectValue placeholder='Chọn thuộc tính' />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingAttributes ? (
                            <div className='flex items-center justify-center p-2'>
                              <Loader2 className='h-4 w-4 animate-spin' />
                            </div>
                          ) : (
                            attributesData?.result?.map((attr) => (
                              <SelectItem key={attr.id} value={attr.name}>
                                {attr.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label>Giá trị thuộc tính</Label>
                      <MultipleSelector
                        className='bg-muted'
                        value={variation.values}
                        onChange={(options) =>
                          handleVariationValuesChange(variation.id, options)
                        }
                        options={attributeOptionsMap[variation.name] || []}
                        placeholder='Chọn hoặc nhập giá trị...'
                        creatable
                        emptyIndicator={
                          <p className='text-center text-sm'>Không tìm thấy kết quả</p>
                        }
                      />
                    </div>

                    <div className='pt-8'>
                      <Button
                        variant='ghost'
                        size='icon'
                        type='button'
                        onClick={() => removeVariation(variation.id)}
                        disabled={variations.length <= 1}
                        className='text-red-500 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='h-5 w-5' />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* --- Bảng biến thể được tạo tự động --- */}
      {variants.length > 0 && productType === 'VARIANT' && (
        <Card className='bg-muted shadow-none'>
          <CardHeader className='border-b'>
            <CardTitle>Các tổ hợp biến thể</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow className='bg-transparent'>
                  <TableHead className='w-[250px] font-bold'>Biến thể</TableHead>
                  <TableHead className='font-bold'>Giá nhập hàng</TableHead>
                  <TableHead className='font-bold'>Giá bán</TableHead>
                  <TableHead className='font-bold'>Mã SKU</TableHead>
                  <TableHead className='font-bold'>Số lượng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((field, index) => {
                  const combination = field.attributes
                    ?.map((attr) => `${attr.name}:${attr.value}`)
                    .join(' | ')
                  return (
                    <TableRow key={field.id} className='bg-transparent'>
                      <TableCell className='font-medium text-primary'>
                        {combination}
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.purchasePrice`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white h-9'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white h-9'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          {...register(`variants.${index}.sku`)}
                          className='bg-white h-9'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.stock`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white h-9'
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <CreateAttributeDialog
        open={isOpenCreateAttribute}
        onOpenChange={setIsOpenCreateAttribute}
        onSuccess={(newName) => {
          // Auto select the new attribute in the variation list!
          const updatedVariations = [...variations]
          const emptyIndex = updatedVariations.findIndex((v) => !v.name)
          if (emptyIndex !== -1) {
            updatedVariations[emptyIndex] = {
              ...updatedVariations[emptyIndex],
              name: newName,
              values: [],
            }
          } else {
            updatedVariations.push({
              id: Date.now(),
              name: newName,
              values: [],
            })
          }
          setVariations(updatedVariations)
        }}
      />
    </div>
  )
}

export default ProductVariantForm
