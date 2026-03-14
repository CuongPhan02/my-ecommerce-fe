import { Suspense } from 'react'
import ListFolderUi from '~/features/admin/media/components/list-folder-ui'
import { LoadingUiFolder } from '~/features/admin/media/components/loading-ui-list'
import MediaList from '~/features/admin/media/components/media-list'

const PageMedia = () => {
  return (
    <div className='w-full'>
      <Suspense fallback={<LoadingUiFolder />}>
        <ListFolderUi />
        <MediaList />
      </Suspense>
    </div>
  )
}

export default PageMedia
