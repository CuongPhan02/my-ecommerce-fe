const UnderConstruction = () => {
  return (
    <div className='relative min-h-screen flex flex-col fashion-bg mt-10'>
      <main className='flex-1 flex flex-col items-center justify-center px-6 text-center z-10 text-white'>
        <div className='max-w-4xl w-full'>
          <div className='mb-8 flex justify-center items-center gap-4'>
            <div className='h-[1px] w-12 bg-white/40'></div>
            <span className='sans-minimal text-[10px] uppercase tracking-[0.5em] text-white/80'>
              Coming Summer 2024
            </span>
            <div className='h-[1px] w-12 bg-white/40'></div>
          </div>
          <h2 className='text-5xl md:text-8xl lg:text-9xl font-light italic mb-12 leading-tight'>
            The Art of <br /> Modern Luxury
          </h2>
          <div className='grid grid-cols-4 gap-4 md:gap-12 mb-20 max-w-2xl mx-auto'>
            <div className='flex flex-col border-r border-white/20'>
              <span className='serif-display text-3xl md:text-5xl font-light tracking-tighter'>
                18
              </span>
              <span className='sans-minimal text-[8px] uppercase tracking-[0.3em] mt-2 opacity-60'>
                Days
              </span>
            </div>
            <div className='flex flex-col border-r border-white/20'>
              <span className='serif-display text-3xl md:text-5xl font-light tracking-tighter'>
                04
              </span>
              <span className='sans-minimal text-[8px] uppercase tracking-[0.3em] mt-2 opacity-60'>
                Hours
              </span>
            </div>
            <div className='flex flex-col border-r border-white/20'>
              <span className='serif-display text-3xl md:text-5xl font-light tracking-tighter'>
                22
              </span>
              <span className='sans-minimal text-[8px] uppercase tracking-[0.3em] mt-2 opacity-60'>
                Mins
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='serif-display text-3xl md:text-5xl font-light tracking-tighter'>
                45
              </span>
              <span className='sans-minimal text-[8px] uppercase tracking-[0.3em] mt-2 opacity-60'>
                Secs
              </span>
            </div>
          </div>
          <div className='max-w-md mx-auto w-full mb-12'>
            <p className='sans-minimal text-[11px] uppercase tracking-[0.2em] mb-8 text-white/70'>
              Be the first to access the private collection
            </p>
            <form className='relative group'>
              <input
                className='w-full bg-transparent border-t-0 border-x-0 border-b border-white/40 pb-4 text-center sans-minimal text-xs tracking-[0.2em] focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase'
                placeholder='ENTER YOUR EMAIL'
                type='email'
              />
              <button
                className='mt-8 w-full py-4 border thin-border border-white/40 bg-accent transition-all duration-500 sans-minimal text-[10px] uppercase tracking-[0.4em]'
                type='submit'
              >
                Join the Waitlist
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UnderConstruction
