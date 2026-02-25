'use client'
import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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

interface Variation {
  id: number
  name: string
  values: Option[]
}

interface GeneratedVariant {
  combination: string
  purchasePrice: string
  unitPrice: string
  sku: string
  quantity: string
}

const INITIAL_ATTRIBUTE_OPTIONS: Record<string, Option[]> = {
  Colors: [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
  ],
  Size: [
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
  ],
}

// Hàm tạo tổ hợp chéo (Cartesian Product)
const getCombinations = (
  arrays: Option[][],
  optionNames: string[]
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
    combo.map((value, index) => `${optionNames[index]}:${value}`).join(' | ')
  )
}

const ProductVariantForm = () => {
  const [productType, setProductType] = useState<'single' | 'variant'>('single')

  const [attributeOptions, setAttributeOptions] = useState<
    Record<string, Option[]>
  >(INITIAL_ATTRIBUTE_OPTIONS)

  const [variations, setVariations] = useState<Variation[]>([
    { id: 1, name: 'Colors', values: [] },
  ])

  const [generatedVariants, setGeneratedVariants] = useState<
    GeneratedVariant[]
  >([])

  useEffect(() => {
    if (productType === 'variant') {
      const optionValues = variations.map((v) => v.values)
      const optionNames = variations.map((v) => v.name)

      const combinations = getCombinations(optionValues, optionNames)

      const newVariants = combinations.map((combo) => {
        // Tạo SKU tự động từ các biến thể
        const skuSuffix = combo
          .split(' | ')
          .map((part) => part.split(':')[1])
          .join('-')

        return {
          combination: combo,
          purchasePrice: '0',
          unitPrice: '0',
          sku: `-${skuSuffix}`,
          quantity: '0',
        }
      })
      setGeneratedVariants(newVariants)
    }
  }, [variations, productType])

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: '', values: [] }])
  }

  const removeVariation = (id: number) => {
    setVariations(variations.filter((v) => v.id !== id))
  }

  const handleVariationNameChange = (id: number, newName: string) => {
    setVariations(
      variations.map((v) => (v.id === id ? { ...v, name: newName } : v))
    )
  }

  // --- CẬP NHẬT: Logic xử lý khi giá trị của MultipleSelector thay đổi ---
  const handleVariationValuesChange = (id: number, newValues: Option[]) => {
    let variationName = ''

    setVariations(
      variations.map((v) => {
        if (v.id === id) {
          variationName = v.name
          return { ...v, values: newValues }
        }
        return v
      })
    )

    // 2. Cập nhật "danh sách có sẵn" (attributeOptions)
    // Nếu thuộc tính này có tên
    if (variationName) {
      // Lấy danh sách các lựa chọn hiện có cho thuộc tính này
      const currentOptions = attributeOptions[variationName] || []
      const newOptionsToAdd: Option[] = []

      // Lọc ra những lựa chọn "mới" (được tạo ra)
      newValues.forEach((option) => {
        if (!currentOptions.some((o) => o.value === option.value)) {
          newOptionsToAdd.push(option)
        }
      })

      // Nếu có lựa chọn mới, cập nhật state attributeOptions
      if (newOptionsToAdd.length > 0) {
        setAttributeOptions((prev) => ({
          ...prev,
          [variationName]: [...currentOptions, ...newOptionsToAdd],
        }))
      }
    }
  }

  return (
    <div className='space-y-10'>
      <Card className='bg-muted shadow-none '>
        <CardHeader className='border-b font-bold'>Product Type</CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue='single'
            onValueChange={(value: 'single' | 'variant') =>
              setProductType(value)
            }
            className='flex items-center gap-8'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='single' id='r1' />
              <Label htmlFor='r1'>Single Product</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='variant' id='r2' />
              <Label htmlFor='r2'>Variant Product</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* --- Form for Single Product --- */}
      {productType === 'single' && (
        <Card className='bg-muted shadow-none '>
          <CardHeader>
            <CardTitle>Product Price And Stock</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Purchase Price</Label>
              <Input type='number' defaultValue='0.00' className='bg-white' />
            </div>
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Unit Price</Label>
              <Input type='number' defaultValue='0.00' className='bg-white' />
            </div>
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Quantity</Label>
              <Input type='number' defaultValue='00' className='bg-white' />
            </div>
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Sku</Label>
              <Input placeholder='Type product sku' className='bg-white' />
            </div>
          </CardContent>
        </Card>
      )}
      {/* --- Form for Variant Product --- */}
      {productType === 'variant' && (
        <>
          <Card className='bg-muted shadow-none'>
            <CardHeader>
              <CardTitle>Product Variation</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className='grid grid-cols-[150px_1fr_auto] items-center gap-4'
                >
                  <Input
                    value={variation.name}
                    placeholder='Attribute (e.g., Size)'
                    onChange={(e) =>
                      handleVariationNameChange(variation.id, e.target.value)
                    }
                    className='font-semibold bg-white'
                  />
                  <MultipleSelector
                    className='bg-white dark:bg-accent'
                    value={variation.values}
                    onChange={(options) =>
                      handleVariationValuesChange(variation.id, options)
                    }
                    defaultOptions={attributeOptions[variation.name] || []}
                    placeholder='Select or insert options...'
                    creatable
                    emptyIndicator={
                      <p className='text-center text-sm'>No results found</p>
                    }
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => removeVariation(variation.id)}
                    disabled={variations.length <= 1}
                  >
                    <Trash2 className='h-4 w-4 text-red-500' />
                  </Button>
                </div>
              ))}
              <Button variant='outline' onClick={addVariation}>
                Add another option
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* --- Bảng biến thể được tạo tự động --- */}
      {generatedVariants.length > 0 && productType === 'variant' && (
        <Card className='bg-muted shadow-none'>
          <CardHeader>
            <CardTitle>Product Price And Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[200px]'>Variant</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Sku</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedVariants.map((variant) => (
                  <TableRow key={variant.combination}>
                    <TableCell className='font-medium'>
                      {variant.combination}
                    </TableCell>
                    <TableCell>
                      <Input
                        type='number'
                        defaultValue={variant.purchasePrice}
                        className='bg-white'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='number'
                        defaultValue={variant.unitPrice}
                        className='bg-white'
                      />
                    </TableCell>
                    <TableCell>
                      <Input defaultValue={variant.sku} className='bg-white' />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='number'
                        defaultValue={variant.quantity}
                        className='bg-white'
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProductVariantForm
