'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { useGameStore } from '@/store/gameStore'
import { AnimatedCoin, AnimatedFire, AnimatedLife } from '@/components/ui/AnimatedIcons'
import CartoonAvatar from '@/components/ui/CartoonAvatar'
import solarData  from '../../public/assets/Solar Panel.json'
import windData   from '../../public/assets/Wind Energy turbine.json'
import waterData  from '../../public/assets/Water Animation.json'
import evCarData  from '../../public/assets/ev car charging.json'
import treeData   from '../../public/assets/Tree in the wind.json'
import starsData  from '../../public/assets/5 stars.json'
import lockData   from '../../public/assets/Teasing lock - closed.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LEVEL_LOTTIE: Record<number, any> = {
  1: solarData, 2: windData, 3: waterData, 4: evCarData, 5: treeData,
}

const LEVEL_META = [
  { id: 1, title: 'Catch the Sun!',    subtitle: 'Solar Harvesting',  color: '#f59e0b' },
  { id: 2, title: 'Ride the Wind!',    subtitle: 'Wind Dynamics',     color: '#14b8a6' },
  { id: 3, title: 'Save Every Drop!',  subtitle: 'Water Wisdom',      color: '#3b82f6' },
  { id: 4, title: 'Electric Streets!', subtitle: 'EV Mobility',       color: '#a855f7' },
  { id: 5, title: 'Green City Rise!',  subtitle: 'Urban Nature',      color: '#22c55e' },
]

const RANKS = [
  { min: 0, label: 'Newcomer',       color: '#6b7280', glow: 'rgba(107,114,128,0.4)' },
  { min: 1, label: 'Solar Pioneer',  color: '#f59e0b', glow: 'rgba(245,158,11,0.45)' },
  { min: 2, label: 'Wind Rider',     color: '#14b8a6', glow: 'rgba(20,184,166,0.45)' },
  { min: 3, label: 'Water Guardian', color: '#3b82f6', glow: 'rgba(59,130,246,0.45)' },
  { min: 4, label: 'EV Champion',    color: '#a855f7', glow: 'rgba(168,85,247,0.45)' },
  { min: 5, label: 'Eco Master',     color: '#00d4aa', glow: 'rgba(0,212,170,0.55)' },
]

function getRank(completed: number) {
  return [...RANKS].reverse().find(r => completed >= r.min) ?? RANKS[0]
}

const CARD = {
  background: 'linear-gradient(160deg, #252528 0%, #1c1c1e 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.6)',
}

interface ProfileScreenProps { onClose: () => void }

export default function ProfileScreen({ onClose }: ProfileScreenProps) {
  const { playerName, setPlayerName, coins, currentStreak, completedLevels, lives } = useGameStore()
  const [draftName, setDraftName] = useState(playerName)
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const rank     = getRank(completedLevels.length)
  const progress = (completedLevels.length / 5) * 100

  const handleSave = () => {
    const trimmed = draftName.trim()
    if (trimmed) { setPlayerName(trimmed); setSaved(true); setTimeout(() => setSaved(false), 1800) }
    setIsEditing(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setDraftName(playerName); setIsEditing(false) }
  }

  // Achievements
  const achievements = [
    { id: 'first',    icon: '🌱', label: 'First Step',      desc: 'Complete level 1',      unlocked: completedLevels.length >= 1 },
    { id: 'streak5',  icon: '🔥', label: 'On Fire',         desc: 'Reach a 5-day streak',  unlocked: currentStreak >= 5 },
    { id: 'halfway',  icon: '🌿', label: 'Halfway There',   desc: 'Complete 3 levels',     unlocked: completedLevels.length >= 3 },
    { id: 'coins100', icon: '💰', label: 'Coin Hoarder',    desc: 'Collect 100 coins',     unlocked: coins >= 100 },
    { id: 'master',   icon: '🏆', label: 'Eco Master',      desc: 'Complete all 5 levels', unlocked: completedLevels.length >= 5 },
    { id: 'streak10', icon: '⚡', label: 'Unstoppable',     desc: 'Reach a 10-day streak', unlocked: currentStreak >= 10 },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto"
      style={{ background: '#0f1117' }}
      initial={{ opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 56 }}
      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
    >
      {/* ── HEADER BANNER ── */}
      <div
        className="relative shrink-0 px-5 pt-12 pb-8 flex flex-col items-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${rank.color}28 0%, #12151d 100%)`,
          borderBottom: `1px solid ${rank.color}25`,
        }}
      >
        {/* Decorative glow blob behind avatar */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: rank.glow, filter: 'blur(48px)', opacity: 0.45 }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-base z-10"
        >
          ✕
        </button>

        {/* Avatar */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, delay: 0.05 }}
        >
          <div
            className="rounded-full"
            style={{
              boxShadow: `0 0 0 4px ${rank.color}55, 0 0 36px ${rank.glow}, 0 8px 32px rgba(0,0,0,0.7)`,
            }}
          >
            <CartoonAvatar name={playerName} size={96} />
          </div>

          {/* Rank crown/icon badge on avatar */}
          <div
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-base border-2"
            style={{ background: rank.color, borderColor: '#0f1117' }}
          >
            {completedLevels.length === 5 ? '🏆' : completedLevels.length >= 3 ? '🌿' : completedLevels.length >= 1 ? '⚡' : '🌱'}
          </div>
        </motion.div>

        {/* Name + edit */}
        <div className="relative z-10 mt-4 flex flex-col items-center gap-1 w-full max-w-xs">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="edit" className="flex flex-col items-center gap-2 w-56"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <input
                  autoFocus value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  onKeyDown={handleKeyDown} maxLength={24}
                  className="w-full text-center text-lg font-black text-white bg-white/10 border border-teal-500/50 rounded-xl px-4 py-2 focus:outline-none focus:border-teal-400"
                  placeholder="Your name"
                />
                <div className="flex gap-2 w-full">
                  <button onClick={() => { setDraftName(playerName); setIsEditing(false) }}
                    className="flex-1 py-2 rounded-xl text-sm font-bold text-white/40 bg-white/5 border border-white/10">
                    Cancel
                  </button>
                  <button onClick={handleSave}
                    className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-teal-500 border-b-2 border-teal-700">
                    Save
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="display" className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <p className="text-2xl font-black text-white">{playerName}</p>
                <button onClick={() => setIsEditing(true)}
                  className="text-[11px] font-semibold text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
                  ✎ Edit name
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {saved && (
              <motion.p className="text-xs text-emerald-400 font-semibold"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Saved!
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Rank chip */}
        <motion.div
          className="relative z-10 mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: `${rank.color}18`,
            border: `1px solid ${rank.color}50`,
            boxShadow: `0 0 12px ${rank.glow}`,
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: rank.color, boxShadow: `0 0 6px ${rank.color}` }} />
          <span className="text-sm font-black" style={{ color: rank.color }}>{rank.label}</span>
          {completedLevels.length < 5 && (
            <span className="text-[10px] font-medium text-white/30 ml-1">
              · {5 - completedLevels.length} to next
            </span>
          )}
        </motion.div>

        {/* City progress bar in header */}
        <motion.div
          className="relative z-10 mt-4 w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">City Progress</span>
            <span className="text-[10px] font-black" style={{ color: rank.color }}>{completedLevels.length} / 5</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${rank.color}aa, ${rank.color})` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-col items-center px-5 pt-5 pb-12 gap-4 max-w-sm mx-auto w-full">

        {/* Quick stats row */}
        <motion.div
          className="w-full grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: <AnimatedFire size={32} />,       value: currentStreak, label: 'Streak',  color: '#ff9500' },
            { icon: <AnimatedCoin size={32} />,       value: coins,         label: 'Coins',   color: '#f59e0b' },
            { icon: <div className="flex gap-0.5">{[0,1,2].map(i => <AnimatedLife key={i} active={i < lives} size={20} />)}</div>,
              value: lives, label: 'Lives', color: '#f43f5e' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl"
              style={CARD}>
              {stat.icon}
              <p className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Streak fire bar */}
        <motion.div
          className="w-full px-4 py-4"
          style={{
            ...CARD,
            border: currentStreak > 0 ? '1px solid rgba(255,149,0,0.25)' : '1px solid rgba(255,255,255,0.07)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Streak Progress</p>
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const lit = i < Math.min(currentStreak, 7)
              return (
                <motion.div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full h-2 rounded-full"
                    style={{ background: lit ? '#ff9500' : 'rgba(255,255,255,0.08)', boxShadow: lit ? '0 0 6px #ff9500' : 'none' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  />
                  <span className="text-[9px] text-white/20 font-medium">{i + 1}</span>
                </motion.div>
              )
            })}
          </div>
          <p className="text-xs font-semibold mt-2" style={{ color: currentStreak > 0 ? '#ff9500' : '#3a3a3a' }}>
            {currentStreak === 0 ? 'Start a streak today!' : currentStreak >= 10 ? 'Absolutely on fire! 🔥' : currentStreak >= 5 ? 'Keep it up!' : 'Great start!'}
          </p>
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2.5">Achievements</p>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl text-center"
                style={{
                  ...CARD,
                  opacity: a.unlocked ? 1 : 0.35,
                  border: a.unlocked ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.04)',
                  boxShadow: a.unlocked
                    ? 'inset 0 1px 0 rgba(255,255,255,0.07), 0 0 12px rgba(0,212,170,0.1), 0 4px 16px rgba(0,0,0,0.5)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: a.unlocked ? 1 : 0.35, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05, type: 'spring' }}
              >
                <span className="text-2xl">{a.unlocked ? a.icon : '🔒'}</span>
                <p className="text-[10px] font-black text-white/80 leading-tight">{a.label}</p>
                <p className="text-[9px] text-white/30 leading-tight">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Level journey */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2.5">Level Journey</p>
          <div className="flex flex-col gap-2">
            {LEVEL_META.map((lvl, i) => {
              const done   = completedLevels.includes(lvl.id)
              const active = !done && (i === 0 || completedLevels.includes(lvl.id - 1))
              return (
                <motion.div
                  key={lvl.id}
                  className="flex items-center gap-3 px-3 py-2.5"
                  style={{
                    ...CARD,
                    border: done ? `1px solid ${lvl.color}50` : active ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.04)',
                    opacity: active || done ? 1 : 0.4,
                  }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: active || done ? 1 : 0.4, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                >
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                    {done ? (
                      <Lottie animationData={LEVEL_LOTTIE[lvl.id]} loop style={{ width: 40, height: 40 }} />
                    ) : active ? (
                      <Lottie animationData={LEVEL_LOTTIE[lvl.id]} loop style={{ width: 40, height: 40, filter: 'grayscale(30%)' }} />
                    ) : (
                      <Lottie animationData={lockData} loop style={{ width: 34, height: 34 }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate">{lvl.title}</p>
                    <p className="text-[10px] text-white/35 font-medium">{lvl.subtitle}</p>
                  </div>
                  <div className="shrink-0">
                    {done ? (
                      <Lottie animationData={starsData} loop style={{ width: 36, height: 36 }} />
                    ) : active ? (
                      <motion.div className="w-2.5 h-2.5 rounded-full"
                        style={{ background: '#14b8a6', boxShadow: '0 0 8px #14b8a6' }}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8 }} />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
