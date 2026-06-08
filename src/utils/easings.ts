export const EASING_NAMES = [
  'linear',
  'easeInQuad',
  'easeOutQuad',
  'easeInOutQuad',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
  'easeInExpo',
  'easeOutExpo',
  'easeInOutExpo',
  'easeOutBack',
  'easeOutElastic',
] as const

export type EasingName = (typeof EASING_NAMES)[number]

const fns: Record<EasingName, (t: number) => number> = {
  linear:         (t) => t,
  easeInQuad:     (t) => t * t,
  easeOutQuad:    (t) => 1 - (1 - t) * (1 - t),
  easeInOutQuad:  (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInExpo:     (t) => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutExpo:    (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo:  (t) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2,
  easeOutBack:    (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) },
  easeOutElastic: (t) => {
    if (t === 0 || t === 1) return t
    const c4 = (2 * Math.PI) / 3
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

export function applyEasing(t: number, name: string): number {
  const fn = fns[name as EasingName]
  return fn ? fn(Math.max(0, Math.min(1, t))) : t
}
