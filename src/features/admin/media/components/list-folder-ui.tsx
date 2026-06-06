/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Edit, Folder, FolderOpen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Label } from '~/components/ui/core/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/core/radio-group'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import { useQueryState } from 'nuqs'
import { toast } from 'react-toastify'
import AddFolder from './add-folder'
import UpdateFolder from './update-folder'
import { _mediaService } from '../media.query'
import { DEFAULT_FOLDER_MEDIA } from '~/constants'
import { LoadingUiFolder } from './loading-ui-list'

import { cn } from '~/lib/utils'

export type ListFolderUiProps = {
  className?: string
  scrollAreaClassName?: string
}

const ListFolderUi = ({ className, scrollAreaClassName }: ListFolderUiProps) => {
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string
    name: string
  } | null>(null)

  const [open, setOpen] = useState(false)

  const [folderMedia, setFolderMedia] = useQueryState('folderMedia')

  const { data: mediaFolderData, isLoading } = _mediaService.useMediaFolder()

  const { mutate: updateFolder } = _mediaService.useMediaFolderUpdate()

  const { mutate: deleteFolder } = _mediaService.useMediaFolderDelete()

  const sortedFolders = React.useMemo(() => {
    if (!mediaFolderData?.result) return []

    const folders = mediaFolderData.result

    const buildTreeList = (
      parentId: string | null,
      path: string = '',
      level: number = 0,
    ): any[] => {
      const nodes = folders.filter((f: any) => f.parentId === parentId)
      let result: any[] = []
      nodes.forEach((node: any) => {
        const currentPath = path ? `${path} / ${node.name}` : node.name
        result.push({ ...node, path: currentPath, level })
        result = result.concat(buildTreeList(node.id, currentPath, level + 1))
      })
      return result
    }

    return buildTreeList(null)
  }, [mediaFolderData])

  useEffect(() => {
    if (
      (folderMedia === undefined || folderMedia === null || folderMedia === '') &&
      sortedFolders.length > 0
    ) {
      setFolderMedia(sortedFolders[0].id)
    }
  }, [folderMedia, sortedFolders])

  const handleUpdateValue = (id: string, value: string) => {
    const payload = {
      id: id,
      name: value,
    }

    updateFolder(payload, {
      onSuccess: () => {
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id, {
      onSuccess: () => {
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
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

  const hasSubfolders = React.useMemo(() => {
    if (!selectedFolder || !mediaFolderData?.result) return false
    return mediaFolderData.result.some(
      (f: any) => f.parentId === selectedFolder.id,
    )
  }, [selectedFolder, mediaFolderData])

  return (
    <div className={cn('flex flex-col gap-4 w-full bg-muted dark:bg-muted/5 backdrop-blur-xs p-4 rounded-2xl border border-muted/80 shadow-2xs min-h-[520px] transition-all duration-300', className)}>
      <div className='flex items-center justify-between border-b border-muted/65 pb-3 mb-1 px-1'>
        <div className='flex flex-col gap-0.5'>
          <h3 className='font-semibold text-xs text-foreground uppercase tracking-wider opacity-85'>
            Thư mục
          </h3>
          <p className='text-[10px] text-muted-foreground'>Phân cấp lưu trữ</p>
        </div>
        <AddFolder />
      </div>

      <ScrollArea className={cn('h-[calc(100vh-270px)] w-full', scrollAreaClassName)}>
        {isLoading ? (
          <div className='flex flex-col gap-2'>
            <LoadingUiFolder />
          </div>
        ) : folderMedia === undefined ? (
          <div className='flex flex-col gap-2'>
            <LoadingUiFolder />
          </div>
        ) : (
          <RadioGroup
            key={folderMedia}
            className='flex flex-col gap-1 p-1 w-full'
            value={folderMedia ?? ''}
            onValueChange={handleFolderChange}
          >
            {sortedFolders.map((item: any) => {
              const isActive = folderMedia === item.id
              return (
                <Label
                  key={`${item.id}-${item.name}`}
                  htmlFor={`${item.id}-${item.name}`}
                  className={`border border-transparent hover:bg-muted/40 has-data-[state=checked]:bg-background has-data-[state=checked]:border-muted has-data-[state=checked]:shadow-2xs relative flex items-center justify-between gap-2 rounded-xl p-2 py-2.5 outline-none cursor-pointer w-full transition-all duration-200 group`}
                  style={{
                    paddingLeft:
                      item.level > 0 ? `${item.level * 16 + 28}px` : '12px',
                  }}
                >
                  {/* Glowing active indicator line */}
                  {isActive && (
                    <div className='absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)] z-10' />
                  )}

                  {/* Indentation vertical connecting lines */}
                  {item.level > 0 && (
                    <div className='absolute left-0 top-0 bottom-0 flex pointer-events-none'>
                      {Array.from({ length: item.level }).map((_, idx) => (
                        <div
                          key={idx}
                          className='w-[16px] border-r border-muted-foreground/10 h-full'
                          style={{
                            marginLeft: idx === 0 ? '14px' : '0px',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className='flex items-center gap-2.5 w-full overflow-hidden'>
                    <RadioGroupItem
                      id={`${item.id}-${item.name}`}
                      value={item.id}
                      className='sr-only'
                    />
                    {isActive ? (
                      <FolderOpen className='shrink-0 w-4 h-4 text-primary transition-transform duration-200 group-hover:scale-105' />
                    ) : (
                      <Folder className='shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:scale-105' />
                    )}
                    <div className='flex flex-col gap-0.5 overflow-hidden'>
                      <span
                        className={`text-sm truncate cursor-pointer transition-colors ${
                          isActive
                            ? 'font-semibold text-primary'
                            : 'font-medium text-foreground'
                        }`}
                        title={item.path}
                      >
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className='opacity-0 group-hover:opacity-100 transition-opacity shrink-0 z-10 relative'>
                    <button
                      type='button'
                      className='p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-muted'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedFolder(item)
                        setOpen(true)
                      }}
                    >
                      <Edit size={12} className='stroke-[2.5]' />
                    </button>
                  </div>
                </Label>
              )
            })}
          </RadioGroup>
        )}
      </ScrollArea>
      <UpdateFolder
        open={open}
        setOpen={setOpen}
        folder={selectedFolder}
        hasSubfolders={hasSubfolders}
        handleUpdateValue={handleUpdateValue}
        handleDeleteFolder={handleDeleteFolder}
      />
    </div>
  )
}

export default ListFolderUi
