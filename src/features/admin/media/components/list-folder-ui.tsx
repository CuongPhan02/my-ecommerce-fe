/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Edit, FolderClosed } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Label } from '~/components/ui/core/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/core/radio-group'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'

import { useQueryState } from 'nuqs'

import { toast } from 'react-toastify'
import { useUiStore } from '~/store/useUiStore'

import AddFolder from './add-folder'

import UpdateFolder from './update-folder'
import { _mediaService } from '../media.queries'
import { DEFAULT_FOLDER_MEDIA } from '~/constants'
import { LoadingUiFolder } from './loading-ui-folder'

const ListFolderUi = () => {
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string
    name: string
  } | null>(null)

  const [open, setOpen] = useState(false)

  const [folderMedia, setFolderMedia] = useQueryState('folderMedia')

  const { data: mediaFolderData, isLoading } = _mediaService.useMediaFolder()

  const { setLoading } = useUiStore()

  const { mutate: updateFolder } = _mediaService.useMediaFolderUpdate()

  const { mutate: deleteFolder } = _mediaService.useMediaFolderDelete()

  useEffect(() => {
    if (
      folderMedia === undefined ||
      folderMedia === null ||
      folderMedia === ''
    ) {
      setFolderMedia(DEFAULT_FOLDER_MEDIA)
    }
  }, [folderMedia])

  const handleUpdateValue = (id: string, value: string) => {
    const payload = {
      id: id,
      name: value,
    }
    setLoading(true)
    updateFolder(payload, {
      onSuccess: () => {
        toast.success(`Update folder ${value} successfuly`)
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

  const handleDeleteFolder = (id: string) => {
    setLoading(true)
    deleteFolder(id, {
      onSuccess: () => {
        toast.success(`Delete successfuly`)
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

  const handleFolderChange = (id: string) => {
    if (id === DEFAULT_FOLDER_MEDIA) {
      setFolderMedia(null)
    } else {
      setFolderMedia(id)
    }
  }

  return (
    <div className='space-y-5 w-full'>
      <div className='flex items-center gap-5 sm:gap-20'>
        <legend className='text-foreground text-sm leading-none font-medium whitespace-nowrap'>
          Select Folder
        </legend>
        <AddFolder />
      </div>

      <ScrollArea className='pb-5 w-full'>
        {isLoading ? (
          <LoadingUiFolder />
        ) : folderMedia === undefined ? (
          <LoadingUiFolder />
        ) : (
          <RadioGroup
            key={folderMedia}
            className='inline-flex gap-3 sm:gap-6 min-w-max'
            value={folderMedia ?? ''}
            onValueChange={handleFolderChange}
          >
            <div
              key='all-folder'
              className='border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none cursor-pointer min-w-[130px] sm:min-w-[150px]'
            >
              <div className='flex justify-between gap-2 cursor-pointer'>
                <RadioGroupItem
                  value={DEFAULT_FOLDER_MEDIA}
                  className='order-1 after:absolute after:inset-0 cursor-pointer'
                />
                <FolderClosed />
              </div>
              <Label htmlFor='all-folder'>All</Label>
            </div>

            {mediaFolderData?.result.map((item) => (
              <div
                key={`${item.id}-${item.name}`}
                className='border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none cursor-pointer min-w-[130px] sm:min-w-[150px]'
              >
                <div className='flex justify-between gap-2 cursor-pointer'>
                  <RadioGroupItem
                    key={item.id}
                    value={item.id}
                    className='order-1 after:absolute after:inset-0 cursor-pointer'
                  />
                  <FolderClosed />
                </div>
                <Label htmlFor={`${item.id}-${item.name}`}>{item.name}</Label>
                <div className='absolute bottom-3 right-2'>
                  <div className='absolute bottom-3 right-2'>
                    <Edit
                      className='text-red-500 cursor-pointer'
                      size={18}
                      onClick={() => {
                        setSelectedFolder(item)
                        setOpen(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        )}

        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <UpdateFolder
        open={open}
        setOpen={setOpen}
        folder={selectedFolder}
        handleUpdateValue={handleUpdateValue}
        handleDeleteFolder={handleDeleteFolder}
      />
    </div>
  )
}

export default ListFolderUi
