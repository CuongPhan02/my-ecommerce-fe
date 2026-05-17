import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { Textarea } from '~/components/ui/core/textarea'
import { Review } from '../types'
import { Star, Send, User } from 'lucide-react'
import { format } from 'date-fns'
import { _reviewService } from '../review.query'
import { Badge } from '~/components/ui/core/badge'

interface ReviewDetailDialogProps {
  review: Review
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ReviewDetailDialog = ({ review, open, onOpenChange }: ReviewDetailDialogProps) => {
  const [replyContent, setReplyContent] = useState('')
  const replyMutation = _reviewService.useReplyToReview()

  const handleReply = async () => {
    if (!replyContent.trim()) return
    await replyMutation.mutateAsync({ id: review.id, content: replyContent })
    setReplyContent('')
    // onOpenChange(false) // Keep open to show the new reply if needed, or close
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] rounded-3xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>Chi tiết đánh giá</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-6 py-4'>
          {/* Product Info */}
          <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-2xl'>
            <img
              src={review.productThumbnail}
              alt={review.productTitle}
              className='h-16 w-16 rounded-xl object-cover'
            />
            <div className='flex flex-col'>
              <span className='text-xs text-muted-foreground uppercase font-bold tracking-tight'>Sản phẩm</span>
              <span className='font-bold text-sm line-clamp-1'>{review.productTitle}</span>
            </div>
          </div>

          {/* User Review */}
          <div className='flex gap-4'>
             <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                <User size={20} className='text-primary' />
             </div>
             <div className='flex flex-col gap-2 flex-1'>
                <div className='flex items-center justify-between'>
                   <div className='flex flex-col'>
                      <span className='font-bold text-sm'>{review.userName}</span>
                      <span className='text-[10px] text-muted-foreground uppercase font-medium'>
                        {format(new Date(review.createdAt), 'dd MMMM, yyyy HH:mm')}
                      </span>
                   </div>
                   <div className='flex gap-0.5'>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                        />
                      ))}
                   </div>
                </div>

                {review.size && (
                   <div className='flex gap-3 text-[10px] font-bold text-muted-foreground uppercase'>
                      <span>Size: <span className='text-black'>{review.size}</span></span>
                      <span>Màu: <span className='text-black'>{review.color}</span></span>
                   </div>
                )}

                <p className='text-sm text-gray-700 bg-gray-50 p-4 rounded-2xl leading-relaxed'>
                   {review.comment}
                </p>

                {review.tags && review.tags.length > 0 && (
                   <div className='flex flex-wrap gap-2 mt-1'>
                      {review.tags.map(tag => (
                         <Badge key={tag} variant='secondary' className='text-[10px] font-bold px-2 py-0.5 rounded-full'>
                            {tag}
                         </Badge>
                      ))}
                   </div>
                )}
             </div>
          </div>

          {/* Existing Replies */}
          {review.replies && review.replies.length > 0 && (
            <div className='flex flex-col gap-4 pl-14 mt-2'>
              <p className='text-xs font-black uppercase text-muted-foreground tracking-widest'>Phản hồi của bạn</p>
              {review.replies.map((reply) => (
                <div key={reply.id} className='bg-primary/5 p-4 rounded-2xl border border-primary/10'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='font-bold text-xs text-primary'>{reply.adminName} (Quản trị viên)</span>
                    <span className='text-[10px] text-muted-foreground font-medium'>
                       {format(new Date(reply.createdAt), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <p className='text-sm text-gray-700 leading-relaxed'>{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          <div className='flex flex-col gap-3 mt-4'>
            <p className='text-xs font-black uppercase text-muted-foreground tracking-widest'>Viết phản hồi</p>
            <Textarea
              placeholder='Nhập nội dung phản hồi...'
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className='rounded-2xl min-h-[100px] border-gray-200 focus:border-primary transition-all text-sm'
            />
          </div>
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={() => onOpenChange(false)} className='rounded-2xl'>
            Đóng
          </Button>
          <Button
            onClick={handleReply}
            disabled={!replyContent.trim() || replyMutation.isPending}
            className='rounded-2xl gap-2 px-6'
          >
            <Send size={16} />
            {replyMutation.isPending ? 'Đang gửi...' : 'Gửi phản hồi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewDetailDialog
