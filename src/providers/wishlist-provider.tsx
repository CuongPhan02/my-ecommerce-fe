'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WISHLIST_KEY = 'lune_wishlist_ids'

interface WishlistContextValue {
  wishlistIds: string[]
  isWishlisted: (id: string) => boolean
  toggleWishlist: (id: string) => void
  clearWishlist: () => void
  count: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (stored) {
        setWishlistIds(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist to localStorage on change (only after mounted)
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds))
    } catch {
      // ignore write errors
    }
  }, [wishlistIds, mounted])

  const isWishlisted = useCallback(
    (id: string) => wishlistIds.includes(id),
    [wishlistIds],
  )

  const toggleWishlist = useCallback((id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }, [])

  const clearWishlist = useCallback(() => {
    setWishlistIds([])
  }, [])

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, isWishlisted, toggleWishlist, clearWishlist, count: wishlistIds.length }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
