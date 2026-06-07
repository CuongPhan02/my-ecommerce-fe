'use client'
import { Trash2, Loader2, Plus } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import { Badge } from '~/components/ui/core/badge'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { CreateAttributeDialog } from './create-attribute-dialog'
import { generateRandomId } from '~/lib/utils'

interface CurrencyInputProps {
  name: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

const CurrencyInput = ({
  name,
  placeholder = '0',
  className,
  disabled,
}: CurrencyInputProps) => {
  const { control } = useFormContext()

  const formatValue = (val: any) => {
    if (val === undefined || val === null || val === '') return ''
    const num = Number(val)
    if (isNaN(num)) return ''
    return num.toLocaleString('vi-VN')
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const displayValue =
          value === 0 || value === undefined || value === null
            ? ''
            : formatValue(value)

        return (
          <Input
            type='text'
            placeholder={placeholder}
            value={displayValue}
            onChange={(e) => {
              const cleanVal = e.target.value.replace(/[^0-9]/g, '')
              const numVal = cleanVal === '' ? 0 : Number(cleanVal)
              onChange(numVal)
            }}
            disabled={disabled}
            className={className}
          />
        )
      }}
    />
  )
}

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
        newResult.push([...res, item.value])
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
  const {
    control,
    register,
    watch,
    setValue,
    formState: { dirtyFields },
  } = useFormContext<ProductSchemaType>()
  const { fields: variants, replace } = useFieldArray({
    control,
    name: 'variants',
  })

  const productType = watch('type')
  const productName = watch('name')
  const randomId = useMemo(
    () => generateRandomId().slice(0, 4).toUpperCase(),
    [],
  )

  const baseSku = useMemo(() => {
    if (!productName) return ''
    const slug = productName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .toUpperCase()
    return `${slug}-${randomId}`
  }, [productName, randomId])

  // API Integration
  const { data: attributesData, isLoading: isLoadingAttributes } =
    _attributeService.useAllAttributes()

  const [variations, setVariations] = useState<Variation[]>([
    { id: Date.now(), name: '', values: [] },
  ])
  const [isOpenCreateAttribute, setIsOpenCreateAttribute] = useState(false)
  const [showTypeConfirm, setShowTypeConfirm] = useState(false)
  const [pendingType, setPendingType] = useState<'SINGLE' | 'VARIANT' | null>(null)

  // Map API data to options format for MultipleSelector
  const attributeOptionsMap = useMemo(() => {
    const map: Record<string, Option[]> = {}
    attributesData?.result?.forEach((attr) => {
      map[attr.name] = attr.values.map((v) => ({
        label:
          v.name && v.name !== v.value ? `${v.name} (${v.value})` : v.value,
        value: v.value,
      }))
    })
    return map
  }, [attributesData])

  // Initialize variations from form options (for editing)
  useEffect(() => {
    const formOptions = watch('options')
    if (formOptions && formOptions.length > 0 && attributesData?.result) {
      // Check if variations actually need initializing from options
      const hasUninitializedVariations =
        variations.length === 1 && variations[0].name === ''
      if (hasUninitializedVariations) {
        const initialVariations = formOptions.map((opt, index) => {
          const displayAttr = attributesData.result?.find(
            (a) => a.name === opt.name,
          )
          return {
            id: `init-${index}`,
            name: opt.name,
            values: opt.values.map((v) => {
              const displayVal = displayAttr?.values?.find((val) => val.value === v)
              const label =
                displayVal?.name && displayVal.name !== displayVal.value
                  ? `${displayVal.name} (${displayVal.value})`
                  : v
              return { label, value: v }
            }),
          }
        })
        setVariations(initialVariations)
      }
    }
  }, [watch('options'), attributesData, variations])

  useEffect(() => {
    if (productType === 'VARIANT') {
      const activeVariations = variations.filter(
        (v) => v.name && v.values.length > 0,
      )

      // Update options field in form
      const optionsData = activeVariations.map((v) => ({
        name: v.name,
        values: v.values.map((val) => val.value),
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
            const [name, ...valueParts] = part.split(':')
            const value = valueParts.join(':')
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

          const variantSlug = comboAttributes
            .map((a) =>
              a.value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]/g, '')
                .toUpperCase(),
            )
            .join('-')

          const autoSku = baseSku ? `${baseSku}-${variantSlug}` : variantSlug

          return {
            id: existingVariant?.id, // Keep ID if available (crucial for updates)
            sku: existingVariant?.sku || autoSku,
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
      const currentVariants = watch('variants') || []
      const autoSku = baseSku

      if (
        currentVariants.length === 0 ||
        (currentVariants[0]?.attributes &&
          currentVariants[0].attributes.length > 0)
      ) {
        // Reset/Initialize for SINGLE product type
        replace([
          {
            sku: autoSku,
            price: 0,
            stock: 0,
            purchasePrice: 0,
            attributes: [],
          },
        ])
      } else {
        // Update existing SKU if not manually edited
        const isSkuDirty = dirtyFields.variants?.[0]?.sku
        if (!isSkuDirty && currentVariants[0].sku !== autoSku) {
          setValue('variants.0.sku', autoSku, { shouldValidate: true })
        }
      }
    }
  }, [variations, productType, setValue, replace, baseSku, dirtyFields.variants])

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

  const handleTypeChange = (value: 'SINGLE' | 'VARIANT') => {
    if (productType === 'VARIANT' && value === 'SINGLE') {
      const hasData = variations.some((v) => v.name || v.values.length > 0)
      if (hasData) {
        setPendingType(value)
        setShowTypeConfirm(true)
        return
      }
    }
    setValue('type', value)
  }

  const confirmTypeChange = () => {
    if (pendingType === 'SINGLE') {
      // Reset variations state
      setVariations([{ id: Date.now(), name: '', values: [] }])
      // Reset options in form
      setValue('options', [])
      // Reset variants in form (useFieldArray)
      replace([
        {
          sku: '',
          price: 0,
          stock: 0,
          purchasePrice: 0,
          attributes: [],
        },
      ])
      setValue('type', 'SINGLE')
    }
    setShowTypeConfirm(false)
    setPendingType(null)
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
                onValueChange={handleTypeChange}
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
              <CurrencyInput
                name={`variants.${0}.purchasePrice`}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Giá bán</Label>
              <CurrencyInput
                name={`variants.${0}.price`}
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
              {!isLoadingAttributes &&
              (!attributesData?.result ||
                attributesData.result.length === 0) ? (
                <div className='flex flex-col items-center justify-center py-10 px-4 border border-dashed rounded-lg bg-background/30 space-y-4 text-center'>
                  <div className='p-3 bg-primary/10 text-primary rounded-full'>
                    <Plus className='h-6 w-6' />
                  </div>
                  <div className='space-y-1'>
                    <h4 className='font-semibold text-sm'>
                      Chưa có thuộc tính nào được tạo
                    </h4>
                    <p className='text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed'>
                      Sản phẩm có biến thể yêu cầu ít nhất một thuộc tính (ví
                      dụ: Màu sắc, Kích thước) để cấu hình các phân loại hàng
                      bán.
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
                          <p className='text-center text-sm'>
                            Không tìm thấy kết quả
                          </p>
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

      {/* --- Các tổ hợp biến thể được tạo tự động dưới dạng Card riêng biệt --- */}
      {variants.length > 0 && productType === 'VARIANT' && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label className='text-base font-bold text-slate-800 dark:text-slate-200'>
              Danh sách các tổ hợp biến thể ({variants.length})
            </Label>
          </div>
          <div className='grid grid-cols-1 gap-4'>
            {variants.map((field, index) => {
              const comboAttributes = field.attributes || []
              return (
                <Card
                  key={field.id}
                  className='bg-white dark:bg-slate-900 border shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden'
                >
                  {/* Tiêu đề tổ hợp hiển thị dạng Badge chuyên nghiệp */}
                  <div className='bg-slate-50/80 dark:bg-slate-800/40 px-4 py-3 border-b flex flex-wrap items-center gap-2'>
                    <span className='text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-550 uppercase mr-1'>
                      Tổ hợp #{index + 1}:
                    </span>
                    {comboAttributes.map((attr, idx) => {
                      const displayAttr = attributesData?.result?.find(
                        (a) => a.name === attr.name,
                      )
                      const displayVal = displayAttr?.values?.find(
                        (v) => v.value === attr.value,
                      )
                      const displayLabel =
                        displayVal?.name && displayVal.name !== displayVal.value
                          ? `${displayVal.name} (${displayVal.value})`
                          : attr.value
                      return (
                        <Badge
                          key={idx}
                          variant='outline'
                          className='bg-orange-50/50 border-orange-100 hover:bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:border-orange-900/50 dark:text-orange-400 font-medium py-0.5 px-2 rounded-md text-xs'
                        >
                          <span className='text-slate-400 dark:text-slate-500 font-normal mr-1'>
                            {attr.name}:
                          </span>
                          {displayLabel}
                        </Badge>
                      )
                    })}
                  </div>

                  {/* Form nhập liệu của từng biến thể */}
                  <CardContent className='p-4 bg-white/50 dark:bg-transparent'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                      {/* Giá nhập hàng */}
                      <div className='space-y-1.5'>
                        <Label className='text-xs font-semibold text-slate-650 dark:text-slate-400'>
                          Giá nhập hàng
                        </Label>
                        <CurrencyInput
                          name={`variants.${index}.purchasePrice`}
                          className='bg-white dark:bg-muted/30 h-9 text-sm focus-visible:ring-orange-500'
                        />
                      </div>

                      {/* Giá bán */}
                      <div className='space-y-1.5'>
                        <Label className='text-xs font-semibold text-slate-650 dark:text-slate-400'>
                          Giá bán <span className='text-red-500'>*</span>
                        </Label>
                        <CurrencyInput
                          name={`variants.${index}.price`}
                          className='bg-white dark:bg-muted/30 h-9 text-sm focus-visible:ring-orange-500'
                        />
                      </div>

                      {/* Mã SKU */}
                      <div className='space-y-1.5'>
                        <Label className='text-xs font-semibold text-slate-650 dark:text-slate-400'>
                          Mã SKU
                        </Label>
                        <Input
                          placeholder='Nhập mã SKU...'
                          {...register(`variants.${index}.sku`)}
                          className='bg-white dark:bg-muted/30 h-9 text-sm focus-visible:ring-orange-500'
                        />
                      </div>

                      {/* Số lượng */}
                      <div className='space-y-1.5'>
                        <Label className='text-xs font-semibold text-slate-650 dark:text-slate-400'>
                          Số lượng tồn kho
                        </Label>
                        <Input
                          type='number'
                          placeholder='0'
                          {...register(`variants.${index}.stock`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white dark:bg-muted/30 h-9 text-sm focus-visible:ring-orange-500'
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
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

      {/* Confirmation Dialog for Product Type Change */}
      <Dialog open={showTypeConfirm} onOpenChange={setShowTypeConfirm}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-red-600'>
              Xác nhận thay đổi
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Khi chuyển sang <strong>Sản phẩm đơn giản</strong>, toàn bộ cấu
              hình biến thể và danh sách phân loại hàng hiện tại sẽ bị xóa. Bạn
              có chắc chắn muốn tiếp tục?
            </p>
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              variant='outline'
              onClick={() => {
                setShowTypeConfirm(false)
                setPendingType(null)
              }}
            >
              Hủy bỏ
            </Button>
            <Button variant='destructive' onClick={confirmTypeChange}>
              Xác nhận chuyển đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductVariantForm
