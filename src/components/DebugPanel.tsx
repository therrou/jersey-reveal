import { useState } from 'react'
import { EASING_NAMES } from '../utils/easings'

interface AnimParams {
  progress: number
  lightStartY: number
  lightEndY: number
  lightZ: number
  lightIntensity: number
  lightDistance: number
  lightDecay: number
  modelBaseY: number
  modelStartAngle: number
  modelEndAngle: number
  animDuration: number
  easing: string
  textRevealStart: number
  textY: number
  textX: number
  fadeHeight: number
  fadeOpacity: number
  playerName: string
  label: string
}

interface Props {
  params: AnimParams
  onChange: (p: AnimParams) => void
  onReplay: () => void
  isPlaying: boolean
}

function Row({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 106, fontSize: 9, color: '#777', flexShrink: 0, lineHeight: 1 }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: '#4488ff', cursor: 'pointer', margin: 0 }}
      />
      <span style={{ width: 36, fontSize: 9, color: '#bbb', textAlign: 'right', flexShrink: 0 }}>
        {value.toFixed(2)}
      </span>
    </div>
  )
}

const Div = () => <div style={{ borderTop: '1px solid #1e1e1e', margin: '3px 0' }} />

export type { AnimParams }

export default function DebugPanel({ params, onChange, onReplay, isPlaying }: Props) {
  const [open, setOpen] = useState(true)
  const set = <K extends keyof AnimParams>(key: K, val: AnimParams[K]) =>
    onChange({ ...params, [key]: val })

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 35,
        width: 260,
        background: 'rgba(8,8,12,0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #1e1e1e',
        zIndex: 100,
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 8px',
          borderBottom: open ? '1px solid #1e1e1e' : 'none',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ fontSize: 9, color: '#555', letterSpacing: '0.15em' }}>DEBUG</span>
        <span style={{ fontSize: 9, color: '#444' }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ padding: '6px 8px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Replay + Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onReplay() }}
              disabled={isPlaying}
              style={{
                background: isPlaying ? '#1a1a1a' : '#4488ff',
                border: 'none',
                color: isPlaying ? '#444' : '#fff',
                fontSize: 8,
                letterSpacing: '0.08em',
                padding: '3px 7px',
                cursor: isPlaying ? 'default' : 'pointer',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              {isPlaying ? '▶…' : '▶ PLAY'}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={params.progress}
              onChange={(e) => set('progress', Number(e.target.value))}
              style={{ flex: 1, accentColor: '#4488ff', cursor: 'pointer', margin: 0 }}
            />
            <span style={{ width: 36, fontSize: 9, color: '#4488ff', textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>
              {params.progress.toFixed(3)}
            </span>
          </div>

          <Row label="Duration (s)" value={params.animDuration} min={0.2} max={8} step={0.1} onChange={(v) => set('animDuration', v)} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 106, fontSize: 9, color: '#777', flexShrink: 0 }}>Easing</span>
            <select
              value={params.easing}
              onChange={(e) => set('easing', e.target.value)}
              style={{
                flex: 1,
                background: '#0e0e12',
                border: '1px solid #222',
                color: '#bbb',
                fontSize: 9,
                fontFamily: 'inherit',
                padding: '2px 4px',
                cursor: 'pointer',
              }}
            >
              {EASING_NAMES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <Div />

          <Row label="Light Start Y" value={params.lightStartY} min={-6} max={0} step={0.05} onChange={(v) => set('lightStartY', v)} />
          <Row label="Light End Y" value={params.lightEndY} min={0} max={8} step={0.05} onChange={(v) => set('lightEndY', v)} />
          <Row label="Light Z" value={params.lightZ} min={0.5} max={6} step={0.05} onChange={(v) => set('lightZ', v)} />
          <Row label="Intensity" value={params.lightIntensity} min={0} max={50} step={0.1} onChange={(v) => set('lightIntensity', v)} />
          <Row label="Distance" value={params.lightDistance} min={0} max={20} step={0.1} onChange={(v) => set('lightDistance', v)} />
          <Row label="Decay" value={params.lightDecay} min={0} max={4} step={0.05} onChange={(v) => set('lightDecay', v)} />

          <Div />

          <Row label="Model Base Y" value={params.modelBaseY} min={0} max={6.28} step={0.01} onChange={(v) => set('modelBaseY', v)} />
          <Row label="Start Angle" value={params.modelStartAngle} min={-1.57} max={1.57} step={0.01} onChange={(v) => set('modelStartAngle', v)} />
          <Row label="End Angle" value={params.modelEndAngle} min={-1.57} max={1.57} step={0.01} onChange={(v) => set('modelEndAngle', v)} />

          <Div />

          <Row label="Text Reveal At" value={params.textRevealStart} min={0} max={0.99} step={0.01} onChange={(v) => set('textRevealStart', v)} />
          <Row label="Text Y (%)" value={params.textY} min={0} max={60} step={0.5} onChange={(v) => set('textY', v)} />
          <Row label="Text X (%)" value={params.textX} min={-50} max={50} step={0.5} onChange={(v) => set('textX', v)} />
          <Div />
          <Row label="Fade Height (%)" value={params.fadeHeight} min={0} max={80} step={1} onChange={(v) => set('fadeHeight', v)} />
          <Row label="Fade Opacity" value={params.fadeOpacity} min={0} max={1} step={0.01} onChange={(v) => set('fadeOpacity', v)} />

          <Div />

          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={params.playerName}
              onChange={(e) => set('playerName', e.target.value)}
              placeholder="Name"
              style={{ flex: 2, background: '#0e0e12', border: '1px solid #222', color: '#fff', padding: '3px 6px', fontSize: 9, fontFamily: 'inherit' }}
            />
            <input
              value={params.label}
              onChange={(e) => set('label', e.target.value)}
              placeholder="Label"
              style={{ flex: 1, background: '#0e0e12', border: '1px solid #222', color: '#fff', padding: '3px 6px', fontSize: 9, fontFamily: 'inherit' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
