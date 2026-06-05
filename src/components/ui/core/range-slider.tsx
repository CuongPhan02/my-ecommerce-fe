'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'

interface RangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
}

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 10000,
}: RangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0])
  const [maxVal, setMaxVal] = useState(value[1])
  const minValRef = useRef(value[0])
  const maxValRef = useRef(value[1])
  const range = useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = useState<'min' | 'max'>('min')

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  // Set width of the range to decrease/increase from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease/increase from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  // Keep values in sync with props
  useEffect(() => {
    setMinVal(value[0])
    setMaxVal(value[1])
    minValRef.current = value[0]
    maxValRef.current = value[1]
  }, [value])

  return (
    <div className="flex flex-col items-center justify-center w-full relative pt-4 pb-4">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onChange={(event) => {
          const val = Math.min(Number(event.target.value), maxVal - step)
          setMinVal(val)
          minValRef.current = val
          onChange([val, maxVal])
        }}
        onMouseEnter={() => setActiveThumb('min')}
        onTouchStart={() => setActiveThumb('min')}
        onFocus={() => setActiveThumb('min')}
        className="range-slider-input w-full absolute top-1/2 -translate-y-1/2 pointer-events-none appearance-none h-6 outline-none bg-transparent"
        style={{ zIndex: activeThumb === 'min' ? 35 : 30 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onChange={(event) => {
          const val = Math.max(Number(event.target.value), minVal + step)
          setMaxVal(val)
          maxValRef.current = val
          onChange([minVal, val])
        }}
        onMouseEnter={() => setActiveThumb('max')}
        onTouchStart={() => setActiveThumb('max')}
        onFocus={() => setActiveThumb('max')}
        className="range-slider-input w-full absolute top-1/2 -translate-y-1/2 pointer-events-none appearance-none h-6 outline-none bg-transparent"
        style={{ zIndex: activeThumb === 'max' ? 35 : 30 }}
      />

      <div className="w-full relative h-1 select-none">
        {/* Track background */}
        <div className="absolute h-1 w-full bg-neutral-200 rounded z-10" />
        {/* Selected range highlight */}
        <div
          ref={range}
          className="absolute h-1 bg-[#d0c1b4] rounded z-20"
        />
      </div>
    </div>
  )
}
