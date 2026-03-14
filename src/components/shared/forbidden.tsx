'use client'

import Link from 'next/link'

export default function Forbidden() {
  return (
    <div className='h-screen w-full bg-primary text-black relative flex flex-col items-center justify-center overflow-hidden font-heading'>
      {/* Top Left Navigation Area */}
      <div className='absolute top-6 left-6 md:top-8 md:left-8 flex flex-col items-start z-10'>
        <div className='text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none mb-1'>
          AKR.
        </div>
        <Link
          href='/'
          className='border-[3px] border-black text-black text-sm md:text-base font-black uppercase px-3 py-0.5 hover:bg-black hover:text-[#E50000] transition-colors tracking-widest'
        >
          HOME
        </Link>
      </div>

      {/* Massive 403 Text */}
      <div className='flex items-center justify-center w-full h-full pointer-events-none select-none overflow-hidden'>
        <h1 className='text-[50vw] lg:text-[45vw] leading-[0.9] font-black tracking-tighter text-black m-0 p-0 transform'>
          403
        </h1>
      </div>
    </div>
  )
}
