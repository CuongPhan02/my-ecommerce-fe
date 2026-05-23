'use client'

import { FolderClosed, FolderEdit, FolderTree, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/core/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '~/components/ui/core/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import {
  minLength,
  required,
  useFormValidation,
} from '~/hooks/use-form-validation'

import { useUiStore } from '~/store/useUiStore'
import { _mediaService } from '../media.query'

const AddFolder = () => {
  const [open, setOpen] = useState(false)

  const { values, errors, handleChange, validateForm, resetForm } =
    useFormValidation(
      {
        name: '',
        parentId: 'root',
      },
      {
        name: [required('Tên thư mục là bắt buộc'), minLength(3)],
      },
    )

  const { mutate: addFolder } = _mediaService.useMediaFolderCreate()
  const { data: mediaFolderData } = _mediaService.useMediaFolder()

  const { setLoading } = useUiStore()

  const hanleSubmit = async () => {
    if (!validateForm()) return

    const payload = {
      name: values.name,
      parentId: values.parentId === 'root' ? null : values.parentId,
    }

    setLoading(true)

    addFolder(payload, {
      onSuccess: () => {
        toast.success(`Thêm thư mục ${values.name} thành công`)
        resetForm()
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          variant='outline'
          className='h-8 text-xs gap-1.5 px-2.5 font-medium border-dashed hover:border-primary hover:text-primary transition-all duration-200'
        >
          <Plus className='w-3.5 h-3.5' />
          Tạo thư mục
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] p-6 overflow-hidden rounded-2xl border border-muted bg-card shadow-2xl">
        <div className='flex flex-col items-center gap-3 text-center mb-6'>
          <div
            className='flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-xs'
            aria-hidden='true'
          >
            <FolderClosed className="w-6 h-6" />
          </div>
          <DialogHeader>
            <DialogTitle className='sm:text-center text-base font-bold tracking-tight'>Thêm thư mục mới</DialogTitle>
            <p className="text-xs text-muted-foreground">Tạo một phân cấp lưu trữ tệp mới</p>
          </DialogHeader>
        </div>

        <div className='space-y-4 mb-6'>
          <div className='relative'>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tên thư mục</label>
            <InputGroup className="shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 rounded-lg overflow-hidden">
              <InputGroupInput
                placeholder='Nhập tên thư mục mới...'
                type='text'
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="h-10 text-sm font-medium"
              />
              <InputGroupAddon className="bg-muted/30 border-l border-muted">
                <FolderClosed className="w-4 h-4 text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
            {errors.name && (
              <p className='text-red-500 text-xs mt-1.5 font-medium'>{errors.name}</p>
            )}
          </div>
          
          <div className='relative flex flex-col gap-1.5'>
            <label className="text-xs font-semibold text-muted-foreground block">Thư mục cha</label>
            <Select
              value={values.parentId}
              onValueChange={(value) => handleChange('parentId', value)}
            >
              <SelectTrigger className='w-full h-10 shadow-xs border-muted bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium rounded-lg'>
                <SelectValue placeholder='Chọn thư mục cha' />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-muted shadow-lg">
                <SelectItem value='root' className="text-xs py-2">
                  <div className='flex items-center gap-2'>
                    <FolderTree className='w-4 h-4 text-primary/75' />
                    <span className="font-semibold text-foreground">Thư mục gốc (Root)</span>
                  </div>
                </SelectItem>
                {mediaFolderData?.result?.map((folder: any) => (
                  <SelectItem key={folder.id} value={folder.id} className="text-xs py-2">
                    <div className='flex items-center gap-2'>
                      <FolderClosed className='w-4 h-4 text-muted-foreground/75' />
                      <span>{folder.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex items-center gap-3 justify-end border-t border-muted pt-4'>
          <Button onClick={() => setOpen(false)} variant='outline' className="h-9 text-xs transition-all">
            Hủy bỏ
          </Button>
          <Button onClick={hanleSubmit} variant='default' className="h-9 text-xs gap-1.5 transition-all">
            Tạo mới
            <FolderEdit className="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddFolder
