'use client'

import Lottie from 'lottie-react'
import { motion } from 'framer-motion'
import type { Level, LevelStatus } from '@/types'
import { useSounds } from '@/hooks/useSounds'
import starData from '../../public/assets/star.json'
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

interface LevelNodeProps {
  level: Level
  status: LevelStatus
  isNewlyUnlocked: boolean
  textSide: 'left' | 'right'
  onClick: () => void
}

export default function LevelNode({ level, status, isNewlyUnlocked, textSide, onClick }: LevelNodeProps) {
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isActive = status === 'active'
  const { playNodeClick } = useSounds()

  const handleClick = () => {
    if (!isLocked) {
      playNodeClick()
      onClick()
    }
  }

  return (
    <div className="relative" style={{ width: 64, height: 64 }}>

      {/* Side text label — floats left or right of the button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 110,
          zIndex: 10,
          ...(textSide === 'left'
            ? { right: 'calc(100% + 12px)', textAlign: 'right' as const }
            : { left: 'calc(100% + 12px)', textAlign: 'left' as const }
          ),
        }}
      >
        <p className={`text-xs font-bold leading-tight ${isLocked ? 'text-neutral-500' : 'text-white'}`}>
          {level.title}
        </p>
        {isCompleted && (
          <motion.p
            className="text-xs text-emerald-400 font-medium mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Done! ✓
          </motion.p>
        )}
      </div>

      {/* Node button */}
      <motion.button
        onClick={handleClick}
        disabled={isLocked}
        aria-label={`Level ${level.id}: ${level.title} - ${status}`}
        className={[
          'w-16 h-16 rounded-full flex items-center justify-center',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400',
          'overflow-hidden',
          isLocked
            ? 'bg-neutral-700 cursor-not-allowed opacity-50'
            : isCompleted
              ? 'bg-emerald-500 border-b-4 border-emerald-700 cursor-pointer'
              : 'bg-teal-500 border-b-4 border-teal-700 cursor-pointer',
        ].join(' ')}
        initial={false}
        animate={
          isNewlyUnlocked
            ? { y: [0, -14, -6, -10, 0], scale: [1, 1.15, 1.05, 1.1, 1] }
            : isActive
              ? { scale: [1, 1.04, 1] }
              : { scale: 1 }
        }
        transition={
          isNewlyUnlocked
            ? { duration: 0.8, repeat: 3, repeatDelay: 0.5 }
            : isActive
              ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
              : {}
        }
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileTap={!isLocked ? { scale: 0.93, y: 4 } : {}}
        style={
          isLocked
            ? { boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)' }
            : isCompleted
              ? { boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.4), 0 6px 0 #059669, 0 8px 20px rgba(16,185,129,0.3)' }
              : {
                  filter: 'drop-shadow(0 0 10px rgba(20,184,166,0.9)) drop-shadow(0 0 22px rgba(20,184,166,0.5))',
                  boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.4), 0 6px 0 #0f766e, 0 8px 25px rgba(20,184,166,0.5)',
                }
        }
      >
        {isCompleted ? (
          <Lottie animationData={starData} loop style={{ width: 64, height: 64 }} />
        ) : (
          <Lottie
            animationData={LEVEL_LOTTIE[level.id]}
            loop
            style={{
              width: 64,
              height: 64,
              filter: isLocked ? 'grayscale(100%)' : 'none',
            }}
          />
        )}
      </motion.button>

      {/* Pulsing ring for active node */}
      {isActive && !isNewlyUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-teal-400 pointer-events-none"
          animate={{ scale: [1, 1.55], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
        />
      )}

      {/* Newly unlocked glow burst */}
      {isNewlyUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.6) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.8], opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}
    </div>
  )
}
