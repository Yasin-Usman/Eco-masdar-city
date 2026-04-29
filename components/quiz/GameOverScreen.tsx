'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Level } from '@/types'
import RoadmapBackground from '@/components/ui/RoadmapBackground'
import MascotAnimation, { type MascotState } from '@/components/ui/MascotAnimation'
import { useGameStore } from '@/store/gameStore'
import { useSounds } from '@/hooks/useSounds'
import { AnimatedLife } from '@/components/ui/AnimatedIcons'

interface GameOverScreenProps {
  level: Level
  onRetry: () => void
  onBackToMap: () => void
}

export default function GameOverScreen({ level, onRetry, onBackToMap }: GameOverScreenProps) {
  const { resetLives } = useGameStore()
  const { playWrong, playTap, playLevelStart } = useSounds()
  const [mascotState, setMascotState] = useState<MascotState>('wrong')

  useEffect(() => {
    setTimeout(() => playWrong(), 100)
  }, [playWrong])

  const handleMascotComplete = () => {
    if (mascotState === 'wrong') setMascotState('idle')
  }

  const handleRetry = () => {
    playLevelStart()
    resetLives()
    onRetry()
  }

  return (
    <div className="relative isolate min-h-screen flex flex-col overflow-hidden px-6">
      <RoadmapBackground />

      {/* X button */}
      <div className="relative z-10 flex justify-end pt-10 pr-2">
        <button
          onClick={() => { playTap(); onBackToMap() }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-colors font-bold"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div
        className="w-full max-w-sm flex flex-col items-center gap-5 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180 }}
      >
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">Oh no!</h1>
          <p className="text-white/70 mt-1">You ran out of hearts on Level {level.id}</p>
        </div>

        {/* Mascot + speech bubble */}
        <div className="flex items-center gap-4">
          <MascotAnimation
            state={mascotState}
            size={180}
            onComplete={handleMascotComplete}
          />

          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3 max-w-[150px]"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-white font-semibold text-sm leading-snug">
              No worries, failure is a part of success
            </p>
          </motion.div>
        </div>

        {/* Spent hearts */}
        <div className="flex gap-2 items-center">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ opacity: 0.45 }}
            >
              <AnimatedLife active={false} size={28} />
            </motion.div>
          ))}
        </div>

        {/* Try again button */}
        <motion.button
          onClick={handleRetry}
          className="w-full bg-teal-500 text-white font-black text-xl py-4 rounded-2xl border-b-4 border-teal-700 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97, y: 3, borderBottomWidth: '1px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Try Again!
        </motion.button>

        {/* Back to map */}
        <motion.button
          onClick={() => { playTap(); onBackToMap() }}
          className="w-full bg-white/70 text-amber-700 font-bold text-base py-3 rounded-2xl border-2 border-amber-200"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Back to Map
        </motion.button>
      </motion.div>
      </div>
    </div>
  )
}
