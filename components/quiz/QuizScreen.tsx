'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import type { Level, Question } from '@/types'
import RoadmapBackground from '@/components/ui/RoadmapBackground'
import MascotAnimation, { type MascotState } from '@/components/ui/MascotAnimation'
import Lottie from 'lottie-react'
import { useSounds } from '@/hooks/useSounds'
import { AnimatedLife } from '@/components/ui/AnimatedIcons'
import crossData from '../../public/assets/cross.json'

interface QuizScreenProps {
  level: Level
  onComplete: (coinsEarned: number) => void
  onGameOver: () => void
  onQuit: () => void
}

type AnswerState = 'idle' | 'correct' | 'wrong'

export default function QuizScreen({ level, onComplete, onGameOver, onQuit }: QuizScreenProps) {
  const { lives, loseLife, resetLives, addCoins, incrementStreak, resetStreak, completeLevel } = useGameStore()
  const { playCorrect, playWrong, playHeartLoss, playCoin, playTap } = useSounds()
  const [questionIdx, setQuestionIdx] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [localLives, setLocalLives] = useState(lives)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const [mascotState, setMascotState] = useState<MascotState>('idle')

  useEffect(() => {
    if (answerState === 'correct') setMascotState('happy')
    else if (answerState === 'wrong') setMascotState('wrong')
  }, [answerState])

  const handleMascotComplete = () => setMascotState('idle')

  const question: Question = level.questions[questionIdx]
  const progress = (questionIdx / level.questions.length) * 100

  const isCorrect = useCallback((optionIdx: number) => {
    if (question.type === 'true_false') {
      return optionIdx === 0 ? question.correct === true : question.correct === false
    }
    return optionIdx === question.correct
  }, [question])

  const handleAnswer = (optionIdx: number) => {
    if (answerState !== 'idle') return
    setSelectedOption(optionIdx)

    if (isCorrect(optionIdx)) {
      playCorrect()
      setAnswerState('correct')
      setShowExplanation(true)
      incrementStreak()
      setParticles([
        { id: Date.now(), x: 30, y: 50 },
        { id: Date.now() + 1, x: 60, y: 40 },
        { id: Date.now() + 2, x: 50, y: 60 },
        { id: Date.now() + 3, x: 70, y: 55 },
        { id: Date.now() + 4, x: 20, y: 45 },
      ])
      setTimeout(() => setParticles([]), 1200)
    } else {
      playWrong()
      setTimeout(() => playHeartLoss(), 180)
      setAnswerState('wrong')
      setShowExplanation(true)
      resetStreak()
      const newLives = localLives - 1
      setLocalLives(newLives)
      loseLife()
      if (newLives <= 0) {
        setTimeout(() => onGameOver(), 1800)
        return
      }
    }
  }

  const handleNext = () => {
    playTap()
    if (questionIdx + 1 >= level.questions.length) {
      playCoin()
      addCoins(level.coins)
      completeLevel(level.id)
      onComplete(level.coins)
    } else {
      setQuestionIdx((i) => i + 1)
      setAnswerState('idle')
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  const options: string[] =
    question.type === 'true_false'
      ? ['True ✅', 'False ❌']
      : question.options || []

  return (
    <div className="relative isolate min-h-screen flex flex-col overflow-hidden">
      <RoadmapBackground />

      {/* Top bar */}
      <div className="relative z-10 px-4 pt-4 pb-2 flex flex-col gap-2">
        {/* X button + progress bar row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { resetLives(); onQuit() }}
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold"
          >
            ✕
          </button>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-full h-4 shadow-inner overflow-hidden border border-white/20">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, #14b8a6, #22c55e)' }}
            initial={{ width: `${progress}%` }}
            animate={{ width: `${((questionIdx + (answerState === 'correct' ? 1 : 0)) / level.questions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </motion.div>
          </div>
        </div>

        {/* Level name + hearts */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
            <span>{level.icon}</span>
            <span className="text-xs font-bold text-white/90">{level.subtitle}</span>
          </div>

          {/* Lives */}
          <div className="flex gap-1 items-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: i === localLives + 1 && answerState === 'wrong' ? [1, 1.5, 0.8, 1] : 1,
                }}
                transition={{ duration: 0.4 }}
                style={{ opacity: i <= localLives ? 1 : 0.35 }}
              >
                <AnimatedLife active={i <= localLives} size={22} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Question counter */}
        <p className="text-center text-xs text-white/70 font-medium">
          Question {questionIdx + 1} of {level.questions.length}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pb-6 max-w-lg mx-auto w-full">

        {/* Mascot — reacts to correct/wrong answers */}
        <motion.div
          className="my-2"
          animate={{ y: answerState === 'wrong' ? [0, -5, 5, -5, 0] : 0 }}
          transition={{ duration: 0.4 }}
        >
          <MascotAnimation state={mascotState} size={100} onComplete={handleMascotComplete} />
        </motion.div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIdx}
            className="w-full bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl p-5 border border-amber-100 mb-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-900 font-bold text-lg leading-snug text-center">
              {question.question}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Answer options */}
        <div className={`w-full grid gap-3 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {options.map((option, i) => {
            const correct = isCorrect(i)
            const isSelected = selectedOption === i
            const revealed = answerState !== 'idle'

            let bgClass = 'bg-white/80 border-2 border-amber-100 text-gray-800'
            let borderStyle = {}

            if (revealed) {
              if (correct) {
                bgClass = 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800'
                borderStyle = { boxShadow: '0 0 0 3px rgba(16,185,129,0.3)' }
              } else if (isSelected && !correct) {
                bgClass = 'bg-red-100 border-2 border-red-400 text-red-800'
              } else {
                bgClass = 'bg-white/50 border-2 border-gray-200 text-gray-400'
              }
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answerState !== 'idle'}
                className={`relative w-full rounded-2xl px-4 py-3.5 font-bold text-base text-left transition-colors focus:outline-none ${bgClass}`}
                style={borderStyle}
                whileHover={answerState === 'idle' ? { scale: 1.02, y: -2 } : {}}
                whileTap={answerState === 'idle' ? { scale: 0.97 } : {}}
                animate={
                  isSelected && answerState === 'wrong'
                    ? { x: [0, -8, 8, -8, 8, 0] }
                    : isSelected && answerState === 'correct'
                      ? { scale: [1, 1.05, 1] }
                      : {}
                }
                transition={{ duration: 0.4 }}
              >
                {/* Option letter */}
                <span className="inline-block w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-sm font-black text-center leading-7 mr-2 shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}

                {/* Correct checkmark */}
                {revealed && correct && (
                  <motion.span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    ✓
                  </motion.span>
                )}

                {/* Wrong X */}
                {revealed && isSelected && !correct && (
                  <motion.div
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Lottie animationData={crossData} loop={false} style={{ width: 36, height: 36 }} />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Explanation + Next */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              className={`w-full mt-4 rounded-2xl p-4 ${answerState === 'correct' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl">{answerState === 'correct' ? '🎉' : '💡'}</span>
                <p className={`text-sm font-medium leading-relaxed ${answerState === 'correct' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {question.explanation}
                </p>
              </div>
              <motion.button
                onClick={handleNext}
                className={`w-full py-3 rounded-xl font-black text-white text-base border-b-4 ${
                  answerState === 'correct'
                    ? 'bg-emerald-500 border-emerald-700'
                    : 'bg-orange-500 border-orange-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97, y: 3, borderBottomWidth: '1px' }}
              >
                {questionIdx + 1 >= level.questions.length ? '🏆 Finish Level!' : 'Next Question →'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Particle effects */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="fixed pointer-events-none z-50 text-2xl"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 1, scale: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            ⭐
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
