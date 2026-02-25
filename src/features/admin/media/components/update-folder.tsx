'use client'

import { Edit2, FolderClosed, FolderEdit, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface UpdateFolderProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  folder?: { id: string; name: string } | null
  handleUpdateValue: (id: string, value: string) => void
  handleDeleteFolder: (id: string) => void
}

const UpdateFolder = ({
  open,
  setOpen,
  folder,
  handleUpdateValue,
  handleDeleteFolder,
}: UpdateFolderProps) => {
  const { values, errors, handleChange, setValues, validateForm } =
    useFormValidation(
      {
        name: '',
      },
      {
        name: [required('Name is required'), minLength(3)],
      }
    )

  useEffect(() => {
    if (folder) {
      setValues({ name: folder.name })
    }
  }, [folder, setValues])

  const hanleSubmit = async () => {
    if (!validateForm() || !folder) return
    handleUpdateValue(folder.id, values.name)
    setOpen(false)
  }

  const handleDelete = () => {
    if (!validateForm() || !folder) return
    handleDeleteFolder(folder.id)
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <div className='mb-2 flex flex-col items-center gap-2'>
          <div
            className='flex size-11 shrink-0 items-center justify-center rounded-full border'
            aria-hidden='true'
          >
            <FolderEdit />
          </div>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>UPDATE FOLDER</DialogTitle>
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
        </div>
        <div className='flex items-center gap-5 justify-end '>
          <Button onClick={hanleSubmit} variant={'outline'}>
            Update
            <Edit2 />
          </Button>
          <Button variant={'destructive'} onClick={handleDelete}>
            Remove
            <Trash2 />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateFolder
