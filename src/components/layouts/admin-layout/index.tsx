import React from 'react'

import { MainContent } from './main-content'
import { Header } from './header/header'
import { SearchBar } from './header/search-bar'
import ThemeToggle from './header/theme-toggle'
import { ProfileDropdown } from './header/profile-dropdown'

const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    // overflow-hidden
    <div className='w-full p-2'>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'></div>{' '}
        <SearchBar />
        <ThemeToggle />
        <ProfileDropdown />
      </Header>
      <MainContent fixed className='min-h-screen'>
        {children}
      </MainContent>
    </div>
  )
}

export default LayoutAdmin
