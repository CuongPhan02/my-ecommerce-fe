'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useQueryState } from 'nuqs'
import { DEFAULT_FOLDER_MEDIA } from '~/constants'
import { https } from '~/config/https'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/core/dialog'

// FilePond imports
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import { UploadIcon, CheckCircle2 } from 'lucide-react'

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
)

interface MediaModalUploadProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

const maxSizeMB = 50
const maxSize = `${maxSizeMB}MB`
const maxFiles = 6

const MediaModalUploadServer = ({
  trigger,
  onSuccess,
}: MediaModalUploadProps) => {
  const [open, setOpen] = useState(false)
  const [folderMedia] = useQueryState('folderMedia')
  const [files, setFiles] = useState<any[]>([])

  const queryClient = useQueryClient()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setFiles([])
    }
  }

  // Khi người dùng bấm Xong (hoặc đóng modal)
  const handleDone = () => {
    setOpen(false)
    setFiles([])
    if (onSuccess) onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-2xl w-full h-[80vh] flex flex-col gap-0 p-0 overflow-hidden'>
        <DialogHeader className='p-6 pb-4 border-b shrink-0'>
          <DialogTitle>Tải lên phương tiện (Tự động)</DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto custom-scrollbar flex flex-col p-6'>
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={maxFiles}
            maxFileSize={maxSize}
            acceptedFileTypes={[
              'image/svg+xml',
              'image/png',
              'image/jpeg',
              'image/jpg',
              'image/gif',
              'image/webp',
              'video/mp4',
              'video/webm',
              'video/ogg',
            ]}
            name='files'
            labelIdle='Kéo & thả hình ảnh/video của bạn hoặc <span class="filepond--label-action">Duyệt qua thư mục</span>'
            labelMaxFileSizeExceeded='Tệp quá lớn'
            labelMaxFileSize={`Kích thước tệp tối đa là ${maxSize}`}
            labelFileTypeNotAllowed='Loại tệp không hợp lệ'
            fileValidateTypeLabelExpectedTypes='Yêu cầu: {allButLastType} hoặc {lastType}'
            styleLoadIndicatorPosition='center bottom'
            styleProgressIndicatorPosition='right bottom'
            // Config Server để FilePond tự upload ngay khi chọn file
            server={{
              process: (
                fieldName,
                file,
                metadata,
                load,
                error,
                progress,
                abort,
              ) => {
                const formData = new FormData()
                formData.append(fieldName, file, file.name)

                const controller = new AbortController()

                https
                  .post('/media/upload', formData, {
                    signal: controller.signal,
                    params:
                      folderMedia && folderMedia !== DEFAULT_FOLDER_MEDIA
                        ? { folderId: folderMedia }
                        : undefined,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (e: any) => {
                      progress(e.lengthComputable, e.loaded, e.total)
                    },
                  })
                  .then((res) => {
                    load(res.data?.data?.[0]?.id || Date.now().toString())
                    queryClient.invalidateQueries({
                      queryKey: ['MEDIA', 'FILE_LIST'],
                    })
                    toast.success(`Đã tải lên: ${file.name}`)
                  })
                  .catch((err) => {
                    if (err.name !== 'CanceledError') {
                      error('Upload failed')
                      toast.error(`Lỗi tải lên: ${file.name}`)
                    }
                  })

                return {
                  abort: () => {
                    controller.abort()
                    abort()
                  },
                }
              },
              revert: null, // Không hỗ trợ xóa sau khi đã up lên ở modal này
            }}
          />
        </div>

        <DialogFooter className='border-t p-6 sm:justify-between flex-row items-center shrink-0'>
          <div className='text-sm text-muted-foreground'>
            Hệ thống sẽ tự động tải lên ngay khi bạn chọn tệp
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleDone}>
              Hoàn tất
              <CheckCircle2 className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MediaModalUploadServer

MediaModalUploadServer.displayName = 'MediaModalUploadServer'
