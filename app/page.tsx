'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import WelcomeScreen from '@/components/ui/WelcomeScreen'
import MapScreen from '@/components/map/MapScreen'
import QuizScreen from '@/components/quiz/QuizScreen'
import VictoryScreen from '@/components/quiz/VictoryScreen'
import GameOverScreen from '@/components/quiz/GameOverScreen'
import type { Level } from '@/types'

type AppScreen = 'welcome' | 'map' | 'quiz' | 'victory' | 'gameover'

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
}

export default function Home() {
  const { hydrated } = useGameStore()
  const [screen, setScreen] = useState<AppScreen>('welcome')
  const [activeLevel, setActiveLevel] = useState<Level | null>(null)
  const [coinsEarned, setCoinsEarned] = useState(0)

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#121212' }}>
        <div
          className="w-10 h-10 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin"
        />
      </div>
    )
  }

  const handleStartLevel = (level: Level) => {
    setActiveLevel(level)
    setScreen('quiz')
  }

  const handleQuizComplete = (earned: number) => {
    setCoinsEarned(earned)
    setScreen('victory')
  }

  const handleGameOver = () => {
    setScreen('gameover')
  }

  const handleBackToMap = () => {
    setActiveLevel(null)
    setScreen('map')
  }

  const handleRetry = () => {
    setScreen('quiz')
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'welcome' && (
        <motion.div key="welcome" {...pageVariants} transition={{ duration: 0.3 }}>
          <WelcomeScreen onStart={() => setScreen('map')} />
        </motion.div>
      )}

      {screen === 'map' && (
        <motion.div key="map" {...pageVariants} transition={{ duration: 0.3 }}>
          <MapScreen onStartLevel={handleStartLevel} />
        </motion.div>
      )}

      {screen === 'quiz' && activeLevel && (
        <motion.div key={`quiz-${activeLevel.id}`} {...pageVariants} transition={{ duration: 0.3 }}>
          <QuizScreen
            level={activeLevel}
            onComplete={handleQuizComplete}
            onGameOver={handleGameOver}
            onQuit={handleBackToMap}
          />
        </motion.div>
      )}

      {screen === 'victory' && activeLevel && (
        <motion.div key="victory" {...pageVariants} transition={{ duration: 0.3 }}>
          <VictoryScreen
            level={activeLevel}
            coinsEarned={coinsEarned}
            onBackToMap={handleBackToMap}
          />
        </motion.div>
      )}

      {screen === 'gameover' && activeLevel && (
        <motion.div key="gameover" {...pageVariants} transition={{ duration: 0.3 }}>
          <GameOverScreen
            level={activeLevel}
            onRetry={handleRetry}
            onBackToMap={handleBackToMap}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
