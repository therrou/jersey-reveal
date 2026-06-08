import { useEffect, useRef, useState } from 'react'
import JerseyCanvasThree from '../components/JerseyCanvasThree'
import DebugPanel from '../components/DebugPanel'
import type { AnimParams } from '../components/DebugPanel'
import { applyEasing } from '../utils/easings'

const DEFAULTS: AnimParams = {
  progress: 0,
  lightStartY: -6,
  lightEndY: 0,
  lightZ: 2.5,
  lightIntensity: 10,
  lightDistance: 6,
  lightDecay: 2,
  modelBaseY: Math.PI,
  modelStartAngle: -0.6,
  modelEndAngle: -0.15,
  metalness: 0,
  roughness: 1,
  animDuration: 0.7,
  easing: 'easeOutCubic',
  textRevealStart: 0.45,
  textY: 2.5,
  textX: 0,
  fadeHeight: 28,
  fadeOpacity: 1,
  playerName: 'OTHMAN',
  label: 'PREMIUM MEMBER',
}

export default function Reveal() {
  const [params, setParams] = useState<AnimParams>(DEFAULTS)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const durRef = useRef(params.animDuration)
  durRef.current = params.animDuration

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const replay = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setParams((p) => ({ ...p, progress: 0 }))
    setIsPlaying(true)
    startTimeRef.current = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTimeRef.current) / (durRef.current * 1000))
      setParams((p) => ({ ...p, progress: t }))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setIsPlaying(false)
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Apply selected easing to raw scrubber progress
  const easedProgress = applyEasing(params.progress, params.easing)

  // Text reveal: 0→1 after textRevealStart, eased
  const rawText = Math.max(
    0,
    Math.min(1, (easedProgress - params.textRevealStart) / (1 - params.textRevealStart)),
  )
  const textOpacity = 1 - Math.pow(1 - rawText, 2)

  // Clip from TOP downward: inset(X% 0 0 0) — X: 100→0
  // Bottom of text div (jersey neck area) reveals first, then expands upward
  const clipTop = ((1 - rawText) * 100).toFixed(1)
  const clipPath = `inset(${clipTop}% 0 0 0)`

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#0a1528',
        overflow: 'hidden',
      }}
    >
      {/* ── Text — z-index 1, behind canvas, anchored to top ─────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: `${params.textY}%`,
          transform: `translateX(${params.textX}%)`,
          opacity: textOpacity,
          clipPath,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: '#cc1133',
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          {params.label}
        </p>
        <h1
          style={{
            fontFamily: 'Virage, sans-serif',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 88,
            color: '#fff',
            lineHeight: '100%',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          {params.playerName}
        </h1>
      </div>

      {/* ── Three.js canvas — alpha transparent, z-index 2 ───────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <JerseyCanvasThree
          progress={easedProgress}
          lightStartY={params.lightStartY}
          lightEndY={params.lightEndY}
          lightZ={params.lightZ}
          lightIntensity={params.lightIntensity}
          lightDistance={params.lightDistance}
          lightDecay={params.lightDecay}
          modelBaseY={params.modelBaseY}
          modelStartAngle={params.modelStartAngle}
          modelEndAngle={params.modelEndAngle}
          metalness={params.metalness}
          roughness={params.roughness}
        />
      </div>

      {/* ── Bottom fade — jersey dissolves into background ───────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${params.fadeHeight}%`,
          background: `linear-gradient(to bottom, rgba(10,21,40,0), rgba(10,21,40,${params.fadeOpacity}))`,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* ── Mobile replay CTA ────────────────────────────────────── */}
      {isMobile && (
        <button
          onClick={replay}
          disabled={isPlaying}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
            fontSize: 11,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            padding: '12px 36px',
            cursor: isPlaying ? 'default' : 'pointer',
            fontFamily: 'inherit',
            opacity: isPlaying ? 0.3 : 1,
            transition: 'opacity 0.2s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {isPlaying ? '···' : '↺ Replay'}
        </button>
      )}

      {/* ── Debug panel — top-right ───────────────────────────────── */}
      <DebugPanel
        params={params}
        onChange={(p) => {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
            setIsPlaying(false)
          }
          setParams(p)
        }}
        onReplay={replay}
        isPlaying={isPlaying}
      />
    </div>
  )
}
