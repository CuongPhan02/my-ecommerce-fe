'use client'

import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const marqueeItems = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400',
    alt: 'Blue Shirt',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    alt: 'Red Shoes',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=400',
    alt: 'Jeans',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400',
    alt: 'Hoodie',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    alt: 'Leather Jacket',
  },
]

const HeroSection = () => {
  return (
    <div className='relative w-full md:min-h-[calc(100vh-110px)] lg:h-[calc(100vh-110px)] flex flex-col lg:grid lg:grid-cols-[1fr_380px] overflow-hidden bg-black font-sans'>
      {/* Left Content Column / Main Hero Area */}
      <div className='relative min-h-[40vh] lg:flex-1 lg:min-h-[50vh] lg:h-full w-full flex flex-col justify-end p-8 lg:p-12 xl:p-20 overflow-hidden'>
        {/* Background Image */}
        <div className='absolute inset-0 z-0 aspect-video'>
          <Image
            src='https://framerusercontent.com/images/KxF8H6qGSaJvRZEhALbixoOrQg.jpg?scale-down-to=2048&width=1920&height=2400'
            alt='Hero Background'
            fill
            priority
            className='object-cover'
          />
          {/* Gradients to ensure text readability */}
          <div className='absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent' />
          <div className='absolute inset-0 bg-black/10' />
        </div>

        {/* Text Content */}
        <div className='relative z-20 space-y-4 lg:space-y-6 max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className='inline-block text-[10px] lg:text-xs font-black uppercase tracking-[0.5em] text-neutral-300 mb-1 lg:mb-2'>
              Dress the Unconventional
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h1 className='text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-[0.9] tracking-tighter uppercase italic'>
              WEAR{' '}
              <span className='text-outline-white text-xl lg:text-4xl xl:text-9xl xl:text-[10rem] block lg:inline'>
                THE
              </span>{' '}
              <br />
              <div className='flex flex-wrap items-baseline gap-2 lg:gap-4'>
                <span className='not-italic'>HYPE</span>
                <span className='text-outline-white inline-block'>"RAW"</span>
              </div>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Right Column / Bottom Bar (Marquee + Button) */}
      <div className='relative md:min-h-[40vh] lg:h-full flex flex-col bg-neutral-950 z-30 border-t lg:border-t-0 lg:border-l border-neutral-800'>
        {/* Product Marquee Area */}
        <div className='flex-1 relative overflow-hidden flex lg:flex-col items-center justify-center py-0'>
          {/* Desktop Vertical Marquee */}
          <motion.div
            className='hidden lg:flex flex-col gap-6 w-full border-5 border-primary'
            animate={{ y: [0, -1200] }}
            transition={{
              y: {
                duration: 35,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map(
              (item, idx) => (
                <div key={`${item.id}-${idx}`} className='w-full'>
                  <div className='aspect-square relative flex items-center justify-center bg-neutral-900/50 border border-neutral-800/40 group cursor-pointer transition-colors '>
                    <div className='relative aspect-video w-full h-full'>
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes='300px'
                        className='object-cover'
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
          </motion.div>

          {/* Mobile Horizontal Marquee */}
          <div className='lg:hidden w-full overflow-hidden flex items-center'>
            <motion.div
              className='flex  px-4 border-4 border-primary'
              animate={{ x: [0, -1000] }}
              transition={{
                x: {
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {[
                ...marqueeItems,
                ...marqueeItems,
                ...marqueeItems,
                ...marqueeItems,
              ].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}-mobile`}
                  className='md:w-48 w-32 md:h-48 h-32 relative flex-shrink-0 flex items-center justify-center bg-neutral-900 '
                >
                  <div className='relative w-full h-full'>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes='200px'
                      className='object-cover'
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Global Action Button */}
        <Link
          href='/shop'
          className='relative h-10 md:h-14 lg:h-20 xl:h-24 bg-primary hover:bg-white group transition-colors duration-500 flex items-center justify-center lg:justify-between px-10 overflow-hidden'
        >
          <span className='relative z-10 text-xs md:text-lg lg:text-xl xl:text-2xl font-black text-white group-hover:text-black uppercase tracking-widest transition-colors duration-500'>
            Shop Now
          </span>
          <ArrowUpRight className='relative z-10 hidden lg:block w-8 h-8 xl:w-10 xl:h-10 text-white group-hover:text-black transition-all duration-500 group-hover:rotate-45' />

          {/* Slide up hover effect */}
          <div className='absolute bottom-0 left-0 w-full h-0 bg-white group-hover:h-full transition-all duration-500 ease-in-out' />
        </Link>
      </div>

      <style jsx>{`
        .text-outline-white {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7);
        }
        @media (min-width: 1024px) {
          .text-outline-white {
            -webkit-text-stroke: 1.5px white;
          }
        }
        @media (min-width: 1280px) {
          .text-outline-white {
            -webkit-text-stroke: 2px white;
          }
        }
      `}</style>
    </div>
  )
}

export default HeroSection
