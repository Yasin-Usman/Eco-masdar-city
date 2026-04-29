'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import confetti from 'canvas-confetti'
import type { Level } from '@/types'
import RoadmapBackground from '@/components/ui/RoadmapBackground'
import MascotAnimation from '@/components/ui/MascotAnimation'
import { useGameStore } from '@/store/gameStore'
import { useSounds } from '@/hooks/useSounds'
import { AnimatedCoin } from '@/components/ui/AnimatedIcons'
import starsData from '../../public/assets/5 stars.json'

interface VictoryScreenProps {
  level: Level
  coinsEarned: number
  onBackToMap: () => void
}

export default function VictoryScreen({ level, coinsEarned, onBackToMap }: VictoryScreenProps) {
  const { coins } = useGameStore()
  const { playVictory, playTap } = useSounds()

  useEffect(() => {
    playVictory()
    const end = Date.now() + 2500
    const colors = ['#f59e0b', '#14b8a6', '#22c55e', '#3b82f6', '#f43f5e']
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [playVictory])

  return (
    <div className="relative isolate h-screen flex flex-col overflow-hidden px-5">
      <RoadmapBackground />

      {/* X button */}
      <div className="relative z-10 flex justify-end pt-6 pr-1 shrink-0">
        <button
          onClick={() => { playTap(); onBackToMap() }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-colors font-bold"
        >
          ✕
        </button>
      </div>

      <motion.div
        className="flex-1 flex flex-col items-center justify-center gap-3 z-10 w-full max-w-sm mx-auto"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Mascot + 5 stars side by side */}
        <div className="flex items-center justify-center gap-1">
          <MascotAnimation state="winner" size={130} />
          <Lottie animationData={starsData} loop style={{ width: 130, height: 130 }} />
        </div>

        {/* Victory heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-black text-white">Amazing!</h1>
          <p className="text-white/75 text-sm mt-0.5">You completed Level {level.id}</p>
        </motion.div>

        {/* Unlocked card */}
        <motion.div
          className="w-full bg-white/85 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-teal-500 px-4 py-2">
            <p className="text-white text-[10px] font-bold uppercase tracking-widest">You unlocked</p>
          </div>
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center text-2xl border border-teal-100 shrink-0">
              {level.unlocksIcon}
            </div>
            <div>
              <h3 className="text-gray-900 font-black text-sm">{level.unlocks}</h3>
              <p className="text-gray-500 text-xs">Added to Masdar City!</p>
            </div>
          </div>
        </motion.div>

        {/* Coins earned */}
        <motion.div
          className="w-full flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-2.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.55, type: 'spring' }}
        >
          <AnimatedCoin size={32} />
          <div>
            <p className="text-[10px] text-amber-600 font-medium">Coins earned</p>
            <p className="text-xl font-black text-amber-800">+{coinsEarned}</p>
          </div>
          <div className="ml-auto border-l border-amber-200 pl-4">
            <p className="text-[10px] text-amber-600 font-medium">Total</p>
            <p className="text-xl font-black text-amber-800">{coins}</p>
          </div>
        </motion.div>

        {/* Back to map button */}
        <motion.button
          onClick={() => { playTap(); onBackToMap() }}
          className="w-full bg-teal-500 text-white font-black text-lg py-3.5 rounded-2xl border-b-4 border-teal-700 shadow-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97, y: 3, borderBottomWidth: '1px' }}
        >
          Back to Map 🗺️
        </motion.button>
      </motion.div>
    </div>
  )
}
