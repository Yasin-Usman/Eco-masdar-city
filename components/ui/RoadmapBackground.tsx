'use client'

const STARS: Array<{ x: number; y: number; r: number; o: number }> = [
  { x: 45,  y: 30, r: 1.5, o: 0.85 },
  { x: 118, y: 18, r: 1.0, o: 0.65 },
  { x: 198, y: 44, r: 1.5, o: 0.75 },
  { x: 305, y: 12, r: 1.0, o: 0.90 },
  { x: 72,  y: 55, r: 1.0, o: 0.60 },
  { x: 158, y: 8,  r: 1.5, o: 0.80 },
  { x: 262, y: 38, r: 1.0, o: 0.70 },
  { x: 345, y: 22, r: 1.5, o: 0.85 },
  { x: 32,  y: 72, r: 1.0, o: 0.50 },
  { x: 138, y: 65, r: 1.0, o: 0.60 },
  { x: 228, y: 78, r: 1.5, o: 0.75 },
  { x: 315, y: 58, r: 1.0, o: 0.65 },
  { x: 88,  y: 88, r: 1.0, o: 0.50 },
  { x: 185, y: 92, r: 1.5, o: 0.70 },
  { x: 278, y: 80, r: 1.0, o: 0.60 },
  { x: 15,  y: 42, r: 1.5, o: 0.80 },
  { x: 365, y: 50, r: 1.0, o: 0.60 },
  { x: 95,  y: 15, r: 1.5, o: 0.90 },
  { x: 245, y: 25, r: 1.0, o: 0.70 },
  { x: 55,  y: 95, r: 1.0, o: 0.50 },
  { x: 175, y: 35, r: 1.5, o: 0.80 },
  { x: 330, y: 75, r: 1.0, o: 0.65 },
]

export default function RoadmapBackground() {
  const starBackground = STARS
    .map(({ x, y, r, o }) =>
      `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,255,255,${o}) 0%, transparent 100%)`
    )
    .join(', ')

  return (
    <div className="absolute inset-0 h-screen -z-10 overflow-hidden pointer-events-none">

      {/* Base vertical gradient: desert night → void → deep teal */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #1a1311 0%, #000000 50%, #082f37 100%)' }}
      />

      {/* Starfield — CSS radial gradients, upper 25% of page */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: '25%', background: starBackground }}
      />

      {/* Desert Dunes — smooth sand horizon between starfield and void */}
      <div className="absolute left-0 right-0" style={{ top: '18%', height: '14%' }}>
        <svg
          viewBox="0 0 800 80"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M 0 80 C 100 35 200 65 300 28 C 400 -8 500 55 600 22 C 700 -5 750 40 800 30 L 800 80 Z"
            fill="#2a1a08"
          />
          <path
            d="M 0 80 C 80 48 180 68 280 38 C 380 8 480 58 580 32 C 680 12 740 50 800 42 L 800 80 Z"
            fill="#1a1005"
          />
          <path
            d="M 0 80 C 70 58 170 72 270 55 C 370 38 470 68 570 50 C 670 32 730 60 800 55 L 800 80 Z"
            fill="#0d0903"
          />
        </svg>
      </div>

      {/* Neon Eco-City Skyline — bottom of viewport */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '18vh' }}>
        <svg
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <filter id="skyline-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Building mass */}
          <rect x="0"   y="55"  width="70"  height="65" fill="#0a2a2e" />
          <rect x="75"  y="75"  width="48"  height="45" fill="#0d3540" />
          <rect x="128" y="42"  width="60"  height="78" fill="#0a2a2e" />
          <rect x="193" y="65"  width="75"  height="55" fill="#0d3540" />
          <rect x="273" y="28"  width="55"  height="92" fill="#0a2a2e" />
          <rect x="333" y="58"  width="42"  height="62" fill="#0d3540" />
          <rect x="380" y="45"  width="65"  height="75" fill="#0a2a2e" />
          <rect x="450" y="68"  width="50"  height="52" fill="#0d3540" />
          <rect x="505" y="55"  width="55"  height="65" fill="#0a2a2e" />
          <rect x="615" y="70"  width="60"  height="50" fill="#0d3540" />
          <rect x="680" y="62"  width="55"  height="58" fill="#0a2a2e" />
          <rect x="740" y="78"  width="60"  height="42" fill="#0d3540" />

          {/* Wind tower — vertical pole, two horizontal arms, hub cap */}
          <rect x="568" y="11"  width="55"  height="5"  fill="#0d3540" />
          <rect x="570" y="32"  width="51"  height="4"  fill="#0d3540" />
          <rect x="592" y="8"   width="7"   height="112" fill="#0d3540" />
          <rect x="589" y="5"   width="13"  height="13" fill="#0f4050" />

          {/* Windows — low-opacity cyan hints */}
          <rect x="10"  y="62"  width="6" height="8" fill="rgba(0,220,200,0.14)" />
          <rect x="22"  y="62"  width="6" height="8" fill="rgba(0,220,200,0.10)" />
          <rect x="10"  y="76"  width="6" height="8" fill="rgba(0,220,200,0.12)" />
          <rect x="136" y="50"  width="6" height="8" fill="rgba(0,220,200,0.14)" />
          <rect x="148" y="50"  width="6" height="8" fill="rgba(0,220,200,0.10)" />
          <rect x="136" y="64"  width="6" height="8" fill="rgba(0,220,200,0.12)" />
          <rect x="280" y="36"  width="6" height="8" fill="rgba(0,220,200,0.15)" />
          <rect x="292" y="36"  width="6" height="8" fill="rgba(0,220,200,0.11)" />
          <rect x="280" y="50"  width="6" height="8" fill="rgba(0,220,200,0.13)" />
          <rect x="292" y="50"  width="6" height="8" fill="rgba(0,220,200,0.10)" />
          <rect x="390" y="53"  width="6" height="8" fill="rgba(0,220,200,0.12)" />
          <rect x="402" y="53"  width="6" height="8" fill="rgba(0,220,200,0.14)" />
          <rect x="512" y="62"  width="6" height="8" fill="rgba(0,220,200,0.12)" />
          <rect x="524" y="62"  width="6" height="8" fill="rgba(0,220,200,0.10)" />
          <rect x="622" y="78"  width="6" height="8" fill="rgba(0,220,200,0.12)" />
          <rect x="688" y="70"  width="6" height="8" fill="rgba(0,220,200,0.14)" />

          {/* Glowing roofline strips — filtered group */}
          <g filter="url(#skyline-glow)">
            <rect x="0"   y="55" width="70" height="4" fill="rgba(0,220,200,0.18)" />
            <rect x="128" y="42" width="60" height="4" fill="rgba(0,220,200,0.20)" />
            <rect x="273" y="28" width="55" height="4" fill="rgba(0,220,200,0.24)" />
            <rect x="380" y="45" width="65" height="4" fill="rgba(0,220,200,0.18)" />
            <rect x="505" y="55" width="55" height="4" fill="rgba(0,220,200,0.18)" />
            <rect x="568" y="11" width="55" height="4" fill="rgba(0,220,200,0.22)" />
            <rect x="589" y="5"  width="13" height="5" fill="rgba(0,220,200,0.30)" />
            <rect x="680" y="62" width="55" height="4" fill="rgba(0,220,200,0.18)" />
          </g>
        </svg>
      </div>
    </div>
  )
}
