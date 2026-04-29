'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { useLevelData } from '@/hooks/useLevelData'
import LevelNode from './LevelNode'
import LevelIntroSheet from './LevelIntroSheet'
import StatsBar from '@/components/ui/StatsBar'
import RoadmapBackground from '@/components/ui/RoadmapBackground'
import DesktopSidebar from '@/components/ui/DesktopSidebar'
import CityStatsPanel from '@/components/ui/CityStatsPanel'
import MascotAnimation, { type MascotState } from '@/components/ui/MascotAnimation'
import ProfileScreen from '@/components/ui/ProfileScreen'
import type { Level } from '@/types'

interface MapScreenProps {
  onStartLevel: (level: Level) => void
}

// Zig-zag positions for nodes: alternating left/right
// textSide controls which side the label appears — override per-node to avoid path overlap
const NODE_POSITIONS = [
  { side: 'right',  x: '60%', textSide: 'right' },
  { side: 'left',   x: '25%', textSide: 'right' },
  { side: 'right',  x: '68%', textSide: 'right' }, // flipped: label was overlapping the curve
  { side: 'left',   x: '22%', textSide: 'right' },
  { side: 'center', x: '50%', textSide: 'left'  },
] as const

function buildSegmentD(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
): string {
  const midY = (p0.y + p1.y) / 2
  return `M ${p0.x} ${p0.y} C ${p0.x} ${midY} ${p1.x} ${midY} ${p1.x} ${p1.y}`
}

export default function MapScreen({ onStartLevel }: MapScreenProps) {
  const { unlockedLevels, completedLevels, newlyUnlocked, playerName } = useGameStore()
  const { levels, getLevelStatus } = useLevelData(unlockedLevels, completedLevels)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mascotState, setMascotState] = useState<MascotState>('idle')
  const profileInitial = (playerName || 'E')[0].toUpperCase()

  useEffect(() => {
    if (mascotState === 'idle') {
      const timer = setTimeout(() => setMascotState('wave'), 5000)
      return () => clearTimeout(timer)
    }
  }, [mascotState])

  const handleMascotComplete = () => setMascotState('idle')

  const windLevelIdx = levels.findIndex((l) => l.title === 'Ride the Wind!')

  const handleNodeClick = (level: Level) => {
    setSelectedLevel(level)
  }

  const handleStartLevel = () => {
    if (selectedLevel) {
      setSelectedLevel(null)
      onStartLevel(selectedLevel)
    }
  }

  const nodeSpacing = 130
  const mapHeight = levels.length * nodeSpacing + 80

  // SVG x coordinates: percentage string → 0-320 unit space
  const svgPoints = levels.map((_, i) => ({
    x: parseFloat(NODE_POSITIONS[i].x) * 3.2,
    y: i * nodeSpacing + 60,
  }))

  return (
    <div className="relative isolate min-h-screen flex overflow-hidden">
      <RoadmapBackground />

      {/* Desktop layout */}
      <div className="w-full flex">

        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 z-10">
          <DesktopSidebar onOpenProfile={() => setProfileOpen(true)} />
        </div>

        {/* Main map column */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* Mobile top stats bar + profile button */}
          <div className="lg:hidden sticky top-0 z-20 px-4 pt-4 pb-2 flex items-center gap-3">
            <div className="flex-1">
              <StatsBar />
            </div>
            <button
              onClick={() => setProfileOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                boxShadow: '0 0 0 2px rgba(20,184,166,0.3)',
              }}
            >
              {profileInitial}
            </button>
          </div>

          {/* Map title */}
          <motion.div
            className="text-center pt-4 pb-2 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-black" style={{ color: '#f0f0f0' }}>🌟 Masdar City</h1>
            <p className="text-sm" style={{ color: '#7a7a7a' }}>Build your eco-city one level at a time</p>
          </motion.div>

          {/* Scrollable map area */}
          <div className="relative flex-1 overflow-y-auto pb-20">

            {/* Mascot — centered in the empty lane left of the roadmap path, xl+ only */}
            {windLevelIdx >= 0 && (
              <motion.div
                className="hidden xl:block absolute pointer-events-none"
                style={{
                  top: windLevelIdx * nodeSpacing - 88,
                  right: 'calc(50% + 100px)',
                  width: 360,
                  height: 360,
                  zIndex: 5,
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <MascotAnimation
                  state={mascotState}
                  size={360}
                  onComplete={handleMascotComplete}
                />
              </motion.div>
            )}

            <div
              className="relative mx-auto"
              style={{ width: '100%', maxWidth: '360px', minHeight: `${mapHeight}px` }}
            >
              {/* SVG connecting path — segmented by completion status */}
              <svg
                className="absolute inset-0 w-full pointer-events-none"
                style={{ height: mapHeight }}
                viewBox={`0 0 320 ${mapHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="path-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {svgPoints.slice(0, -1).map((pt, i) => {
                  const next = svgPoints[i + 1]
                  const isLit = getLevelStatus(levels[i].id) === 'completed'
                  return (
                    <path
                      key={i}
                      d={buildSegmentD(pt, next)}
                      fill="none"
                      stroke={isLit ? '#34d399' : '#2a2a2a'}
                      strokeWidth="6"
                      strokeDasharray="12,8"
                      strokeLinecap="round"
                      filter={isLit ? 'url(#path-glow)' : undefined}
                      opacity={isLit ? 1 : 0.8}
                    />
                  )
                })}
              </svg>

              {/* Level nodes — rendered top to bottom (level 1 at top) */}
              {levels.map((level, idx) => {
                const pos = NODE_POSITIONS[idx]
                const yFromTop = idx * nodeSpacing + 60
                const textSide = pos.textSide

                return (
                  <motion.div
                    key={level.id}
                    className="absolute"
                    style={{
                      top: yFromTop,
                      left: pos.x,
                      transform: 'translateX(-50%)',
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, type: 'spring' }}
                  >
                    <LevelNode
                      level={level}
                      status={getLevelStatus(level.id)}
                      isNewlyUnlocked={newlyUnlocked === level.id}
                      textSide={textSide}
                      onClick={() => handleNodeClick(level)}
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Desktop Right City Stats */}
        <div className="hidden lg:block w-64 shrink-0 z-10">
          <CityStatsPanel />
        </div>
      </div>

      {/* Level Intro Bottom Sheet */}
      <LevelIntroSheet
        level={selectedLevel}
        onStart={handleStartLevel}
        onClose={() => setSelectedLevel(null)}
      />

      {/* Profile Screen */}
      <AnimatePresence>
        {profileOpen && (
          <ProfileScreen onClose={() => setProfileOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
