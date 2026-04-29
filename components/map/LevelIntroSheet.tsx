'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import type { Level } from '@/types'
import MascotAnimation, { type MascotState } from '@/components/ui/MascotAnimation'
import { useSounds } from '@/hooks/useSounds'
import { AnimatedCoin } from '@/components/ui/AnimatedIcons'
import solarData from '../../public/assets/Solar Panel.json'
import windData from '../../public/assets/Wind Energy turbine.json'
import waterData from '../../public/assets/Water Animation.json'
import evCarData from '../../public/assets/ev car charging.json'
import treeData from '../../public/assets/Tree in the wind.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LEVEL_LOTTIE: Record<number, any> = {
  1: solarData,
  2: windData,
  3: waterData,
  4: evCarData,
  5: treeData,
}

interface LevelIntroSheetProps {
  level: Level | null
  onStart: () => void
  onClose: () => void
}

export default function LevelIntroSheet({ level, onStart, onClose }: LevelIntroSheetProps) {
  const { playSlide, playLevelStart, playTap } = useSounds()
  const [mascotState, setMascotState] = useState<MascotState>('idle')

  // Reset mascot to idle each time the sheet opens
  useEffect(() => {
    if (level) setMascotState('idle')
  }, [level])

  // idle → 3 s → wave → idle, loops while sheet is open
  useEffect(() => {
    if (mascotState === 'idle' && level) {
      const t = setTimeout(() => setMascotState('wave'), 3000)
      return () => clearTimeout(t)
    }
  }, [mascotState, level])

  useEffect(() => {
    if (level) playSlide()
  }, [level, playSlide])

  const handleStart = () => {
    playLevelStart()
    onStart()
  }

  const handleClose = () => {
    playTap()
    onClose()
  }

  return (
    <AnimatePresence>
      {level && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-hidden max-w-lg mx-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Colored header bar */}
            <div
              className="h-2 w-full"
              style={{ background: `linear-gradient(90deg, ${level.color}, ${level.color}99)` }}
            />

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-6 pb-8 pt-2">
              {/* Level badge + icon */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md overflow-hidden"
                  style={{ backgroundColor: `${level.color}20`, border: `2px solid ${level.color}40` }}
                >
                  <Lottie
                    animationData={LEVEL_LOTTIE[level.id]}
                    loop
                    style={{ width: 56, height: 56 }}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Level {level.id}</p>
                  <h2 className="text-xl font-black text-gray-900">{level.title}</h2>
                  <p className="text-sm text-gray-500">{level.subtitle}</p>
                </div>

                {/* Mascot — idle/wave cycle */}
                <div className="ml-auto">
                  <MascotAnimation
                    state={mascotState}
                    size={80}
                    onComplete={() => setMascotState('idle')}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
                <p className="text-amber-800 text-sm leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* What you'll unlock */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs text-gray-500 font-medium">Unlock:</span>
                <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 rounded-full px-3 py-1">
                  <span>{level.unlocksIcon}</span>
                  <span className="text-xs font-bold text-teal-700">{level.unlocks}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <AnimatedCoin size={20} />
                  <span className="text-xs font-bold text-amber-700">+{level.coins}</span>
                </div>
              </div>

              {/* Questions count */}
              <div className="flex gap-2 mb-5">
                {level.questions.map((_, i) => (
                  <div key={i} className="flex-1 h-2 bg-gray-100 rounded-full" />
                ))}
              </div>

              {/* Start button */}
              <motion.button
                onClick={handleStart}
                className="w-full bg-teal-500 text-white font-black text-lg py-4 rounded-2xl border-b-4 border-teal-700 shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97, y: 3, borderBottomWidth: '1px' }}
              >
                Let's Go!
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
