'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function HydrationProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useGameStore((s) => s.hydrate)

  useEffect(() => {
    useGameStore.persist.rehydrate()
    hydrate()
  }, [hydrate])

  return <>{children}</>
}
