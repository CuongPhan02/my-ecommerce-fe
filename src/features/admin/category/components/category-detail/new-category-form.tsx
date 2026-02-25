'use client'

import { ImageIcon } from 'lucide-react'
import React from 'react'
import UploadFormMediaUi from '~/components/shared/MediaManagement/upload-form-media-ui'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { Textarea } from '~/components/ui/core/textarea'
import { cn } from '~/lib/utils'

const NewCategoryForm = () => {
  return (
    <Card className='bg-transparent w-full shadow-none border-none'>
      <CardContent className='p-6 space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-6'>
          <Label
            htmlFor='cat-name'
            className='text-right font-medium text-gray-700 dark:text-gray-200'
          >
            Name
          </Label>
          <Input id='cat-name' placeholder='Type here' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-6'>
          <Label
            htmlFor='cat-parent'
            className='text-right font-medium text-gray-700 dark:text-gray-200'
          >
            Parent
          </Label>
          <Select>
            <SelectTrigger id='cat-parent' className='w-full'>
              <SelectValue placeholder='Select a Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='clothing'>Clothing</SelectItem>
              <SelectItem value='electronics'>Electronics</SelectItem>
              <SelectItem value='furniture'>Furniture</SelectItem>
              <SelectItem value='books'>Books</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[180px_1fr] items-start gap-6'>
          <div className='text-right font-medium text-gray-700 dark:text-gray-200 pt-2'>
            <Label htmlFor='cat-icon-upload'>Icon</Label>
          </div>
          <div className='flex flex-col items-start gap-3'>
            <UploadFormMediaUi
              text='Drag & Drop or Choose Gallery Files'
              icon={<ImageIcon className='h-8 w-8 text-gray-400' />}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-6'>
          <Label
            htmlFor='meta-title'
            className='text-right font-medium text-gray-700 dark:text-gray-200'
          >
            Meta Title
          </Label>
          <Input id='meta-title' placeholder='Type here' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[180px_1fr] items-start gap-6'>
          <Label
            htmlFor='meta-image-upload'
            className='text-right font-medium text-gray-700 dark:text-gray-200 pt-2'
          >
            Meta Image
          </Label>
          <div className='flex flex-col items-start gap-3'>
            <UploadFormMediaUi
              text='Drag & Drop or Choose Gallery Files'
              icon={<ImageIcon className='h-8 w-8 text-gray-400' />}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[180px_1fr] items-start gap-6'>
          <Label
            htmlFor='meta-desc'
            className='text-right font-medium text-gray-700 dark:text-gray-200 pt-2'
          ></Label>
          <Textarea
            id='meta-desc'
            placeholder='Type meta description here...'
            rows={5}
          />
        </div>
      </CardContent>

      <CardFooter className='border-t border-gray-200 dark:border-gray-700 px-6 flex justify-end'>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}

export default NewCategoryForm
