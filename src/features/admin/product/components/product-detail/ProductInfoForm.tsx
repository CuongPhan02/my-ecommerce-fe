import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { ProductSchemaType } from '../../product.schema'
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

const ProductInfoForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'books', label: 'Books' },
  ]

  const brands = [
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'ikea', label: 'IKEA' },
    { value: 'nike', label: 'Nike' },
  ]

  const frameworks: Option[] = [
    {
      value: 'next.js',
      label: 'Next.js',
    },
    {
      value: 'sveltekit',
      label: 'SvelteKit',
    },

    {
      value: 'remix',
      label: 'Remix',
    },
    {
      value: 'astro',
      label: 'Astro',
    },
    {
      value: 'angular',
      label: 'Angular',
    },
    {
      value: 'vue',
      label: 'Vue.js',
    },
    {
      value: 'react',
      label: 'React',
    },
    {
      value: 'ember',
      label: 'Ember.js',
    },
    {
      value: 'gatsby',
      label: 'Gatsby',
    },
  ]

  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>
        Product Information
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Name <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Input
            {...register('name')}
            placeholder='Product Name'
            type='text'
            required
            className='bg-white'
            aria-invalid={errors.name && errors.name.message ? true : false}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Categories <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Select {...register('category')}>
            <SelectTrigger
              className='w-full bg-white'
              aria-invalid={
                errors.category && errors.category.message ? true : false
              }
            >
              <SelectValue placeholder='Select Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories.map((category) => {
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Brand <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Select>
            <SelectTrigger
              className='w-full bg-white'
              aria-invalid={errors.brand && errors.brand.message ? true : false}
            >
              <SelectValue placeholder='Select Brands' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Brands</SelectLabel>
                {brands.map((category) => {
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Tags <span className='text-destructive'>*</span>
            </Label>
          </div>
          <MultipleSelector
            className='bg-white dark:bg-accent'
            commandProps={{
              label: 'Select Tags',
            }}
            value={frameworks.slice(0, 2)}
            defaultOptions={frameworks}
            placeholder='Select Tags'
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className='text-center text-sm'>No results found</p>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInfoForm
