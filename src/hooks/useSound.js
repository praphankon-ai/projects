import { useRef, useCallback } from 'react'

export default function useSound() {
  const audioCtxRef = useRef(null)

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  // Short tick used as wheel segments pass the pointer
  const playTick = useCallback(() => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 900
      const t = ctx.currentTime
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
      osc.start(t)
      osc.stop(t + 0.04)
    } catch {}
  }, [])

  // Ascending major arpeggio played when winner is revealed
  const playWin = useCallback(() => {
    try {
      const ctx = getCtx()
      const notes = [261.63, 329.63, 392.0, 523.25] // C4 E4 G4 C5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const start = ctx.currentTime + i * 0.13
        gain.gain.setValueAtTime(0.4, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5)
        osc.start(start)
        osc.stop(start + 0.5)
      })
    } catch {}
  }, [])

  return { playTick, playWin }
}
