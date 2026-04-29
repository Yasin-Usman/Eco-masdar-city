'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import RoadmapBackground from './RoadmapBackground'
import MascotAnimation, { type MascotState } from '@/components/ui/MascotAnimation'
import { useSounds } from '@/hooks/useSounds'

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { playLevelStart } = useSounds()
  const [mascotState, setMascotState] = useState<MascotState>('idle')

  useEffect(() => {
    if (mascotState === 'idle') {
      const t = setTimeout(() => setMascotState('wave'), 3000)
      return () => clearTimeout(t)
    }
  }, [mascotState])

  const handleMascotComplete = () => {
    if (mascotState === 'wave') setMascotState('happy')
    else setMascotState('idle')
  }

  return (
    <div className="relative isolate min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <RoadmapBackground />

      {/* Main content */}
      <div className="flex flex-col items-center gap-6 px-6 text-center z-10">

        {/* Geometric diamond decorations */}
        <div className="flex gap-3 mb-2">
          {['#f59e0b', '#14b8a6', '#f59e0b'].map((color, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-sm"
            style={{ color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
          >
            Masdar
            <br />
            <span style={{ color: '#5eead4' }}>Eco-Builder</span>
          </h1>
          <p className="text-white/90 text-base mt-2 font-medium max-w-xs drop-shadow">
            Learn about UAE sustainability and build your own eco-city! 🌍
          </p>
        </motion.div>

        {/* Mascot + message row */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <MascotAnimation state={mascotState} size={200} onComplete={handleMascotComplete} />

          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3 max-w-[160px]"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-white font-semibold text-sm leading-snug">
              Good luck building UAE more green
            </p>
          </motion.div>
        </motion.div>

        {/* Start button */}
        <motion.button
          onClick={() => { playLevelStart(); onStart() }}
          className="relative bg-teal-500 text-white font-black text-xl px-10 py-4 rounded-2xl border-b-4 border-teal-700 shadow-lg w-full max-w-xs cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97, y: 4, borderBottomWidth: '0px' }}
        >
          Start Adventure! 🚀
        </motion.button>

        <motion.p
          className="text-white/70 text-xs drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          5 levels • 25 questions • UAE Science
        </motion.p>
      </div>
    </div>
  )
}
