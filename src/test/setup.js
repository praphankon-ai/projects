import '@testing-library/jest-dom'

// ── Canvas stub ──────────────────────────────────────────────────────────────
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  set fillStyle(_) {},
  set strokeStyle(_) {},
  set lineWidth(_) {},
  set font(_) {},
  set textAlign(_) {},
  set textBaseline(_) {},
  set shadowColor(_) {},
  set shadowBlur(_) {},
  set shadowOffsetX(_) {},
  set shadowOffsetY(_) {},
}))

// ── Web Audio API stub ────────────────────────────────────────────────────────
window.AudioContext = vi.fn(() => ({
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { setValueAtTime: vi.fn() },
    type: '',
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  })),
  destination: {},
  currentTime: 0,
}))
window.webkitAudioContext = window.AudioContext

// ── document.fonts.ready stub ─────────────────────────────────────────────────
Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve() },
  writable: true,
})

// ── window.confirm / alert / open stubs ──────────────────────────────────────
window.confirm = vi.fn(() => true)
window.alert = vi.fn()
window.open = vi.fn(() => ({
  document: { write: vi.fn(), close: vi.fn() },
}))

// ── localStorage: clear between tests ────────────────────────────────────────
beforeEach(() => {
  localStorage.clear()
})
