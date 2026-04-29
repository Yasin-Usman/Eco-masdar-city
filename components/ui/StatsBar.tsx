'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { AnimatedFire, AnimatedCoin, LifeHeart, type HeartState } from './AnimatedIcons'

const BAR_STYLE = {
  background: 'linear-gradient(160deg, #232326 0%, #1c1c1e 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  boxShadow: [
    'inset 0 1px 0 rgba(255,255,255,0.05)',
    '0 4px 16px rgba(0,0,0,0.7)',
    '0 16px 40px rgba(0,0,0,0.4)',
  ].join(', '),
}

const HEART_SIZE = 36
const COIN_SIZE = 36

export default function StatsBar() {
  const { coins, currentStreak, lives } = useGameStore()
  const [heartStates, setHeartStates] = useState<HeartState[]>(['active', 'active', 'active'])

  useEffect(() => {
    if (lives === 3) {
      setHeartStates(['active', 'active', 'active'])
    }
  }, [lives])

  const handleBreakComplete = useCallback((idx: number) => {
    setHeartStates(prev => {
      const next = [...prev] as HeartState[]
      if (next[idx] === 'breaking') next[idx] = 'empty'
      return next
    })
  }, [])

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 max-w-sm mx-auto w-full"
      style={BAR_STYLE}
    >
      {/* Hearts */}
      <div className="flex items-center gap-0.5">
        {heartStates.map((state, idx) => (
          <LifeHeart
            key={idx}
            state={state}
            size={HEART_SIZE}
            onBreakComplete={() => handleBreakComplete(idx)}
          />
        ))}
      </div>

      {/* Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <AnimatedFire size={18} />
        <span style={{ fontWeight: 800, color: '#ff9500', fontSize: '13px' }}>{currentStreak}</span>
      </div>

      {/* Coins */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <AnimatedCoin size={COIN_SIZE} />
        <motion.span
          key={coins}
          initial={{ scale: 1.35 }}
          animate={{ scale: 1 }}
          style={{ fontWeight: 800, fontSize: '13px', color: '#ffd60a' }}
        >
          {coins}
        </motion.span>
      </div>
    </div>
  )
}
