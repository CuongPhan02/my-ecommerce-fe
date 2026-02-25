'use client'

import { IconFileUploadFilled } from '@tabler/icons-react'
import { CheckIcon, ImageIcon, Trash, UploadIcon, X, XIcon } from 'lucide-react'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import LoadingData from '~/components/shared/loading-data'

// import Pagination from '~/components/shared/Pagination'
import { AspectRatio } from '~/components/ui/core/aspect-ratio'
import { Button } from '~/components/ui/core/button'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Progress } from '~/components/ui/core/progress'

import { useFileUpload } from '~/hooks/use-file-upload'
import { useUiStore } from '~/store/useUiStore'
import { _mediaService } from '../media.queries'
import { FileItem } from '../types'
import { DEFAULT_FOLDER_MEDIA } from '~/constants'
import Pagination from '~/components/shared/pagination-ui'

const maxSizeMB = 10
const maxSize = maxSizeMB * 1024 * 1024
const maxFiles = 6

type DisplayItem = {
  clientId?: string
  preview?: string
  fileId: string
  altText: string
  url?: string
  id?: string
}

const MediaList = () => {
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

  const [selectMedia, setSelectMedia] = useState<string[]>([])

  const { setLoading, uploadProgress, setUploadProgress, clearUploadProgress } =
    useUiStore()

  const [isSelectMedia, setIsSelectMedia] = useState<boolean>(false)

  const searchParams = useSearchParams()

  const folderMedia = searchParams.get('folderMedia') || ''

  const pageSize = searchParams.get('page') || 1

  const {
    data: mediaList,
    isLoading,
    refetch,
  } = _mediaService.useMediaFileList({
    folderId: folderMedia !== 'all' ? folderMedia : '',
    page: Number(pageSize),
  })

  const metadata = {
    total: mediaList?.data.result.total as number,
    page: mediaList?.data.result.page as number,
    limit: mediaList?.data.result.limit as number,
    totalPages: mediaList?.data.result.totalPages as number,
  }

  const { mutate: uploadFiles } = _mediaService.useMediaUploadFiles()

  const { mutate: deleteFileSingle } = _mediaService.useMediaDeleteSingle()

  const { mutate: deleteFiles } = _mediaService.useMediaDeletes()

  const handleSelectMedia = (id: string) => {
    setSelectMedia((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  useEffect(() => {
    if (selectMedia.length > 0) {
      setIsSelectMedia(true)
    } else {
      setIsSelectMedia(false)
    }
  }, [selectMedia])

  const handleUploadMedia = async () => {
    uploadFiles(
      {
        files: files as FileItem[],
        folderId: folderMedia !== DEFAULT_FOLDER_MEDIA ? folderMedia : '',
        onProgress: (fileId: string, percent: number) => {
          setUploadProgress(fileId, percent)
        },
      },
      {
        onSuccess: () => {
          refetch()
          clearFiles()
          clearUploadProgress()
        },
      }
    )
  }

  const handleDeleteFileMutiple = async () => {
    setLoading(true)
    const payload = {
      Ids: selectMedia,
    }
    deleteFiles(payload, {
      onSuccess: () => {
        if (!isLoading) {
          refetch()
          setSelectMedia([])
        }
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  const handleDeleteFileSingle = async (id: string) => {
    setLoading(true)
    deleteFileSingle(id, {
      onSuccess: () => {
        if (!isLoading) {
          refetch()
        }
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  // ====== kết hợp giữa danh sách api trả về và các file tạm dưới client upload ======= //
  const displayItems: DisplayItem[] = [
    ...files.map((file) => ({
      clientId: file.id,
      preview: file.preview,
      fileId: file.id,
      altText: file.file.name,
      url: file.preview,
      id: file.id,
    })),
    ...(mediaList?.data.result.items ?? []).map((u) => ({
      clientId: '',
      preview: u.url,
      fileId: u.fileId ?? u.id ?? '',
      altText: (u.altText ?? '') as string,
      url: u.url,
      id: u.id,
    })),
  ]

  useEffect(() => {
    if (errors) {
      toast.error(errors[0])
    }
  }, [errors])

  return (
    <div className='flex flex-col gap-2 mt-5'>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className='border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]'
      >
        <input
          {...getInputProps()}
          className='sr-only'
          aria-label='Upload image file'
        />
        {files.length > 0 || displayItems.length > 0 ? (
          <div className='flex w-full flex-col gap-3'>
            <div className='flex items-center justify-between gap-3 flex-wrap'>
              <h3 className='truncate text-sm font-medium'>
                Uploaded Files ({files.length})
              </h3>

              <div className='flex items-center gap-2 flex-wrap'>
                {
                  <Button
                    variant={'secondary'}
                    onClick={clearFiles}
                    disabled={files.length === 0}
                  >
                    CleaFile
                    <X />
                  </Button>
                }

                <Button
                  disabled={!isSelectMedia}
                  onClick={handleDeleteFileMutiple}
                  variant='destructive'
                >
                  {selectMedia.length > 0
                    ? `Remove ${selectMedia.length} file`
                    : 'Remove 0 file'}

                  <Trash />
                </Button>

                <Button
                  variant='default'
                  onClick={handleUploadMedia}
                  disabled={files.length === 0}
                >
                  Upload Selected Files
                  <UploadIcon />
                </Button>
                <Button
                  size='sm'
                  onClick={openFileDialog}
                  disabled={files.length >= maxFiles}
                >
                  <IconFileUploadFilled
                    className='-ms-0.5 size-3.5 opacity-60'
                    aria-hidden='true'
                  />
                  Add File
                </Button>
              </div>
            </div>

            {/* Display Combined Media List */}
            {displayItems.length > 0 && (
              <div className='my-4'>
                {isLoading ? (
                  <LoadingData
                    size='small'
                    message='Loading Media'
                    submessage='Retrieving data from server...'
                    fullscreen={false}
                  />
                ) : (
                  <>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-5 mt-2'>
                      {displayItems.map((item, index) => {
                        return (
                          <div key={index}>
                            <AspectRatio
                              ratio={1}
                              className='bg-accent relative  rounded-md mb-5'
                            >
                              <div className='absolute z-10 -top-2 right-0 p-1 rounded-md flex items-center gap-3 bg-white shadow-2xl border'>
                                {!item.clientId ? (
                                  <label className='border-gray-800 bg-gray-200 text-gray-700 has-data-[state=checked]:border-primary-color has-data-[state=checked]:bg-primary has-data-[state=checked]:text-white has-focus-visible:border-ring has-focus-visible:ring-ring/50 flex size-5 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50'>
                                    <Checkbox
                                      className='sr-only after:absolute after:inset-0'
                                      checked={selectMedia.includes(
                                        item.id as string
                                      )}
                                      onCheckedChange={() =>
                                        handleSelectMedia(item.id as string)
                                      }
                                    />
                                    <span
                                      aria-hidden='true'
                                      className='text-sm font-medium'
                                    >
                                      <CheckIcon className='size-3' />
                                    </span>
                                  </label>
                                ) : (
                                  ''
                                )}
                                <Button
                                  onClick={() => {
                                    if (item.clientId) {
                                      removeFile(item.clientId)
                                    } else {
                                      handleDeleteFileSingle(item.id as string)
                                    }
                                  }}
                                  size='icon'
                                  className='focus-visible:border-background  size-6 rounded-full border-2 shadow-none'
                                  aria-label='Remove image'
                                >
                                  <XIcon className='size-3.5' />
                                </Button>
                              </div>
                              <Image
                                src={item.preview || item.url || ''}
                                alt={item.altText || item.fileId}
                                className='size-full rounded-[inherit] object-cover'
                                width={500}
                                height={500}
                              />

                              {uploadProgress[item.fileId] && (
                                <div className='absolute inset-0 bg-black/50 z-0 rounded-md flex items-end justify-center'>
                                  <Progress
                                    value={uploadProgress[item.fileId]}
                                    className='w-full'
                                  />
                                </div>
                              )}
                            </AspectRatio>
                          </div>
                        )
                      })}
                    </div>

                    {!isLoading && (
                      <Pagination
                        meta={metadata}
                        className='justify-center fixed bottom-3 left-1/2 min-md:left-[55%] -translate-x-1/2'
                        variant='numbers'
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <LoadingData
                size='small'
                message='Loading Media'
                submessage='Retrieving data from server...'
                fullscreen={false}
              />
            ) : (
              <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
                <div
                  className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
                  aria-hidden='true'
                >
                  <ImageIcon className='size-4 opacity-60' />
                </div>
                <p className='mb-1.5 text-sm font-medium'>
                  Drop your images here
                </p>
                <p className='text-muted-foreground text-xs'>
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={openFileDialog}
                >
                  <UploadIcon className='-ms-1 opacity-60' aria-hidden='true' />
                  Select images
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MediaList
