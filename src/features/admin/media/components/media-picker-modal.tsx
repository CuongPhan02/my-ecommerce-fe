'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { MediaGrid } from './media-grid'
import { _mediaService } from '../media.query'
import { useQueryState } from 'nuqs'
import { DEFAULT_FOLDER_MEDIA } from '~/constants'
import ListFolderUi from './list-folder-ui'
import Pagination from '~/components/shared/pagination-ui'
import { LoadingUiMediaList } from './loading-ui-list'
import { DisplayItem, MediaItem } from '../types'

export type MediaPickerModalProps = {
  onSelect: (items: MediaItem[]) => void
  trigger?: React.ReactNode
}

export const MediaPickerModal = ({
  onSelect,
  trigger,
}: MediaPickerModalProps) => {
  const [open, setOpen] = useState(false)
  const [folderMedia] = useQueryState('folderMedia')
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([])

  const [page] = useQueryState('page')

  const { data: mediaList, isLoading } = _mediaService.useMediaFileList({
    folderId:
      folderMedia && folderMedia !== DEFAULT_FOLDER_MEDIA ? folderMedia : '',
    page: Number(page) || 1,
  })

  const metadata = {
    total: mediaList?.result.total as number,
    page: mediaList?.result.page as number,
    limit: mediaList?.result.limit as number,
    totalPages: mediaList?.result.totalPages as number,
  }

  const handleSelect = (id: string, item: DisplayItem) => {
    const originalItem = mediaList?.result.items.find((x: any) => x.id === id)
    if (!originalItem) return

    setSelectedItems((prev) => {
      const isExists = prev.some((x) => x.id === id)
      if (isExists) {
        return prev.filter((x) => x.id !== id)
      }
      return [...prev, originalItem as MediaItem]
    })
  }

  const handleConfirm = () => {
    onSelect(selectedItems)
    setOpen(false)
    setSelectedItems([])
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSelectedItems([])
    }
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[1500px] w-full h-[90vh] flex flex-col gap-0 p-0 overflow-hidden'>
        <DialogHeader className='p-6 pb-4 border-b shrink-0'>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-0 p-6'>
          <ListFolderUi />

          <div className='flex-1 my-4'>
            {isLoading ? (
              <LoadingUiMediaList count={10} />
            ) : (
              <MediaGrid
                items={displayItems}
                selectedIds={selectedItems.map((x) => x.id)}
                uploadProgress={{}}
                onSelect={handleSelect}
                onRemove={() => {}}
                selectableMode={true}
              />
            )}
          </div>

          {!isLoading && displayItems.length > 0 && (
            <div className='mt-2 pb-12 relative h-12 shrink-0'>
              <Pagination
                meta={metadata}
                variant='numbers'
                className='justify-center absolute bottom-0 left-1/2 -translate-x-1/2 bg-accent p-2 rounded-md w-full'
              />
            </div>
          )}
        </div>

        <DialogFooter className='border-t p-6 sm:justify-between flex-row items-center shrink-0'>
          <div className='text-sm text-muted-foreground'>
            {selectedItems.length} items selected
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
            >
              Confirm Selection
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
