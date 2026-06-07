'use client'
import { cn } from '~/lib/utils'
import { useTransitionRouter } from 'next-view-transitions'
import Image from 'next/image'

const LogoUi = ({
  className,
  logoUrl,
  logoAlt,
  onClick,
}: {
  className?: string
  logoUrl?: string | null
  logoAlt?: string | null
  onClick?: () => void
}) => {
  const router = useTransitionRouter()

  // Format brand name to spaced out serif text (e.g. L U N É)
  const isLune =
    !logoAlt ||
    logoAlt.toUpperCase().replace(/\s/g, '') === 'LUNE' ||
    logoAlt === 'L U N É'
  const displayText = isLune ? 'L U N É' : logoAlt

  const handleLogoClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push('/')
    }
  }

  return (
    <div
      onClick={handleLogoClick}
      className={cn(
        'whitespace-nowrap flex items-center gap-2 cursor-pointer select-none transition-opacity hover:opacity-85',
        className,
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={logoAlt || 'Logo'}
          width={150}
          height={50}
          className='max-h-20 w-auto object-contain'
        />
      ) : (
        <span className='font-heading tracking-[0.25em] text-2xl font-bold text-[#231f20]'>
          {displayText}
        </span>
      )}
    </div>
  )
}

export default LogoUi
