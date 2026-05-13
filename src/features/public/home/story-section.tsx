'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'

const stories = [
  { id: 1, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 2, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 3, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 4, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 5, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 6, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 7, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 8, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
]

const StorySection = () => {
  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="main-container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar justify-center no-scrollbar">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-[#6366f1] to-[#a855f7] group-hover:from-[#4f46e5] group-hover:to-[#9333ea] transition-all">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
                  <Image
                    src={story.image}
                    alt={`Story ${story.id}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StorySection
