'use client'

import { FolderClosed, FolderEdit } from 'lucide-react'
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
  minLength,
  required,
  useFormValidation,
} from '~/hooks/use-form-validation'

import { useUiStore } from '~/store/useUiStore'
import { _mediaService } from '../media.queries'

const AddFolder = () => {
  const [open, setOpen] = useState(false)

  const { values, errors, handleChange, validateForm, resetForm } =
    useFormValidation(
      {
        name: '',
      },
      {
        name: [required('Name is required'), minLength(3)],
      }
    )

  const { mutate: addFolder } = _mediaService.useMediaFolderCreate()

  const { setLoading } = useUiStore()

  const hanleSubmit = async () => {
    if (!validateForm()) return

    const payload = {
      ...values,
      parentId: null,
    }

    setLoading(true)

    addFolder(payload, {
      onSuccess: () => {
        toast.success(`Add folder ${values.name} successfuly`)
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
        <Button className='h-fit mr-5'>
          CREATE FOLDER
          <FolderClosed className='w-5 h-5 mr-2' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className='mb-2 flex flex-col items-center gap-2'>
          <div
            className='flex size-11 shrink-0 items-center justify-center rounded-full border'
            aria-hidden='true'
          >
            <FolderClosed />
          </div>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>ADD NEW FOLDER</DialogTitle>
          </DialogHeader>
        </div>

        <div className='space-y-5'>
          <div className='*:not-first:mt-2'>
            <div className='relative'>
              <InputGroup>
                <InputGroupInput
                  placeholder='Folder name'
                  type='text'
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                <InputGroupAddon>
                  <FolderClosed />
                </InputGroupAddon>
              </InputGroup>
              {errors.name && (
                <p className='text-red-500 text-sm mt-2'>{errors.name}</p>
              )}
            </div>
          </div>
          <Button className='float-end' onClick={hanleSubmit}>
            Create New
            <FolderEdit />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddFolder
