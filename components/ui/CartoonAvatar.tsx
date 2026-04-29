'use client'

import React from 'react'

function hashName(name: string) {
  let h = 5381
  for (let i = 0; i < name.length; i++) {
    h = (((h << 5) + h) + name.charCodeAt(i)) & 0x7fffffff
  }
  return h
}

const AVATARS = [
  // 0 — Sunny (yellow spiky hair, peach face)
  <svg key="0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#FFF9C4"/>
    <ellipse cx="50" cy="32" rx="26" ry="14" fill="#FFB300"/>
    <polygon points="20,38 12,10 30,32" fill="#FFB300"/>
    <polygon points="42,25 46,4 54,25" fill="#FFB300"/>
    <polygon points="68,30 74,7 78,30" fill="#FFB300"/>
    <circle cx="50" cy="58" r="29" fill="#FFCC80"/>
    <circle cx="40" cy="53" r="5" fill="white"/>
    <circle cx="60" cy="53" r="5" fill="white"/>
    <circle cx="40" cy="54" r="3.2" fill="#1a1a1a"/>
    <circle cx="60" cy="54" r="3.2" fill="#1a1a1a"/>
    <circle cx="41" cy="52.5" r="1.2" fill="white"/>
    <circle cx="61" cy="52.5" r="1.2" fill="white"/>
    <ellipse cx="32" cy="63" rx="5.5" ry="4" fill="#FF8A65" opacity="0.5"/>
    <ellipse cx="68" cy="63" rx="5.5" ry="4" fill="#FF8A65" opacity="0.5"/>
    <path d="M36 67 Q50 80 64 67" stroke="#795548" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>,

  // 1 — Breezy (cloud hair, blue face, sunglasses)
  <svg key="1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#E3F2FD"/>
    <circle cx="34" cy="30" r="13" fill="white"/>
    <circle cx="50" cy="22" r="15" fill="white"/>
    <circle cx="66" cy="30" r="13" fill="white"/>
    <rect x="28" y="30" width="44" height="12" fill="white"/>
    <circle cx="50" cy="60" r="28" fill="#B3E5FC"/>
    <rect x="30" y="51" width="16" height="11" rx="5.5" fill="#0277BD"/>
    <rect x="54" y="51" width="16" height="11" rx="5.5" fill="#0277BD"/>
    <line x1="46" y1="56" x2="54" y2="56" stroke="#01579B" strokeWidth="2"/>
    <line x1="30" y1="56" x2="25" y2="54" stroke="#01579B" strokeWidth="1.5"/>
    <line x1="70" y1="56" x2="75" y2="54" stroke="#01579B" strokeWidth="1.5"/>
    <path d="M43 71 Q52 78 63 69" stroke="#0277BD" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>,

  // 2 — Leafy (leaf crown, green face)
  <svg key="2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#E8F5E9"/>
    <ellipse cx="36" cy="26" rx="12" ry="18" fill="#388E3C" transform="rotate(-25 36 26)"/>
    <ellipse cx="50" cy="18" rx="10" ry="18" fill="#43A047"/>
    <ellipse cx="64" cy="26" rx="12" ry="18" fill="#2E7D32" transform="rotate(25 64 26)"/>
    <circle cx="50" cy="60" r="28" fill="#A5D6A7"/>
    <path d="M36 55 Q40 50 44 55" stroke="#1B5E20" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M56 55 Q60 50 64 55" stroke="#1B5E20" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="33" cy="65" rx="5" ry="4" fill="#66BB6A" opacity="0.6"/>
    <ellipse cx="67" cy="65" rx="5" ry="4" fill="#66BB6A" opacity="0.6"/>
    <path d="M37 71 Q50 83 63 71" stroke="#1B5E20" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="71" cy="45" r="4" fill="#FFF176"/>
    <circle cx="71" cy="45" r="2" fill="#FFC107"/>
  </svg>,

  // 3 — Cosmic (purple zigzag hair, lavender face)
  <svg key="3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#EDE7F6"/>
    <polygon points="24,40 18,8 32,36 26,8 40,34 34,8 50,32 42,8 58,32 50,8 66,34 60,8 74,36 68,8 82,40" fill="#6A1B9A"/>
    <ellipse cx="50" cy="38" rx="27" ry="8" fill="#7B1FA2"/>
    <circle cx="50" cy="62" r="27" fill="#CE93D8"/>
    <circle cx="40" cy="57" r="5" fill="white"/>
    <circle cx="60" cy="57" r="5" fill="white"/>
    <circle cx="40" cy="58" r="3" fill="#4A148C"/>
    <circle cx="60" cy="58" r="3" fill="#4A148C"/>
    <circle cx="41.5" cy="56.5" r="1.2" fill="white"/>
    <circle cx="61.5" cy="56.5" r="1.2" fill="white"/>
    <ellipse cx="32" cy="66" rx="5" ry="4" fill="#AB47BC" opacity="0.45"/>
    <ellipse cx="68" cy="66" rx="5" ry="4" fill="#AB47BC" opacity="0.45"/>
    <path d="M38 70 Q50 82 62 70" stroke="#4A148C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="22" cy="29" r="2.5" fill="#FFD700"/>
    <circle cx="78" cy="33" r="2" fill="#FFD700"/>
    <circle cx="82" cy="22" r="1.5" fill="#FFD700"/>
  </svg>,

  // 4 — Desert (white keffiyeh + agal, UAE-themed, warm tan face)
  <svg key="4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#FFF8E1"/>
    <ellipse cx="50" cy="28" rx="30" ry="20" fill="white"/>
    <path d="M20 28 Q14 46 20 62 Q25 70 32 66 Q26 54 26 38Z" fill="white"/>
    <path d="M80 28 Q86 46 80 62 Q75 70 68 66 Q74 54 74 38Z" fill="white"/>
    <ellipse cx="50" cy="30" rx="22" ry="5.5" fill="#1a1a1a" opacity="0.88"/>
    <ellipse cx="50" cy="27" rx="20" ry="5" fill="#1a1a1a" opacity="0.82"/>
    <circle cx="50" cy="64" r="26" fill="#FFCC80"/>
    <circle cx="41" cy="60" r="5" fill="white"/>
    <circle cx="59" cy="60" r="5" fill="white"/>
    <circle cx="41" cy="61" r="3.2" fill="#1a1a1a"/>
    <circle cx="59" cy="61" r="3.2" fill="#1a1a1a"/>
    <circle cx="42" cy="59.5" r="1.2" fill="white"/>
    <circle cx="60" cy="59.5" r="1.2" fill="white"/>
    <ellipse cx="33" cy="68" rx="5" ry="3.5" fill="#FF8A65" opacity="0.3"/>
    <ellipse cx="67" cy="68" rx="5" ry="3.5" fill="#FF8A65" opacity="0.3"/>
    <path d="M39 73 Q50 84 61 73" stroke="#795548" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>,

  // 5 — Blaze (flame hair, orange/red, pink face)
  <svg key="5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#FBE9E7"/>
    <path d="M28 42 Q24 26 30 14 Q33 22 38 18 Q36 30 42 24 Q43 34 50 28 Q57 34 58 24 Q64 30 62 18 Q67 22 70 14 Q76 26 72 42 Q68 52 50 52 Q32 52 28 42Z" fill="#FF5722"/>
    <path d="M32 44 Q30 30 36 20 Q38 30 44 26 Q44 36 50 30 Q56 36 56 26 Q62 30 64 20 Q70 30 68 44 Q64 54 50 54 Q36 54 32 44Z" fill="#FF8A65"/>
    <path d="M38 46 Q37 36 42 28 Q43 38 48 34 Q49 42 54 38 Q56 44 64 46 Q60 54 50 56 Q38 56 38 46Z" fill="#FFAB76"/>
    <circle cx="50" cy="66" r="26" fill="#FFAB91"/>
    <circle cx="41" cy="62" r="5" fill="white"/>
    <circle cx="59" cy="62" r="5" fill="white"/>
    <circle cx="41" cy="63" r="3.2" fill="#1a1a1a"/>
    <circle cx="59" cy="63" r="3.2" fill="#1a1a1a"/>
    <circle cx="42" cy="61.5" r="1.2" fill="white"/>
    <circle cx="60" cy="61.5" r="1.2" fill="white"/>
    <ellipse cx="33" cy="70" rx="5" ry="3.5" fill="#FF5722" opacity="0.4"/>
    <ellipse cx="67" cy="70" rx="5" ry="3.5" fill="#FF5722" opacity="0.4"/>
    <path d="M39 75 Q50 86 61 75" stroke="#BF360C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>,
]

interface CartoonAvatarProps {
  name: string
  size?: number
  className?: string
}

export default function CartoonAvatar({ name, size = 64, className = '' }: CartoonAvatarProps) {
  const idx = hashName(name || 'player') % AVATARS.length
  const avatar = AVATARS[idx]
  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {React.cloneElement(avatar, { width: size, height: size })}
    </div>
  )
}
