'use client'

import Lottie from 'lottie-react'
import idleData from '../../public/mascot/mascot-idel.json'
import waveData from '../../public/mascot/mascot-wave 1 .json'
import wrongData from '../../public/mascot/mascot-wrong-answer.json'
import happyData from '../../public/mascot/mascot-happy .json'
import winnerData from '../../public/mascot/mascot-Winner.json'

export type MascotState = 'idle' | 'wave' | 'wrong' | 'happy' | 'winner'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MASCOT_DATA: Record<MascotState, any> = {
  idle: idleData,
  wave: waveData,
  wrong: wrongData,
  happy: happyData,
  winner: winnerData,
}

const LOOPING: Record<MascotState, boolean> = {
  idle: true,
  wave: false,
  wrong: false,
  happy: false,
  winner: true,
}

interface MascotAnimationProps {
  state: MascotState
  className?: string
  size?: number
  onComplete?: () => void
}

export default function MascotAnimation({
  state,
  className,
  size = 180,
  onComplete,
}: MascotAnimationProps) {
  const loop = LOOPING[state]
  return (
    <Lottie
      key={state}
      animationData={MASCOT_DATA[state]}
      loop={loop}
      onComplete={loop ? undefined : onComplete}
      className={className}
      style={{ width: size, height: size }}
    />
  )
}
