'use client'

import { useInitAuth } from '~/hooks/use-init-auth'

/**
 * AuthProvider
 *
 * Lightweight wrapper that runs the silent-refresh hook once when the app
 * mounts. Place it anywhere inside the client-side provider tree (ideally
 * as close to the root as possible so every page benefits from it).
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useInitAuth()
  return <>{children}</>
}
