import React from 'react'
import { cn } from '~/lib/utils'

const LogoUi = ({ className }: { className?: string }) => {
  return (
    <h1
      className={cn(
        'font-extrabold text-xl sm:text-3xl text-primary-color whitespace-nowrap',
        className
      )}
    >
      AKR-SHOP
    </h1>
  )
}

export default LogoUi
