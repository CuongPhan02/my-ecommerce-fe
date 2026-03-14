'use client'
import { UserLock } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Error403 = () => {
  const router = useRouter()
  return (
    <div className='flex-1 flex flex-col items-center justify-center px-4 py-12'>
      <div className='container flex flex-col max-w-[600px] w-full items-center text-center'>
        <div className='mb-8 flex flex-col items-center'>
          <div className='w-32 h-32 md:w-40 md:h-40 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6'>
            <UserLock className='text-white' size={60} />
          </div>

          <h1 className='text-[#1b0e0e] dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4'>
            Access Denied
          </h1>

          <p className='text-[#1b0e0e]/70 dark:text-white/70 text-base md:text-lg font-normal leading-relaxed max-w-[480px]'>
            You don't have permission to view this page. Please contact your
            administrator if you think this is a mistake.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-4'>
          <button
            onClick={() => router.back()}
            className='flex min-w-[160px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20'
          >
            <span className='truncate'>Go Back</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className='flex min-w-[160px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#f3e7e8] dark:bg-white/10 text-[#1b0e0e] dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#e8d5d7] dark:hover:bg-white/20 transition-all border border-transparent'
          >
            <span className='truncate'>Return to Home</span>
          </button>
        </div>

        <div className='mt-12'>
          <p className='text-[#994d51] dark:text-primary/70 text-sm font-medium leading-normal px-4 py-2 bg-primary/5 dark:bg-primary/10 rounded-full border border-primary/10'>
            Error Code: 403 Forbidden
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error403
