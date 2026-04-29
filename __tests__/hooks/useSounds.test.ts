import { renderHook, act } from '@testing-library/react'
import { useSounds } from '@/hooks/useSounds'

const mockOscillator = {
  connect: jest.fn(),
  type: '' as OscillatorType,
  frequency: {
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
  },
  start: jest.fn(),
  stop: jest.fn(),
}

const mockGain = {
  connect: jest.fn(),
  gain: {
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
  },
}

const mockAudioContext = {
  createOscillator: jest.fn().mockReturnValue(mockOscillator),
  createGain: jest.fn().mockReturnValue(mockGain),
  destination: {},
  currentTime: 0,
  state: 'running' as AudioContextState,
  resume: jest.fn(),
}

global.AudioContext = jest.fn().mockImplementation(() => mockAudioContext) as unknown as typeof AudioContext

beforeEach(() => {
  jest.clearAllMocks()
  mockAudioContext.state = 'running'
})

describe('useSounds', () => {
  it('returns all expected sound functions', () => {
    const { result } = renderHook(() => useSounds())
    expect(typeof result.current.playTap).toBe('function')
    expect(typeof result.current.playNodeClick).toBe('function')
    expect(typeof result.current.playCorrect).toBe('function')
    expect(typeof result.current.playWrong).toBe('function')
    expect(typeof result.current.playHeartLoss).toBe('function')
    expect(typeof result.current.playLevelStart).toBe('function')
    expect(typeof result.current.playVictory).toBe('function')
    expect(typeof result.current.playCoin).toBe('function')
    expect(typeof result.current.playSlide).toBe('function')
  })

  it('playTap creates an oscillator and gain node', () => {
    const { result } = renderHook(() => useSounds())
    act(() => { result.current.playTap() })
    expect(mockAudioContext.createOscillator).toHaveBeenCalled()
    expect(mockAudioContext.createGain).toHaveBeenCalled()
  })

  it('playCorrect creates multiple oscillators for arpeggio effect', () => {
    const { result } = renderHook(() => useSounds())
    act(() => { result.current.playCorrect() })
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(3)
  })

  it('playWrong creates two oscillators for descending buzz', () => {
    const { result } = renderHook(() => useSounds())
    act(() => { result.current.playWrong() })
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2)
  })

  it('playNodeClick creates two oscillators', () => {
    const { result } = renderHook(() => useSounds())
    act(() => { result.current.playNodeClick() })
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2)
  })

  it('playVictory creates multiple oscillators for fanfare', () => {
    const { result } = renderHook(() => useSounds())
    act(() => { result.current.playVictory() })
    // 4 notes + 3 chord notes = 7
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(7)
  })

  it('resumes AudioContext if suspended before playing', () => {
    mockAudioContext.state = 'suspended'
    const { result } = renderHook(() => useSounds())
    act(() => { result.current.playTap() })
    expect(mockAudioContext.resume).toHaveBeenCalled()
  })

  it('all sounds are callable without throwing', () => {
    const { result } = renderHook(() => useSounds())
    expect(() => {
      act(() => {
        result.current.playTap()
        result.current.playNodeClick()
        result.current.playCorrect()
        result.current.playWrong()
        result.current.playHeartLoss()
        result.current.playLevelStart()
        result.current.playVictory()
        result.current.playCoin()
        result.current.playSlide()
      })
    }).not.toThrow()
  })
})
