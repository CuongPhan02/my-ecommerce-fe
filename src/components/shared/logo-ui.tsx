'use client'
import Image from 'next/image'
import { cn } from '~/lib/utils'
import { useTransitionRouter } from 'next-view-transitions'

const LogoUi = ({ className, logoUrl, logoAlt }: { className?: string; logoUrl?: string | null; logoAlt?: string | null }) => {
  const router = useTransitionRouter()
  return (
    <div
      onClick={() => router.push('/')}
      className={cn(
        'font-extrabold text-xl sm:text-3xl text-primary whitespace-nowrap  flex items-center gap-2 cursor-pointer',
        className,
      )}
    >
      <Image
        src={logoUrl || '/logo-app.png'}
        alt={logoAlt || 'Logo'}
        width={200}
        height={200}
        className='max-w-12 h-auto object-cover'
      />
      {logoAlt || 'AKR-SHOP'}
    </div>
  )
}

export default LogoUi
