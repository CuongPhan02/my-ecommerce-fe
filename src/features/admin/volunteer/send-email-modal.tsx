import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Mail, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { _volunteerService } from './volunteer.query'

interface SendEmailModalProps {
  isOpen: boolean
  onClose: () => void
  selectedIds: string[]
}

interface EmailFormInput {
  subject: string
  title: string
  message: string
}

export const SendEmailModal = ({
  isOpen,
  onClose,
  selectedIds,
}: SendEmailModalProps) => {
  const sendEmailMutation = _volunteerService.useSendEmail()
  const isSelected = selectedIds.length > 0

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailFormInput>({
    defaultValues: {
      subject: '',
      title: '',
      message: '',
    },
  })

  const onSubmit = (data: EmailFormInput) => {
    sendEmailMutation.mutate(
      {
        volunteerIds: isSelected ? selectedIds : undefined,
        ...data,
      },
      {
        onSuccess: (res) => {
          toast.success(res.result?.message || 'Đã gửi email thành công!')
          reset()
          onClose()
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi email.')
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-8 max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='flex flex-col items-center justify-center text-center gap-4'>
          <div className='w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary'>
            <Mail className='w-8 h-8' />
          </div>
          <div className='space-y-2 w-full'>
            <DialogTitle className='text-xl font-black uppercase tracking-tight'>
              Gửi Email Tình Nguyện Viên
            </DialogTitle>
            <DialogDescription className='text-sm font-medium text-gray-500 leading-relaxed'>
              {isSelected ? (
                <>Gửi thông báo đến <strong className="text-black">{selectedIds.length}</strong> tình nguyện viên đã chọn.</>
              ) : (
                <>Gửi thông báo đến <strong className="text-black">tất cả</strong> tình nguyện viên trong hệ thống.</>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
          <div className='space-y-1.5'>
            <label className='text-[10px] font-black uppercase tracking-widest text-neutral-600 block'>
              Tiêu đề Email (Subject)
            </label>
            <Input
              id='subject'
              placeholder='Nhập tiêu đề gửi đi (Ví dụ: [LUNÉ] Thông báo chiến dịch mới)'
              {...register('subject', { required: 'Tiêu đề không được để trống' })}
              errorMessage={errors.subject?.message}
              className='rounded-xl border-neutral-200 bg-white font-medium text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-[10px] font-black uppercase tracking-widest text-neutral-600 block'>
              Tựa đề trong nội dung (Title)
            </label>
            <Input
              id='title'
              placeholder='Nhập tựa đề bài viết trong mail (Ví dụ: Chiến Dịch Hỗ Trợ Trẻ Em Vùng Cao)'
              {...register('title', { required: 'Tựa đề nội dung không được để trống' })}
              errorMessage={errors.title?.message}
              className='rounded-xl border-neutral-200 bg-white font-medium text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-[10px] font-black uppercase tracking-widest text-neutral-600 block'>
              Nội dung chi tiết (Message)
            </label>
            <textarea
              id='message'
              placeholder='Nhập nội dung thư gửi đi... (Có thể xuống dòng)'
              rows={6}
              {...register('message', { required: 'Nội dung thư không được để trống' })}
              className='w-full border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-brand transition-colors rounded-xl resize-none'
            />
            {errors.message && (
              <p className='text-xs text-red-500 font-bold mt-1'>{errors.message.message}</p>
            )}
          </div>

          <DialogFooter className='flex flex-col sm:flex-row gap-3 pt-6 w-full'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={sendEmailMutation.isPending}
              className='flex-1 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-gray-100 hover:bg-gray-50'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={sendEmailMutation.isPending}
              className='flex-1 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg bg-black hover:bg-primary text-white'
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin mr-2 inline' />
                  Đang gửi...
                </>
              ) : (
                'Gửi Email'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
