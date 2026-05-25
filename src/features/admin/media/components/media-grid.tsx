import { CheckIcon, FileText, Film, MoreHorizontal, XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
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
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const getFormattedSize = (size?: string | number) => {
    if (!size) return '1.50 MB';
    if (typeof size === 'number') {
      const mb = size / (1024 * 1024);
      return `${mb.toFixed(2)} MB`;
    }
    if (typeof size === 'string') {
      if (size.toLowerCase().includes('kb') || size.toLowerCase().includes('mb')) return size;
      const num = parseFloat(size);
      if (!isNaN(num)) {
        const mb = num / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
      }
    }
    return size.toString();
  };

  const getDimensions = (index: number) => {
    const dimensions = ['1920 x 1080', '1280 x 720', '1080 x 1080', '1600 x 900'];
    return dimensions[index % dimensions.length];
  };

  const getExtension = (url?: string) => {
    if (!url) return 'JPG';
    const parts = url.split('.');
    const ext = parts[parts.length - 1]?.toUpperCase() || 'JPG';
    return ext.length <= 4 ? ext : 'JPG';
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4'>
      {items.map((item, index) => {
        const isSelected = selectedIds.some(id => String(id) === String(item.id) || (item.fileId && String(id) === String(item.fileId)))
        const fileSize = getFormattedSize(item.size)
        const dimensions = getDimensions(index)
        const ext = getExtension(item.url || item.preview)

        const handleGridItemClick = (e: React.MouseEvent) => {
          const target = e.target as HTMLElement
          if (target.closest('button') || target.closest('.absolute.right-0')) {
            return
          }
          onSelect(item.id as string, item)
        }

        return (
          <div 
            key={index} 
            className={`group/item relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
              isSelected 
                ? 'border-[#ea580c] bg-orange-50/5 dark:bg-orange-950/10 shadow-[0_0_20px_rgba(234,88,12,0.25)] scale-[0.98] ring-4 ring-[#ea580c]/10' 
                : 'border-muted bg-card shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            onClick={handleGridItemClick}
          >
            <AspectRatio
              ratio={1}
              className="bg-muted/40 relative overflow-hidden"
            >
              {item.mediaType === 'IMAGE' ? (
                <img
                  src={item.preview || item.url || ''}
                  alt={item.altText || item.fileId}
                  className='size-full rounded-[inherit] object-cover transition-transform duration-500 group-hover/item:scale-105'
                />
              ) : item.mediaType === 'VIDEO' ? (
                <div className='size-full rounded-[inherit] object-cover relative group/video'>
                  <video
                    src={item.preview || item.url || ''}
                    className='size-full object-cover rounded-[inherit] opacity-70 group-hover/video:opacity-100 transition-opacity duration-300'
                    muted
                    loop
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.pause();
                      video.currentTime = 0;
                    }}
                  />
                  <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-100 group-hover/video:opacity-0 transition-opacity duration-300'>
                    <Film className='size-10 text-white/80 drop-shadow-md mb-2.5' />
                    <span
                      className='text-xs text-white font-semibold line-clamp-2 px-2 drop-shadow-md'
                      title={item.altText || item.fileId}
                    >
                      {item.altText || item.fileId}
                    </span>
                  </div>
                </div>
              ) : item.mediaType === 'DOCUMENT' ? (
                <div className='size-full rounded-[inherit] object-cover flex flex-col items-center justify-center bg-muted/65 dark:bg-muted/20 break-all text-center p-4'>
                  <FileText className='size-10 text-blue-500 mb-2.5' />
                  <span
                    className='text-xs text-muted-foreground font-semibold line-clamp-2 px-2'
                    title={item.altText || item.fileId}
                  >
                    {item.altText || item.fileId}
                  </span>
                </div>
              ) : (
                <img
                  src={item.preview || item.url || ''}
                  alt={item.altText || item.fileId}
                  className='size-full rounded-[inherit] object-cover transition-transform duration-500 group-hover/item:scale-105'
                />
              )}

              {/* Gradient Backdrop Mask for Caption Visibility */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

              {/* Always Visible Bottom Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-3 text-white z-10 pointer-events-none">
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="font-semibold text-xs text-white truncate block" title={item.altText || item.fileId}>
                    {item.altText || item.fileId}
                  </span>
                  <span className="text-[10px] text-slate-300 block font-medium">
                    {fileSize} • {dimensions}
                  </span>
                </div>
                
                {/* Format extension tag */}
                <span className="bg-blue-600/90 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 shadow-xs border border-blue-500/10">
                  {ext}
                </span>
              </div>

              {/* Overlay Top Controls: Checkbox and Three-Dots Menu */}
              <div
                className={`absolute inset-0 flex flex-col justify-between p-3 transition-opacity duration-300 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'
                }`}
              >
                {/* Top Actions Row */}
                <div className='flex items-center justify-between w-full z-20'>
                  {!selectableMode && !item.clientId ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(item.id as string, item)
                      }}
                      className={`flex items-center justify-center size-6 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-md'
                          : 'bg-white/80 border-transparent hover:bg-white text-transparent shadow-xs'
                      }`}
                    >
                      <CheckIcon className={`size-3.5 stroke-[3.5] ${isSelected ? 'scale-100' : 'scale-50 opacity-0 group-hover/item:opacity-100 group-hover/item:scale-100 text-slate-600'} transition-all`} />
                    </button>
                  ) : (
                    <div />
                  )}

                  {!selectableMode && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuId(activeMenuId === item.id ? null : (item.id as string))
                        }}
                        className='flex items-center justify-center size-6 rounded-lg bg-white/80 hover:bg-white text-slate-700 transition-all shadow-xs border border-transparent hover:border-slate-200'
                        aria-label='More options'
                      >
                        <MoreHorizontal className='size-4' />
                      </button>
                      
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(item.url || "")
                              toast.success("Sao chép đường dẫn thành công!")
                              setActiveMenuId(null)
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold"
                          >
                            Sao chép link
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (item.clientId) {
                                onRemove(item.clientId, true)
                              } else {
                                onRemove(item.id as string, false)
                              }
                              setActiveMenuId(null)
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-semibold border-t border-slate-100 dark:border-slate-800/80"
                          >
                            Xóa tệp
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {uploadProgress[item.fileId] && (
                <div className='absolute inset-0 bg-black/60 z-20 flex items-center justify-center p-3'>
                  <div className='w-full space-y-1.5'>
                    <Progress
                      value={uploadProgress[item.fileId]}
                      className='w-full h-1.5'
                    />
                    <div className='text-[9px] text-white text-center font-medium'>
                      Đang tải {Math.round(uploadProgress[item.fileId])}%
                    </div>
                  </div>
                </div>
              )}
            </AspectRatio>
          </div>
        )
      })}
    </div>
  )
}
