'use client'
import { CheckIcon, FileText, Film, XIcon } from 'lucide-react'
import { AspectRatio } from '~/components/ui/core/aspect-ratio'
import { Button } from '~/components/ui/core/button'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Progress } from '~/components/ui/core/progress'
import { DisplayItem } from '../types'

export type MediaGridProps = {
  items: DisplayItem[]
  selectedIds: string[]
  uploadProgress: Record<string, number>
  onSelect: (id: string, item: DisplayItem) => void
  onRemove: (id: string, isClientId: boolean) => void
  selectableMode?: boolean
}

export const MediaGrid = ({
  items,
  selectedIds,
  uploadProgress,
  onSelect,
  onRemove,
  selectableMode = false,
}: MediaGridProps) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-5 mt-2'>
      {items.map((item, index) => {
        const isSelected = selectedIds.includes(item.id as string)

        const handleGridItemClick = () => {
          if (selectableMode) {
            onSelect(item.id as string, item)
          }
        }

        return (
          <div key={index}>
            <AspectRatio
              ratio={1}
              className={`bg-accent relative rounded-md mb-5 ${
                selectableMode
                  ? 'cursor-pointer hover:opacity-80 transition-opacity'
                  : ''
              } ${selectableMode && isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              onClick={handleGridItemClick}
            >
              {!selectableMode && (
                <div
                  className='absolute z-10 -top-2 right-0 p-1 rounded-md flex items-center gap-3 bg-white shadow-2xl border'
                  onClick={(e) => e.stopPropagation()}
                >
                  {!item.clientId ? (
                    <label className='border-gray-800 bg-gray-200 text-gray-700 has-data-[state=checked]:border-primary-color has-data-[state=checked]:bg-primary has-data-[state=checked]:text-white has-focus-visible:border-ring has-focus-visible:ring-ring/50 flex size-5 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50'>
                      <Checkbox
                        className='sr-only after:absolute after:inset-0'
                        checked={isSelected}
                        onCheckedChange={() =>
                          onSelect(item.id as string, item)
                        }
                      />
                      <span aria-hidden='true' className='text-sm font-medium'>
                        <CheckIcon className='size-3' />
                      </span>
                    </label>
                  ) : (
                    ''
                  )}
                  <Button
                    onClick={() => {
                      if (item.clientId) {
                        onRemove(item.clientId, true)
                      } else {
                        onRemove(item.id as string, false)
                      }
                    }}
                    size='icon'
                    className='focus-visible:border-background size-6 rounded-full border-2 shadow-none'
                    aria-label='Remove media'
                  >
                    <XIcon className='size-3.5' />
                  </Button>
                </div>
              )}

              {item.mediaType === 'IMAGE' ? (
                <img
                  src={item.preview || item.url || ''}
                  alt={item.altText || item.fileId}
                  className='size-full rounded-[inherit] object-cover'
                />
              ) : item.mediaType === 'VIDEO' ? (
                <div className='size-full rounded-[inherit] object-cover flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 break-all text-center p-2'>
                  <Film className='size-10 text-gray-500 mb-1' />
                  <span
                    className='text-[10px] text-gray-500 font-medium line-clamp-2'
                    title={item.altText || item.fileId}
                  >
                    {item.altText || item.fileId}
                  </span>
                </div>
              ) : item.mediaType === 'DOCUMENT' ? (
                <div className='size-full rounded-[inherit] object-cover flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 break-all text-center p-2'>
                  <FileText className='size-10 text-blue-500 mb-1' />
                  <span
                    className='text-[10px] text-gray-500 font-medium line-clamp-2'
                    title={item.altText || item.fileId}
                  >
                    {item.altText || item.fileId}
                  </span>
                </div>
              ) : (
                <img
                  src={item.preview || item.url || ''}
                  alt={item.altText || item.fileId}
                  className='size-full rounded-[inherit] object-cover'
                />
              )}

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
  )
}
