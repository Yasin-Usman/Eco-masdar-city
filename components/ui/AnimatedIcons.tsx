'use client'

import Lottie from 'lottie-react'
import coinData from '../../public/assets/coin.json'
import fireData from '../../public/assets/Fire.json'
import heartPulseData from '../../public/assets/Heart Pulse.json'
import heartBrokenData from '../../public/assets/Heart to Broken Heart.json'

export type HeartState = 'active' | 'breaking' | 'empty'

// ─── LifeHeart ────────────────────────────────────────────────────────────────
// active   → Heart Pulse.json, looping
// breaking → Heart to Broken Heart.json, plays once then calls onBreakComplete
// empty    → Heart Pulse.json, frozen at frame 0, grayscale + 50% opacity
export function LifeHeart({
  state,
  size = 24,
  onBreakComplete,
}: {
  state: HeartState
  size?: number
  onBreakComplete?: () => void
}) {
  if (state === 'breaking') {
    return (
      <Lottie
        animationData={heartBrokenData}
        loop={false}
        onComplete={onBreakComplete}
        style={{ width: size, height: size, flexShrink: 0 }}
      />
    )
  }
  if (state === 'empty') {
    return (
      <div className="grayscale opacity-50" style={{ flexShrink: 0 }}>
        <Lottie
          animationData={heartPulseData}
          loop={false}
          autoplay={false}
          style={{ width: size, height: size }}
        />
      </div>
    )
  }
  // active
  return (
    <Lottie
      animationData={heartPulseData}
      loop
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  )
}

// ─── AnimatedLife ─────────────────────────────────────────────────────────────
// Backward-compatible wrapper used by QuizScreen, GameOverScreen, etc.
export function AnimatedLife({ active = true, size = 24 }: { active?: boolean; size?: number }) {
  return <LifeHeart state={active ? 'active' : 'empty'} size={size} />
}

// ─── AnimatedFire / Streak ────────────────────────────────────────────────────
export function AnimatedFire({ size = 22 }: { size?: number }) {
  return (
    <Lottie
      animationData={fireData}
      loop
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  )
}

// ─── AnimatedCoin ─────────────────────────────────────────────────────────────
export function AnimatedCoin({ size = 24 }: { size?: number }) {
  return (
    <Lottie
      animationData={coinData}
      loop
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  )
}
