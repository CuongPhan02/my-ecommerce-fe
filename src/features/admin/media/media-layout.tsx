'use client'
import { ListFolderUi, MediaList } from './components'

const MediaLayout = () => {
  return (
    <div className='flex flex-col md:flex-row gap-6 mt-4 bg-card/65 backdrop-blur-xs p-5 md:p-6 rounded-2xl border border-muted shadow-xs transition-all duration-300'>
      <div className='w-full md:w-64 lg:w-72 shrink-0'>
        <ListFolderUi />
      </div>
      <div className='flex-1 min-w-0'>
        <MediaList />
      </div>
    </div>
  )
}

export default MediaLayout
