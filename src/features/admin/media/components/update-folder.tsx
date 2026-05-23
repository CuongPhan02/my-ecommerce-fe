'use client'

import { Edit2, FolderClosed, FolderEdit, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '~/components/ui/core/input-group'
import {
  minLength,
  required,
  useFormValidation,
} from '~/hooks/use-form-validation'

interface UpdateFolderProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  folder?: { id: string; name: string } | null
  hasSubfolders?: boolean
  handleUpdateValue: (id: string, value: string) => void
  handleDeleteFolder: (id: string) => void
}

const UpdateFolder = ({
  open,
  setOpen,
  folder,
  hasSubfolders,
  handleUpdateValue,
  handleDeleteFolder,
}: UpdateFolderProps) => {
  const { values, errors, handleChange, setValues, validateForm } =
    useFormValidation(
      {
        name: '',
      },
      {
        name: [required('Tên thư mục là bắt buộc'), minLength(3)],
      }
    )

  useEffect(() => {
    if (folder) {
      setValues({ name: folder.name })
    }
  }, [folder, setValues])

  const [confirmDelete, setConfirmDelete] = React.useState(false)

  // Reset confirm state when modal closes
  useEffect(() => {
    if (!open) {
      setConfirmDelete(false)
    }
  }, [open])

  const hanleSubmit = async () => {
    if (!validateForm() || !folder) return
    handleUpdateValue(folder.id, values.name)
    setOpen(false)
  }

  const handleDelete = () => {
    if (!validateForm() || !folder) return
    handleDeleteFolder(folder.id)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[440px] p-6 overflow-hidden rounded-2xl border border-muted bg-card shadow-2xl">
        {!confirmDelete ? (
          <>
            <div className='flex flex-col items-center gap-3 text-center mb-6'>
              <div
                className='flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-xs'
                aria-hidden='true'
              >
                <FolderEdit className="w-6 h-6" />
              </div>
              <DialogHeader>
                <DialogTitle className='sm:text-center text-base font-bold tracking-tight'>
                  Cập nhật thư mục
                </DialogTitle>
                <p className="text-xs text-muted-foreground">Thay đổi tên thư mục hiện tại</p>
              </DialogHeader>
            </div>

            <div className='space-y-4 mb-6'>
              <div className='relative'>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tên thư mục</label>
                <InputGroup className="shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 rounded-lg overflow-hidden">
                  <InputGroupInput
                    placeholder='Nhập tên thư mục...'
                    type='text'
                    value={values.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="h-10 text-sm font-medium"
                  />
                  <InputGroupAddon className="bg-muted/30 border-l border-muted">
                    <FolderClosed className="w-4 h-4 text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                {errors.name && (
                  <p className='text-red-500 text-xs mt-1.5 font-medium'>{errors.name}</p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3 justify-end border-t border-muted pt-4'>
              <Button onClick={() => setOpen(false)} variant='outline' className="h-9 text-xs transition-all">
                Hủy bỏ
              </Button>
              <Button onClick={hanleSubmit} variant='default' className="h-9 text-xs gap-1.5 transition-all">
                Cập nhật
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant='destructive' onClick={() => setConfirmDelete(true)} className="h-9 text-xs gap-1.5 transition-all ml-auto">
                Xóa thư mục
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className='flex flex-col items-center gap-3 text-center mb-6'>
              <div
                className={`flex size-14 items-center justify-center rounded-full border shadow-xs ${
                  hasSubfolders
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                }`}
                aria-hidden='true'
              >
                <Trash2 className="w-6 h-6" />
              </div>
              <DialogHeader>
                <DialogTitle className='sm:text-center text-base font-bold tracking-tight text-foreground'>
                  {hasSubfolders ? 'Không thể xóa thư mục' : 'Xác nhận xóa thư mục'}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">Hành động này có tính chất quan trọng</p>
              </DialogHeader>
            </div>

            {/* Premium warning alert callout card */}
            <div className={`p-4 rounded-xl border-l-4 mb-6 text-sm leading-relaxed shadow-2xs ${
              hasSubfolders 
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 text-amber-900 dark:text-amber-200' 
                : 'bg-red-50 dark:bg-red-950/10 border-red-500 text-red-900 dark:text-red-200'
            }`}>
              {hasSubfolders ? (
                <div className="space-y-1">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">Thư mục có chứa thư mục con</p>
                  <p className="text-xs opacity-90 leading-normal">
                    Thư mục <strong className="underline">{folder?.name}</strong> hiện đang chứa thư mục con. Vui lòng di chuyển hoặc xóa tất cả thư mục con trước khi xóa thư mục này.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-semibold text-red-800 dark:text-red-300">Cảnh báo: Hành động không thể khôi phục</p>
                  <p className="text-xs opacity-90 leading-normal">
                    Bạn có chắc chắn muốn xóa thư mục <strong className="underline">{folder?.name}</strong> không? Sau khi xóa, tất cả tệp phương tiện thuộc thư mục này sẽ bị ảnh hưởng.
                  </p>
                </div>
              )}
            </div>

            <div className='flex items-center gap-3 justify-end border-t border-muted pt-4'>
              <Button onClick={() => setConfirmDelete(false)} variant='outline' className="h-9 text-xs transition-all">
                Quay lại
              </Button>
              {!hasSubfolders && (
                <Button variant='destructive' onClick={handleDelete} className="h-9 text-xs gap-1.5 transition-all">
                  Tôi chắc chắn, xóa thư mục
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>

  )
}

export default UpdateFolder
