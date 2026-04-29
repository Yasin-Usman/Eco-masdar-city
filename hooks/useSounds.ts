'use client'

import { useCallback, useRef } from 'react'

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!window.AudioContext && !(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  return new Ctor()
}

function playTone(
  ctx: AudioContext,
  freq: number,
  endFreq: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'sine',
  startAt = 0,
) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()

  osc.connect(gainNode)
  gainNode.connect(ctx.destination)

  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt)
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + startAt + duration)

  gainNode.gain.setValueAtTime(0, ctx.currentTime + startAt)
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startAt + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration)

  osc.start(ctx.currentTime + startAt)
  osc.stop(ctx.currentTime + startAt + duration + 0.05)
}

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getAudioCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = getCtx()
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  // Soft button tap — for general buttons and nav
  const playTap = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    playTone(ctx, 680, 520, 0.09, 0.22, 'sine')
  }, [getAudioCtx])

  // Map node click — slightly deeper pop
  const playNodeClick = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    playTone(ctx, 520, 420, 0.12, 0.28, 'sine')
    playTone(ctx, 780, 780, 0.08, 0.12, 'sine', 0.04)
  }, [getAudioCtx])

  // Correct answer — ascending two-note chime
  const playCorrect = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    // C5 → E5 → G5 quick arpeggio
    playTone(ctx, 523, 523, 0.14, 0.35, 'sine', 0)
    playTone(ctx, 659, 659, 0.14, 0.35, 'sine', 0.12)
    playTone(ctx, 784, 784, 0.22, 0.35, 'sine', 0.24)
  }, [getAudioCtx])

  // Wrong answer — low descending buzz
  const playWrong = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    playTone(ctx, 260, 180, 0.18, 0.18, 'square', 0)
    playTone(ctx, 200, 140, 0.18, 0.12, 'square', 0.16)
  }, [getAudioCtx])

  // Heart loss — thud impact
  const playHeartLoss = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    playTone(ctx, 120, 55, 0.25, 0.3, 'triangle', 0)
    playTone(ctx, 80, 40, 0.2, 0.15, 'sine', 0.05)
  }, [getAudioCtx])

  // Level start — energetic rising whoosh
  const playLevelStart = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    playTone(ctx, 300, 900, 0.25, 0.2, 'sine', 0)
    playTone(ctx, 392, 392, 0.15, 0.3, 'sine', 0.22)
    playTone(ctx, 587, 587, 0.2, 0.35, 'sine', 0.34)
  }, [getAudioCtx])

  // Victory — triumphant ascending fanfare
  const playVictory = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      playTone(ctx, freq, freq, 0.18, 0.4, 'sine', i * 0.14)
    })
    // Final chord
    playTone(ctx, 1047, 1047, 0.5, 0.35, 'sine', 0.65)
    playTone(ctx, 784, 784, 0.5, 0.25, 'sine', 0.65)
    playTone(ctx, 659, 659, 0.5, 0.2, 'sine', 0.65)
  }, [getAudioCtx])

  // Coin collect — bright high ping
  const playCoin = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    playTone(ctx, 880, 1200, 0.1, 0.25, 'sine', 0)
    playTone(ctx, 1100, 1400, 0.1, 0.2, 'sine', 0.08)
  }, [getAudioCtx])

  // Sheet slide in — soft whoosh
  const playSlide = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    playTone(ctx, 180, 320, 0.2, 0.1, 'sine', 0)
  }, [getAudioCtx])

  return {
    playTap,
    playNodeClick,
    playCorrect,
    playWrong,
    playHeartLoss,
    playLevelStart,
    playVictory,
    playCoin,
    playSlide,
  }
}
