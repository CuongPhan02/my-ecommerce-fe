'use client'
import { Trash } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/core/button'
import { _mediaService } from '../media.query'
import { DisplayItem } from '../types'
import Pagination from '~/components/shared/pagination-ui'
import { LoadingUiMediaList } from './loading-ui-list'
import { MediaGrid } from './media-grid'
import MediaModalUpload from './media-modal-upload'
import { useUiStore } from '~/store/useUiStore'

const MediaList = () => {
  const [selectMedia, setSelectMedia] = useState<string[]>([])
  const [isSelectMedia, setIsSelectMedia] = useState<boolean>(false)

  const searchParams = useSearchParams()

  const folderMedia = searchParams.get('folderMedia') || ''

  const pageSize = searchParams.get('page') || 1

  const {
    data: mediaList,
    isLoading,
    refetch,
  } = _mediaService.useMediaFileList({
    folderId: folderMedia,
    page: Number(pageSize),
  })

  const metadata = {
    total: mediaList?.result.total as number,
    page: mediaList?.result.page as number,
    limit: mediaList?.result.limit as number,
    totalPages: mediaList?.result.totalPages as number,
  }

  const { setLoading } = useUiStore()

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

  const handleClearAll = () => {
    setSelectMedia([])
  }

  useEffect(() => {
    if (selectMedia.length > 0) {
      setIsSelectMedia(true)
    } else {
      setIsSelectMedia(false)
    }
  }, [selectMedia])

  const handleDeleteFileMutiple = async () => {
    setLoading(true)
    const payload = {
      ids: selectMedia,
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
    deleteFileSingle(id, {
      onSuccess: () => {
        if (!isLoading) {
          refetch()
        }
      },
    })
  }

  const displayItems: DisplayItem[] = (mediaList?.result.items ?? []).map(
    (u: any) => ({
      clientId: '',
      preview: u.url,
      fileId: u.fileId ?? u.id ?? '',
      altText: (u.altText ?? '') as string,
      url: u.url,
      id: u.id,
      mediaType: u.fileType,
    }),
  )

  return (
    <div className='flex flex-col gap-2 mt-5'>
      <div className='w-full'>
        <div className='flex w-full flex-col gap-3'>
          <div className='flex items-center justify-between gap-3 flex-wrap'>
            <h3 className='truncate text-sm font-medium'>
              Media Library ({displayItems.length})
            </h3>

            <div className='flex items-center gap-2 flex-wrap'>
              <Button onClick={handleClearAll} disabled={!isSelectMedia}>
                Clear Selected All
              </Button>
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

              <MediaModalUpload
                onSuccess={() => refetch()}
                trigger={<Button>Add File</Button>}
              />
            </div>
          </div>

          {/* Display Media List */}
          {displayItems.length > 0 ? (
            <div className='my-4'>
              {isLoading ? (
                <LoadingUiMediaList count={12} />
              ) : (
                <>
                  <MediaGrid
                    items={displayItems}
                    selectedIds={selectMedia}
                    uploadProgress={{}}
                    onSelect={(id) => handleSelectMedia(id)}
                    onRemove={(id) => handleDeleteFileSingle(id)}
                  />

                  {!isLoading && (
                    <Pagination
                      meta={metadata}
                      className='justify-center fixed bottom-0 left-1/2 min-md:left-[55%] -translate-x-1/2 z-50 bg-accent p-2 rounded-md main-container w-full'
                      variant='numbers'
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {isLoading ? (
                <LoadingUiMediaList count={12} />
              ) : (
                <div className='flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground'>
                  <p>No media files found in this folder.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaList
