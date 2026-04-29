'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { useGameStore } from '@/store/gameStore'
import levelsData from '@/data/levels.json'
import lockData from '../../public/assets/Teasing lock - closed.json'
import solarData from '../../public/assets/Solar Panel.json'
import windData from '../../public/assets/Wind Energy turbine.json'
import waterData from '../../public/assets/Water Animation.json'
import evCarData from '../../public/assets/ev car charging.json'
import treeData from '../../public/assets/Tree in the wind.json'
import type { Level } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LEVEL_LOTTIE: Record<number, any> = {
  1: solarData,
  2: windData,
  3: waterData,
  4: evCarData,
  5: treeData,
}

const CARD_BG = '#1E323A'
const CARD = 'rounded-2xl border border-white/8 shadow-md'

const levels = levelsData as Level[]

export default function CityStatsPanel() {
  const { completedLevels } = useGameStore()

  return (
    <div className="h-full px-4 py-6 flex flex-col gap-4">
      {/* Header */}
      <motion.div
        className={`${CARD} p-4`}
        style={{ background: CARD_BG }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Your Masdar City</h3>
        <p className="text-xs text-white/40">
          {completedLevels.length === 0
            ? 'Complete levels to unlock buildings!'
            : `${completedLevels.length} of 5 buildings unlocked`}
        </p>

        {/* City progress bar */}
        <div className="mt-2 rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-2 rounded-full bg-emerald-500"
            animate={{ width: `${(completedLevels.length / 5) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Building cards */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {levels.map((level, i) => {
          const isUnlocked = completedLevels.includes(level.id)
          return (
            <motion.div
              key={level.id}
              className={`${CARD} overflow-hidden transition-all`}
              style={{ background: CARD_BG, opacity: isUnlocked ? 1 : 0.5 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isUnlocked ? 1 : 0.5, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="p-3 flex items-center gap-3">
                {/* Icon */}
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                  animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ delay: 0.3 }}
                >
                  {isUnlocked ? (
                    <Lottie animationData={LEVEL_LOTTIE[level.id]} loop style={{ width: 36, height: 36 }} />
                  ) : (
                    <Lottie animationData={lockData} loop style={{ width: 36, height: 36 }} />
                  )}
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${isUnlocked ? 'text-white/90' : 'text-white/30'}`}>
                    {isUnlocked ? level.unlocks : `Level ${level.id}`}
                  </p>
                  <p className={`text-xs truncate ${isUnlocked ? 'text-teal-400' : 'text-white/30'}`}>
                    {isUnlocked ? level.subtitle : 'Locked'}
                  </p>
                </div>

                {/* Status */}
                {isUnlocked && (
                  <motion.span
                    className="text-emerald-400 text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>

              {/* Unlocked bottom bar */}
              {isUnlocked && (
                <div
                  className="h-1"
                  style={{ background: `linear-gradient(90deg, ${level.color}60, ${level.color}20)` }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* All complete badge */}
      <AnimatePresence>
        {completedLevels.length === 5 && (
          <motion.div
            className="bg-gradient-to-r from-amber-400 to-teal-400 rounded-2xl p-4 text-center shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <p className="text-white font-black text-sm">🏆 City Complete!</p>
            <p className="text-white/80 text-xs mt-1">Masdar City is fully built!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
