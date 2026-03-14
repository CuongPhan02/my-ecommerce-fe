'use client'
import { IconFileUploadFilled } from '@tabler/icons-react'
import { ImageIcon, UploadIcon, X } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useQueryState } from 'nuqs'
import { useFileUpload } from '~/hooks/use-file-upload'
import { useUiStore } from '~/store/useUiStore'
import { _mediaService } from '../media.query'
import { DEFAULT_FOLDER_MEDIA } from '~/constants'
import { FileItem, DisplayItem } from '../types'
import { MediaGrid } from './media-grid'

import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/core/dialog'
import { useState } from 'react'

interface MediaModalUploadProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

const maxSizeMB = 10
const maxSize = maxSizeMB * 1024 * 1024
const maxFiles = 6

const MediaModalUpload = ({ trigger, onSuccess }: MediaModalUploadProps) => {
  const [open, setOpen] = useState(false)
  const [folderMedia] = useQueryState('folderMedia')

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      clearFiles,
    },
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize,
    multiple: true,
    maxFiles,
  })

  const { uploadProgress, setUploadProgress, clearUploadProgress } =
    useUiStore()

  const { mutate: uploadFiles, isPending: isPendingUploadFiles } =
    _mediaService.useMediaUploadFiles()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      clearFiles()
      clearUploadProgress()
    }
  }

  useEffect(() => {
    if (errors) {
      toast.error(errors[0])
    }
  }, [errors])

  const handleUploadMedia = async () => {
    uploadFiles(
      {
        files: files as FileItem[],
        folderId:
          folderMedia && folderMedia !== DEFAULT_FOLDER_MEDIA
            ? folderMedia
            : '',
        onProgress: (fileId: string, percent: number) => {
          setUploadProgress(fileId, percent)
        },
      },
      {
        onSuccess: () => {
          clearFiles()
          clearUploadProgress()
          setOpen(false)
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  const displayItems: DisplayItem[] = files.map((file) => ({
    clientId: file.id,
    preview: file.preview,
    fileId: file.id,
    altText: file.file.name,
    url: file.preview,
    id: file.id,
  }))
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-4xl w-full h-[85vh] flex flex-col gap-0 p-0 overflow-hidden'>
        <DialogHeader className='p-6 pb-4 border-b shrink-0'>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 p-6'>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            className='border-input data-[dragging=true]:bg-accent/50 ring-0 focus:ring-0 focus:ring-offset-0  relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors'
          >
            <input
              {...getInputProps()}
              className='sr-only'
              aria-label='Upload image file'
            />

            <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
              <div
                className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
                aria-hidden='true'
              >
                <ImageIcon className='size-4 opacity-60' />
              </div>
              <p className='mb-1.5 text-sm font-medium'>
                Click or drop your images here
              </p>
              <p className='text-muted-foreground text-xs'>
                SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={openFileDialog}
                disabled={files.length >= maxFiles}
              >
                <UploadIcon className='-ms-1 opacity-60' aria-hidden='true' />
                Select images
              </Button>
            </div>
          </div>

          {displayItems.length > 0 && (
            <div className='mt-4'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='truncate text-sm font-medium'>
                  Selected Files ({files.length}/{maxFiles})
                </h3>
                <Button variant='secondary' size='sm' onClick={clearFiles}>
                  Clear All
                  <X className='size-4 ml-1' />
                </Button>
              </div>
              <MediaGrid
                items={displayItems}
                selectedIds={[]}
                uploadProgress={uploadProgress}
                onSelect={() => {}}
                onRemove={(id) => removeFile(id)}
              />
            </div>
          )}
        </div>

        <DialogFooter className='border-t p-6 sm:justify-between flex-row items-center shrink-0'>
          <div className='text-sm text-muted-foreground'>
            {files.length > 0
              ? `${files.length} ready to upload`
              : 'No files selected'}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadMedia}
              disabled={files.length === 0 || isPendingUploadFiles}
            >
              {isPendingUploadFiles ? 'Uploading...' : 'Upload Files'}
              {!isPendingUploadFiles && <UploadIcon className='w-4 h-4 ml-2' />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MediaModalUpload

MediaModalUpload.displayName = 'MediaModalUpload'
