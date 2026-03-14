'use client'

import React from 'react'
import { motion } from 'motion/react'

const MESSAGES = [
  'FREE SHIPPING ON ORDERS OVER 50 EUR',
  'DELIVERY WITHIN 3-6 BUSINESS DAYS',
  'FREE SHIPPING ON ORDERS OVER 50 EUR',
  'DELIVERY WITHIN 3-6 BUSINESS DAYS',
  'FREE SHIPPING ON ORDERS OVER 50 EUR',
  'DELIVERY WITHIN 3-6 BUSINESS DAYS',
]

const TopBar = () => {
  return (
    <div className='w-full bg-[#1a1a1a] text-white text-[10px] md:text-xs font-bold py-2.5 overflow-hidden flex items-center border-b border-neutral-800 tracking-wider uppercase whitespace-nowrap min-h-[36px]'>
      <motion.div
        className='flex items-center gap-6 shrink-0'
        initial={{ x: 0 }}
        animate={{ x: '-50%' }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {[...Array(2)].map((_, loopIndex) => (
          <div
            key={loopIndex}
            className='flex items-center gap-6 shrink-0 pb-[2px]'
          >
            {MESSAGES.map((msg, index) => (
              <React.Fragment key={`${loopIndex}-${index}`}>
                <span>{msg}</span>
                <span className='w-1.5 h-1.5 bg-white shrink-0'></span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default TopBar
