import React from 'react'
import UserTable from '~/features/admin/user/components/user-table'

export const metadata = {
  title: 'Quản lý người dùng | Admin',
}

const UserPage = () => {
  return (
    <div className='p-6'>
      <UserTable />
    </div>
  )
}

export default UserPage
