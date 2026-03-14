'use client'
import Image from 'next/image'
import { cn } from '~/lib/utils'
import { useRouter } from 'next/navigation'

const LogoUi = ({ className }: { className?: string }) => {
  const router = useRouter()
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
        className='w-14 h-14 object-cover'
      />
      AKR-SHOP
    </div>
  )
}

export default LogoUi
