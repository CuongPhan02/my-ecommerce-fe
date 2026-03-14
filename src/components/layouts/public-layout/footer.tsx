'use client'
import Link from 'next/link'
import { ArrowUp, Copy } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className='flex flex-col w-full'>
      <footer className='w-full bg-black text-white pt-20 border-t border-neutral-800 overflow-hidden flex flex-col'>
        <div className='container-layout flex-1 lg:mb-8'>
          {/* Massive Brand Title - Taking up full width */}
          <div className='w-full mb-20 2xl:mb-30'>
            <h1 className='text-[24vw] xl:text-[24vw] 3xl:text-[26vw] leading-[0.8] font-bold text-center uppercase whitespace-nowrap select-none text-primary'>
              AKR-SHOP
            </h1>
          </div>

          {/* Info Grid - Matching Reference Layout */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 lg:mb-32 text-lg  lg:text-sm text-neutral-400 font-medium'>
            {/* Col 1: Contact Info (Left) - Span 3 */}
            <div className='md:col-span-3 flex flex-col gap-2'>
              <div
                className='flex items-center gap-2 group cursor-pointer w-fit'
                onClick={() => copyToClipboard('hello@stubbleandco.com')}
              >
                <span className='hover:text-white transition-colors'>
                  hello@stubbleandco.com
                </span>
                <Copy className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
              <div
                className='flex items-center gap-2 group cursor-pointer w-fit'
                onClick={() => copyToClipboard('+44 20 7144 6699')}
              >
                <span className='hover:text-white transition-colors'>
                  +44 20 7144 6699
                </span>
                <Copy className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
            </div>

            {/* Col 2: Shop Categories (Center-Left) - Span 3 */}
            <div className='md:col-span-3'>
              <p className='text-xs uppercase tracking-widest text-neutral-300 mb-4'>
                Shop
              </p>
              <div className='flex flex-col gap-1'>
                <Link
                  href='/shop/men'
                  className='hover:text-white transition-colors'
                >
                  Men
                </Link>
                <Link
                  href='/shop/women'
                  className='hover:text-white transition-colors'
                >
                  Women
                </Link>
                <Link
                  href='/shop/accessories'
                  className='hover:text-white transition-colors'
                >
                  Accessories
                </Link>
                <Link
                  href='/shop/new-arrivals'
                  className='hover:text-white transition-colors'
                >
                  New Arrivals
                </Link>
              </div>
            </div>

            {/* Col 3: Spacer/Dot (Center) - Span 1 */}
            <div className='md:col-span-1 flex justify-center'>
              <div className='w-2 h-2 rounded-full bg-neutral-700 hidden md:block mt-2'></div>
            </div>

            {/* Col 4: Address (Center-Right) - Span 3 */}
            <div className='md:col-span-3'>
              <p className='text-xs uppercase tracking-widest text-neutral-300 mb-4'>
                Headquarters
              </p>
              <div className='flex flex-col gap-1'>
                <p>25 Lindsey Street</p>
                <p>Epping</p>
                <p>CM16 6RB</p>
                <p>United Kingdom</p>
              </div>
            </div>

            {/* Col 5: Socials (Right) - Span 2 */}
            <div className='md:col-span-2 md:text-right flex flex-col gap-1 items-start md:items-end'>
              <a href='#' className='hover:text-white transition-colors'>
                Instagram
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                X
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                Youtube
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                Facebook
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                Linkedin
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                TikTok
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-neutral-500 uppercase tracking-wide gap-6 font-medium'>
            <div className='w-full md:w-auto text-center md:text-left'>
              © {new Date().getFullYear()} Stubble & Co — All rights reserved.
            </div>

            <div className='flex flex-wrap justify-center gap-8 w-full md:w-auto'>
              <Link
                href='/privacy-policy'
                className='hover:text-white transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='hover:text-white transition-colors'
              >
                Terms & Conditions
              </Link>
              <Link
                href='/imprint'
                className='hover:text-white transition-colors'
              >
                Imprint
              </Link>
            </div>

            <div className='w-full md:w-auto flex justify-end pr-4 md:pr-0'>
              <button
                onClick={scrollToTop}
                className='hover:text-white transition-colors group'
              >
                <ArrowUp className='w-5 h-5 group-hover:-translate-y-1 transition-transform' />
              </button>
            </div>
          </div>
        </div>

        {/* App Download Banner */}
        <div className='w-full bg-primary text-black py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='text-center text-white md:text-left'>
            <h3 className='text-xl md:text-2xl font-bold uppercase tracking-tighter'>
              Download Our App
            </h3>
            <p className='text-xs md:text-sm font-medium opacity-80 mt-1'>
              Get exclusive offers and seamless shopping experience.
            </p>
          </div>
          <button className='bg-white text-black text-xs md:text-sm font-bold uppercase tracking-wider py-3 px-8 rounded-full hover:bg-white/90 transition-colors whitespace-nowrap'>
            Get The App
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Footer
