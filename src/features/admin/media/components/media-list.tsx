'use client'
import { Trash, FileImage, UploadCloud } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '~/components/ui/core/button'
import { _mediaService } from '../media.query'
import { DisplayItem } from '../types'
import Pagination from '~/components/shared/pagination-ui'
import { LoadingUiMediaList } from './loading-ui-list'
import { MediaGrid } from './media-grid'
import MediaModalUploadServer from './media-modal-upload-server'
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
    setLoading(true)
    deleteFileSingle(id, {
      onSuccess: () => {
        toast.success("Xóa tệp tin thành công!")
        if (!isLoading) {
          refetch()
        }
      },
      onError: (err) => {
        console.error(err)
        toast.error("Không thể xóa tệp tin!")
      },
      onSettled: () => {
        setLoading(false)
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
      size: u.size,
    }),
  )

  return (
    <div className='flex flex-col gap-2 mt-1'>
      <div className='w-full'>
        <div className='flex w-full flex-col gap-3'>
          <div className='flex items-center justify-between border-b border-muted pb-4 mb-2 gap-4 flex-wrap'>
            <div className='flex flex-col gap-0.5'>
              <h1 className='text-base font-bold tracking-tight text-foreground'>
                Thư viện phương tiện
              </h1>
              <p className='text-xs text-muted-foreground'>
                Hiển thị {displayItems.length} tệp tin trong thư mục
              </p>
            </div>

            <div className='flex items-center gap-2 flex-wrap'>
              <Button 
                variant='outline'
                size='sm'
                onClick={handleClearAll} 
                disabled={!isSelectMedia}
                className='h-8 text-xs font-medium transition-all duration-200'
              >
                Bỏ chọn ({selectMedia.length})
              </Button>
              <Button
                size='sm'
                disabled={!isSelectMedia}
                onClick={handleDeleteFileMutiple}
                variant='destructive'
                className='h-8 text-xs gap-1.5 font-medium transition-all duration-200'
              >
                Xóa {selectMedia.length} tệp
                <Trash className='w-3.5 h-3.5' />
              </Button>

              <MediaModalUploadServer
                onSuccess={() => refetch()}
                trigger={
                  <Button size='sm' className='h-8 text-xs font-semibold gap-1.5 transition-all duration-200'>
                    Thêm tệp
                  </Button>
                }
              />
            </div>
          </div>

          {/* Display Media List */}
          {displayItems.length > 0 ? (
            <div className='my-2'>
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
                <div className='flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-2xl py-20 px-4 text-center max-w-lg mx-auto w-full my-6 bg-card/50 backdrop-blur-xs shadow-xs'>
                  <div className='flex size-14 items-center justify-center rounded-full bg-primary/5 text-primary mb-4 ring-8 ring-primary/2.5'>
                    <FileImage className='w-6 h-6' />
                  </div>
                  <h3 className='font-semibold text-base text-foreground tracking-tight mb-1'>
                    Thư mục chưa có tệp
                  </h3>
                  <p className='text-xs text-muted-foreground max-w-[280px] mb-5 leading-normal'>
                    Hiện chưa có hình ảnh, video hay tài liệu nào trong thư mục này.
                  </p>
                  <MediaModalUploadServer
                    onSuccess={() => refetch()}
                    trigger={
                      <Button size='sm' variant='outline' className='h-9 text-xs gap-1.5 font-medium border-dashed border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200'>
                        <UploadCloud className='w-4 h-4' />
                        Tải tệp đầu tiên lên
                      </Button>
                    }
                  />
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
