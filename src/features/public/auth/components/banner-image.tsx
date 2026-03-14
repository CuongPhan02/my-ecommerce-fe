const BannerImage = () => {
  return (
    <div className='hidden lg:block relative overflow-hidden bg-black'>
      <img
        alt='Sleek futuristic chrome sculpture'
        className='absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity hover:scale-105 transition-transform duration-700'
        src='https://framerusercontent.com/images/KxF8H6qGSaJvRZEhALbixoOrQg.jpg?scale-down-to=2048&width=1920&height=2400'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60'></div>
      <div className='absolute bottom-12 left-12 max-w-md'>
        <span className='text-xs font-bold tracking-[0.3em] uppercase text-white/50 mb-4 block'>
          Future of Luxury
        </span>
        <h2 className='text-4xl text-white leading-tight'>
          Elevated aesthetics for the modern professional.
        </h2>
      </div>
    </div>
  )
}

export default BannerImage
