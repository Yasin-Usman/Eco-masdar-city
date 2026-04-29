'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { AnimatedFire, AnimatedCoin, LifeHeart, type HeartState } from './AnimatedIcons'
import CartoonAvatar from './CartoonAvatar'

const CARD = 'rounded-2xl border border-white/8 shadow-md'
const CARD_BG = '#1E323A'

const DIVIDER = { height: '1px', background: 'rgba(255,255,255,0.07)' }

const HEART_SIZE = 32
const COIN_SIZE = 32

interface DesktopSidebarProps {
  onOpenProfile: () => void
}

export default function DesktopSidebar({ onOpenProfile }: DesktopSidebarProps) {
  const { coins, currentStreak, lives, completedLevels, playerName } = useGameStore()
  const progress = (completedLevels.length / 5) * 100

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
    <div className="h-full px-4 py-6 flex flex-col gap-4">

      {/* Profile card */}
      <motion.button
        onClick={onOpenProfile}
        className={`${CARD} p-5 flex flex-col items-center gap-3 w-full cursor-pointer`}
        style={{ background: CARD_BG }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <CartoonAvatar name={playerName} size={64} />
        <div className="text-center">
          <p className="text-white font-black text-sm">{playerName}</p>
          <p className="text-teal-400 text-xs font-medium mt-0.5">Tap to edit profile</p>
        </div>
      </motion.button>

      {/* Stats panel */}
      <motion.div
        className={`${CARD} p-4 flex flex-col gap-3`}
        style={{ background: CARD_BG }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Your Stats
        </h3>

        {/* Lives */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/50">Lives</span>
          <div className="flex gap-0.5 items-center">
            {heartStates.map((state, idx) => (
              <LifeHeart
                key={idx}
                state={state}
                size={HEART_SIZE}
                onBreakComplete={() => handleBreakComplete(idx)}
              />
            ))}
          </div>
        </div>

        <div style={DIVIDER} />

        {/* Streak */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/50">Streak</span>
          <div className="flex items-center gap-1.5">
            <AnimatedFire size={18} />
            <span className="font-black text-orange-400 text-sm">{currentStreak}</span>
          </div>
        </div>

        <div style={DIVIDER} />

        {/* Coins */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/50">Coins</span>
          <div className="flex items-center gap-1.5">
            <AnimatedCoin size={COIN_SIZE} />
            <span className="font-black text-amber-400 text-sm">{coins}</span>
          </div>
        </div>

        <div style={DIVIDER} />

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-white/50">Progress</span>
            <span className="text-xs font-bold text-teal-400">{completedLevels.length}/5</span>
          </div>
          <div className="rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-2 rounded-full bg-emerald-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Dialogue bubble */}
      <motion.div
        className={`${CARD} px-4 py-3`}
        style={{ background: CARD_BG }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-white/50 text-[11px] font-medium leading-snug text-center">
          {completedLevels.length === 0
            ? '"Every great eco-city starts with one step!" 🌱'
            : completedLevels.length < 3
              ? '"You\'re building something amazing! Keep going!" 💪'
              : completedLevels.length < 5
                ? '"Almost there! Masdar City needs you!" 🏙️'
                : '"You built the future! Masdar is complete!" 🎉'}
        </p>
      </motion.div>
    </div>
  )
}
