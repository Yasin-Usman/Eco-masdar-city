# Masdar Eco-Builder

> A gamified sustainability quiz app set in Masdar City, UAE — built as a showcase of modern React/Next.js frontend engineering.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwind-css)
![Jest](https://img.shields.io/badge/Tests-187_passing-brightgreen?logo=jest)

**Live Demo:** _Deploy link coming soon_

---

## What It Is

Masdar Eco-Builder is a 5-level quiz game covering UAE clean energy science — solar, wind, water, electric vehicles, and reforestation. Players earn coins, build streaks, unlock levels, and climb a 6-tier rank system, all backed by a persistent game state layer and a full Lottie animation system.

The project is intentionally scoped to demonstrate the full range of a frontend UI engineering role: responsive layout, state architecture, animation orchestration, and a complete test suite — not just making things look good.

---

## Key Features

### Gamification Engine
A single Zustand store manages all game state: lives, coins, streaks, unlocked/completed levels, and player rank. Coins are awarded per correct answer, streaks multiply engagement, and levels gate-lock until prerequisites are met. Rank progresses through 6 tiers (Newcomer → Eco Master) based on completed level count.

### Mascot Animation State Machine
A reusable `MascotAnimation` component drives a Lottie-based character through context-aware state sequences:
- **Welcome screen**: `idle → wave → happy → idle` on a 3-second timer
- **Quiz screen**: `idle → correct/happy` or `idle → wrong` based on answer result, chained via `onComplete` callbacks
- **Game over**: `wrong → idle` (stays)
- **Roadmap**: `idle → wave → idle` on a repeating timer

Each state transition uses `key={state}` on the Lottie component to force unmount/remount, ensuring every animation plays from frame 0 with no mid-animation corruption.

### Persistent State with SSR Safety
Zustand's `persist` middleware is configured with `skipHydration: true`. A `HydrationProvider` wrapper calls `rehydrate()` client-side after mount, preventing React hydration mismatches between server-rendered HTML and localStorage-rehydrated state — a real pitfall in Next.js App Router apps.

### Responsive Layout
- **Mobile**: full-screen views with a bottom stats bar, bottom-sheet level intro, and a tap-to-open profile avatar
- **Desktop**: two-sidebar layout — city progress panel on the right, player stats/profile on the left — with the mascot centered in the map lane using `right: calc(50% + 196px)` to track the sidebar boundary across viewport widths

### Profile System
A full-screen profile overlay with editable player name (persisted to store), a streak hero card with a 7-bubble day visualizer, animated stat cards, and a level journey view showing per-level Lottie animations and unlock status.

### Screen Transitions
`AnimatePresence` + `motion` components manage fade/scale transitions between 5 screens: welcome, map, quiz, victory, and game over. All transitions run at 300ms with spring-eased exit animations.

### Test Suite
187 tests across 19 suites covering every component, hook, and store action.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16 |
| UI Library | React | 19 |
| Styling | Tailwind CSS | 4 |
| Language | TypeScript | 5 (strict) |
| State Management | Zustand with persist middleware | 5 |
| Animation (UI) | Framer Motion | 12 |
| Animation (Lottie) | lottie-react | 2.4 |
| Confetti | canvas-confetti | 1.9 |
| Testing | Jest + React Testing Library + jest-dom | 30 / 16 / 6 |

---

## Architecture Decisions

**Why Zustand over Redux Toolkit**
The game state is self-contained with no server sync requirements. Zustand's `setState` partial updates and direct `getState()` access made test setup trivial — each test resets state with a single `useGameStore.setState({...})` call. Redux would have added significant boilerplate with no benefit here.

**Why Lottie over CSS/SVG animations**
The mascot and icon assets are designer-produced JSON files with frame-accurate playback. Using `loop={false}` + the `onComplete` callback lets state machines chain animations without `setTimeout` — the component itself signals readiness for the next state.

**Why `key={state}` on Lottie**
Without forcing a remount, switching Lottie's `animationData` prop mid-play leaves the animation in an intermediate frame. The `key` prop tears down and recreates the component on state change, which is the correct React idiom for "reset this component to initial state."

**Why `skipHydration: true` on persist**
Next.js App Router renders on the server where `localStorage` doesn't exist. Without this flag, Zustand initializes from `localStorage` on the client and triggers a React hydration warning because the initial client tree differs from what the server rendered. The `HydrationProvider` defers rehydration to after the first client render.

---

## Project Structure

```
├── app/
│   └── page.tsx              # Single orchestrator: manages screen state + transitions
├── components/
│   ├── map/
│   │   ├── MapScreen.tsx     # Winding roadmap with level nodes, mascot, sidebars
│   │   ├── LevelNode.tsx     # Individual node (locked/unlocked/completed states)
│   │   └── LevelIntroSheet.tsx  # Bottom-sheet level preview before starting
│   ├── quiz/
│   │   ├── QuizScreen.tsx    # Question/answer flow with mascot feedback
│   │   ├── VictoryScreen.tsx # Completion screen with star Lottie + confetti
│   │   └── GameOverScreen.tsx # Lives-depleted screen with mascot
│   └── ui/
│       ├── MascotAnimation.tsx  # Reusable Lottie state machine
│       ├── ProfileScreen.tsx    # Gamified profile overlay
│       ├── DesktopSidebar.tsx   # Left sidebar: player stats + profile card
│       ├── CityStatsPanel.tsx   # Right sidebar: city building progress
│       ├── StatsBar.tsx         # Mobile top bar: lives, streak, coins
│       ├── CartoonAvatar.tsx    # Initials-based avatar with rank ring
│       ├── AnimatedIcons.tsx    # Lottie-wrapped icon components
│       ├── WelcomeScreen.tsx    # Landing screen with mascot
│       ├── RoadmapBackground.tsx
│       └── HydrationProvider.tsx
├── store/
│   └── gameStore.ts          # Single Zustand store (state + actions + persist)
├── data/
│   └── levels.json           # 5 levels × 5 questions with correct answer indices
├── hooks/
│   ├── useSounds.ts          # Web Audio API sound effects
│   └── useLevelData.ts       # Level data access with derived status
├── types/
│   └── index.ts              # GameState, GameActions, Level, Question
├── public/
│   ├── assets/               # 13 Lottie JSON files (buildings, icons, stars, locks)
│   └── mascot/               # 5 mascot state JSONs (idle, wave, happy, correct, wrong)
└── __tests__/                # Mirrors component structure, 19 test files
```

---

## Getting Started

```bash
git clone <repo-url>
cd ADEK
npm install
npm run dev        # → http://localhost:3000
```

```bash
npm test           # Run all 187 tests
npm run test:watch # Watch mode
npm run build      # Production build
npm run lint       # ESLint
```

---

## Testing

**187 tests · 19 suites · 0 failures**

| Scope | Files | What's covered |
|---|---|---|
| Store | `gameStore.test.ts` | All actions: coins, lives, streaks, unlocks, playerName |
| Hooks | `useSounds`, `useLevelData` | Return shapes, derived values |
| UI components | 10 files | Render, store integration, user interactions |
| Map components | 3 files | Level nodes, intro sheet, full MapScreen flow |
| Quiz components | 3 files | Answer selection, mascot states, victory/gameover flows |
| App orchestration | `page.test.tsx` | Screen transitions, screen-switching callbacks |

**Key mocking patterns:**
- `lottie-react` → renders a `<div data-testid="lottie">` stub
- `framer-motion` → strips all animation props, passes through children
- `useSounds` → all sound functions replaced with `jest.fn()`
- Zustand store reset per test: `useGameStore.setState({ ...initialState })`

---

## Screenshots

_Screenshots and demo GIF coming soon_

---

## About

Built by Yasin Usman as a frontend engineering showcase for the ADEK application.

Stack choices, architecture decisions, and the test suite are all deliberate demonstrations of production-grade frontend practice — not incidental to the feature set.
