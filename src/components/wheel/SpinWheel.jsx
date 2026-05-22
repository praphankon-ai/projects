import { useRef, useEffect, useCallback, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import i18n from '../../constants/i18n.js'
import useSound from '../../hooks/useSound.js'

// Premium vibrant color palette — base colors
const SEG_COLORS = [
  ['#FF6B6B', '#C0392B'],
  ['#FF922B', '#E67E22'],
  ['#FFD43B', '#F39C12'],
  ['#51CF66', '#27AE60'],
  ['#339AF0', '#2980B9'],
  ['#845EF7', '#7D3C98'],
  ['#F06595', '#C0392B'],
  ['#20C997', '#17A589'],
  ['#FF6348', '#C0392B'],
  ['#5C7CFA', '#2471A3'],
]

const TAU = 2 * Math.PI
const SIZE = 480

export default function SpinWheel({ selectedPrizeId, onWin }) {
  const canvasRef = useRef(null)
  const rotationRef = useRef(0)
  const animFrameRef = useRef(null)
  const drawRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const { participants, lang } = useApp()
  const t = i18n[lang]
  const { playTick, playWin } = useSound()

  const eligible = participants.filter(p => p.isEligible)
  const n = eligible.length
  const canSpin = !isSpinning && n > 0 && !!selectedPrizeId

  // ─── drawing ───────────────────────────────────────────────
  const draw = useCallback(
    (rotation) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const cx = SIZE / 2
      const cy = SIZE / 2
      const r = cx - 52          // main wheel radius (leave ~38px above for pointer)
      const outerR = r + 14      // gold decorative ring

      ctx.clearRect(0, 0, SIZE, SIZE)

      // ── empty state ─────────────────────────────────────────
      if (n === 0) {
        const emptyGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        emptyGrad.addColorStop(0, '#F8FAFC')
        emptyGrad.addColorStop(1, '#E2E8F0')
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, TAU)
        ctx.fillStyle = emptyGrad
        ctx.fill()
        ctx.strokeStyle = '#CBD5E1'
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.fillStyle = '#94A3B8'
        ctx.font = '16px "Noto Sans Thai", Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          lang === 'th' ? 'ไม่มีผู้มีสิทธิ์' : 'No participants',
          cx, cy,
        )
        drawPointer(ctx, cx, cy, outerR)
        return
      }

      const segAngle = TAU / n

      // ── outer gold ring (background) ─────────────────────────
      ctx.save()
      ctx.shadowColor = 'rgba(255, 200, 0, 0.4)'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, 0, TAU)
      const ringGrad = ctx.createLinearGradient(cx - outerR, cy, cx + outerR, cy)
      ringGrad.addColorStop(0.0, '#B8860B')
      ringGrad.addColorStop(0.25, '#FFD700')
      ringGrad.addColorStop(0.5, '#FFF8DC')
      ringGrad.addColorStop(0.75, '#FFD700')
      ringGrad.addColorStop(1.0, '#B8860B')
      ctx.fillStyle = ringGrad
      ctx.fill()
      ctx.restore()

      // ── segments ─────────────────────────────────────────────
      for (let i = 0; i < n; i++) {
        const start = rotation + i * segAngle - Math.PI / 2
        const end = start + segAngle
        const midAngle = start + segAngle / 2

        // Radial gradient: lighter center → richer edge
        const gx1 = cx + r * 0.15 * Math.cos(midAngle)
        const gy1 = cy + r * 0.15 * Math.sin(midAngle)
        const gx2 = cx + r * 0.98 * Math.cos(midAngle)
        const gy2 = cy + r * 0.98 * Math.sin(midAngle)

        const [light, dark] = SEG_COLORS[i % SEG_COLORS.length]
        const segGrad = ctx.createLinearGradient(gx1, gy1, gx2, gy2)
        segGrad.addColorStop(0, light)
        segGrad.addColorStop(1, dark)

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, r, start, end)
        ctx.closePath()
        ctx.fillStyle = segGrad
        ctx.fill()

        // White divider lines
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // ── segment labels ────────────────────────────────────────
      for (let i = 0; i < n; i++) {
        const start = rotation + i * segAngle - Math.PI / 2
        const segMid = start + segAngle / 2
        const fontSize = Math.max(9, Math.min(14, Math.floor(r / n * 1.6 + 6)))

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(segMid)
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'

        // Text shadow for legibility
        ctx.shadowColor = 'rgba(0,0,0,0.45)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1

        ctx.fillStyle = '#FFFFFF'
        ctx.font = `bold ${fontSize}px "Noto Sans Thai", Inter, sans-serif`
        ctx.fillText(eligible[i].name, r - 14, 0, r * 0.72)
        ctx.restore()
      }

      // ── outer ring border (dark) ──────────────────────────────
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, TAU)
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'
      ctx.lineWidth = 3
      ctx.stroke()

      // ── outer gold ring border ────────────────────────────────
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, 0, TAU)
      ctx.strokeStyle = '#8B6914'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // ── decorative star-dots at segment boundaries ────────────
      for (let i = 0; i < n; i++) {
        const angle = rotation + i * segAngle - Math.PI / 2
        const dotR = r + 7
        const dotX = cx + dotR * Math.cos(angle)
        const dotY = cy + dotR * Math.sin(angle)

        ctx.save()
        ctx.shadowColor = 'rgba(255,215,0,0.8)'
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.arc(dotX, dotY, 3.5, 0, TAU)
        ctx.fillStyle = '#FFD700'
        ctx.fill()
        ctx.strokeStyle = '#8B6914'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      }

      drawHub(ctx, cx, cy)
      drawPointer(ctx, cx, cy, outerR)
    },
    [eligible, n, lang],
  )

  // ─── premium center hub ─────────────────────────────────────
  function drawHub(ctx, cx, cy) {
    // Outer shadow ring
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 14
    ctx.beginPath()
    ctx.arc(cx, cy, 30, 0, TAU)
    ctx.fillStyle = '#111827'
    ctx.fill()
    ctx.restore()

    // Gold ring
    const goldGrad = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, 26)
    goldGrad.addColorStop(0, '#FFF8DC')
    goldGrad.addColorStop(0.4, '#FFD700')
    goldGrad.addColorStop(1, '#8B6914')
    ctx.beginPath()
    ctx.arc(cx, cy, 26, 0, TAU)
    ctx.fillStyle = goldGrad
    ctx.fill()

    // Dark inner hub
    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, TAU)
    ctx.fillStyle = '#111827'
    ctx.fill()

    // Inner white ring
    ctx.beginPath()
    ctx.arc(cx, cy, 12, 0, TAU)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()

    // Center gold dot
    const centerGrad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 7)
    centerGrad.addColorStop(0, '#FFD700')
    centerGrad.addColorStop(1, '#B8860B')
    ctx.beginPath()
    ctx.arc(cx, cy, 7, 0, TAU)
    ctx.fillStyle = centerGrad
    ctx.fill()
  }

  // ─── stylish pointer — tip points DOWN into the wheel ──────
  function drawPointer(ctx, cx, cy, outerR) {
    const tipY  = cy - outerR + 4  // pointed end touches the ring
    const baseY = tipY - 34        // flat end above the ring
    const halfW = 14

    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetY = 3

    const pGrad = ctx.createLinearGradient(cx - halfW, baseY, cx + halfW, baseY)
    pGrad.addColorStop(0, '#FF4757')
    pGrad.addColorStop(0.5, '#FF6B81')
    pGrad.addColorStop(1, '#FF4757')

    // Triangle: base at TOP (away from wheel), apex at BOTTOM (pointing into wheel)
    ctx.beginPath()
    ctx.moveTo(cx - halfW, baseY)  // base left
    ctx.lineTo(cx + halfW, baseY)  // base right
    ctx.lineTo(cx, tipY)           // tip — points down into the wheel
    ctx.closePath()
    ctx.fillStyle = pGrad
    ctx.fill()

    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.stroke()

    // Circle at the base (top) of the pointer
    ctx.beginPath()
    ctx.arc(cx, baseY, 8, 0, TAU)
    ctx.fillStyle = '#FF4757'
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.restore()
  }

  // Keep drawRef current
  useEffect(() => { drawRef.current = draw }, [draw])

  // Redraw when eligible list changes
  useEffect(() => {
    document.fonts.ready.then(() => draw(rotationRef.current))
  }, [draw])

  // ─── spin logic ─────────────────────────────────────────────
  const spin = useCallback(() => {
    if (!canSpin) return

    const winnerIdx = Math.floor(Math.random() * n)
    const segAngle = TAU / n
    const targetMod = ((-(winnerIdx + 0.5) * segAngle) % TAU + TAU) % TAU
    const currentMod = ((rotationRef.current % TAU) + TAU) % TAU
    let delta = (targetMod - currentMod + TAU) % TAU
    if (delta < 0.5) delta += TAU

    const startRot = rotationRef.current
    const totalTravel = 6 * TAU + delta
    const duration = 5000
    const startTime = performance.now()

    setIsSpinning(true)

    let lastTickAngle = startRot
    const tickSpacing = segAngle

    function easeOut(t) { return 1 - Math.pow(1 - t, 4) }

    function frame(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = startRot + totalTravel * easeOut(progress)

      rotationRef.current = current
      drawRef.current(current)

      const crossings = Math.floor((current - lastTickAngle) / tickSpacing)
      if (crossings > 0) {
        playTick()
        lastTickAngle += crossings * tickSpacing
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(frame)
      } else {
        const finalRot = startRot + totalTravel
        rotationRef.current = finalRot
        drawRef.current(finalRot)
        setIsSpinning(false)
        playWin()
        onWin(eligible[winnerIdx])
      }
    }

    animFrameRef.current = requestAnimationFrame(frame)
  }, [canSpin, n, eligible, playTick, playWin, onWin])

  // Cleanup on unmount
  useEffect(
    () => () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) },
    [],
  )

  return (
    <div className="flex flex-col items-center gap-5">

      {/* Wheel with ambient glow */}
      <div className="relative">
        {/* Ambient glow ring behind wheel */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: '-16px',
            background: 'radial-gradient(circle, rgba(255,215,0,0.18) 0%, rgba(102,126,234,0.10) 55%, transparent 75%)',
            filter: 'blur(18px)',
          }}
        />
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="relative w-full max-w-sm md:max-w-md"
          style={{
            filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.28)) drop-shadow(0 2px 8px rgba(0,0,0,0.18))',
          }}
        />
      </div>

      {/* Eligible count */}
      <p className="text-sm font-medium text-slate-400 tracking-wide">
        {t.eligibleCount(n)}
      </p>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={!canSpin}
        className={`
          relative px-16 py-4 rounded-full text-xl font-bold tracking-wider
          transition-all duration-200 overflow-hidden
          ${canSpin
            ? 'text-white cursor-pointer active:scale-95 hover:-translate-y-0.5'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }
        `}
        style={canSpin ? {
          background: 'linear-gradient(135deg, #667eea 0%, #9B59B6 50%, #764ba2 100%)',
          boxShadow: '0 8px 28px rgba(102,126,234,0.45), 0 2px 8px rgba(0,0,0,0.15)',
        } : {}}
      >
        {/* Shimmer overlay (active only) */}
        {canSpin && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
              backgroundSize: '200% 100%',
            }}
          />
        )}

        {isSpinning ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t.spinning}
          </span>
        ) : t.spin}
      </button>

      {/* Helper messages */}
      {!selectedPrizeId && n > 0 && (
        <p className="text-xs text-amber-500 font-semibold tracking-wide">{t.selectPrizePlaceholder}</p>
      )}
      {selectedPrizeId && n === 0 && (
        <p className="text-xs text-red-400 font-semibold">{t.noEligible}</p>
      )}
    </div>
  )
}
