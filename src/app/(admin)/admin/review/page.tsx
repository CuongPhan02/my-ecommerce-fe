import React from 'react'
import ReviewTable from '~/features/admin/review/components/review-table'

export const metadata = {
  title: 'Quản lý bình luận & đánh giá | Admin',
}

const ReviewPage = () => {
  return (
    <div className='p-6'>
      <ReviewTable />
    </div>
  )
}

export default ReviewPage
