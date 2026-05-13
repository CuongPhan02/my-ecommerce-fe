'use client'
import Image from 'next/image'
import { cn } from '~/lib/utils'
import { useTransitionRouter } from 'next-view-transitions'

const LogoUi = ({ className }: { className?: string }) => {
  const router = useTransitionRouter()
  return (
    <div
      onClick={() => router.push('/')}
      className={cn(
        'font-extrabold text-xl sm:text-3xl text-primary-color whitespace-nowrap  flex items-center gap-2 cursor-pointer',
        className,
      )}
    >
      <Image
        src={'/logo-app.png'}
        alt='Logo'
        width={200}
        height={200}
        className='max-w-12 h-auto object-cover'
      />
      AKR-SHOP
    </div>
  )
}

export default LogoUi
