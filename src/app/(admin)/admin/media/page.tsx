import { Suspense } from 'react'
import { LoadingUiFolder } from '~/features/admin/media/components/loading-ui-list'
import MediaLayout from '~/features/admin/media/media-layout'

const PageMedia = () => {
  return (
    <div className='w-full'>
      <Suspense fallback={<LoadingUiFolder />}>
        <MediaLayout />
      </Suspense>
    </div>
  )
}

export default PageMedia
