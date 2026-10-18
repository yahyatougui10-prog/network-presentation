import { useEffect, useMemo, useRef, useState, type ReactNode, type FC } from 'react'
import { motion } from 'framer-motion'
import {
  Server,
  Globe,
  Network,
  Check,
  ArrowRight,
  ArrowLeftRight,
  Volume2,
  VolumeX,
  SkipForward,
  RadioTower,
  ShieldCheck,
} from 'lucide-react'

const PALETTE = {
  gold: '#FDE047',
  blue: '#3B82F6',
  blueSoft: '#60A5FA',
  cyan: '#22D3EE',
  violet: '#8B5CF6',
  violetSoft: '#A78BFA',
  green: '#4ADE80',
  amber: '#FBBF24',
  white: '#FFFFFF',
  bg: '#020617',
}

const END_TIME = 24
const DORA_TIMES = [4.6, 5.5, 6.4, 7.3]
const DORA_STEPS = [
  { key: 'DISCOVER', color: PALETTE.amber, dir: 1 },
  { key: 'OFFER', color: PALETTE.cyan, dir: -1 },
  { key: 'REQUEST', color: PALETTE.violet, dir: 1 },
  { key: 'ACK', color: PALETTE.green, dir: -1 },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
const easeIn = (t: number) => t * t * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function cameraFor(t: number) {
  if (t < 4) {
    const p = easeInOut(clamp(t / 4, 0, 1))
    return { cx: lerp(1120, 1260, p), cy: lerp(830, 755, p), zoom: lerp(0.54, 0.64, p) }
  }
  if (t < 8) {
    return { cx: 1255, cy: 735, zoom: 0.67 + (Math.sin(t * 2.1) * 0.004) }
  }
  if (t < 12) {
    const p = (t - 8) / 4
    const q = easeIn(Math.min(1, p * 2.6))
    return { cx: lerp(1260, 2080, q), cy: lerp(730, 470, q), zoom: lerp(0.67, 1.18, q) }
  }
  if (t < 16) {
    const p = easeInOut(clamp((t - 12) / 4, 0, 1))
    return { cx: lerp(2080, 1300, p), cy: lerp(470, 740, p), zoom: lerp(1.18, 0.56, p) }
  }
  if (t < 20) {
    const p = easeInOut(clamp((t - 16) / 4, 0, 1))
    return { cx: lerp(1300, 1460, p), cy: lerp(740, 700, p), zoom: lerp(0.56, 0.5, p) }
  }
  const p = easeOut(clamp((t - 20) / 3.2, 0, 1))
  return { cx: lerp(1460, 1300, p), cy: lerp(700, 760, p), zoom: lerp(0.5, 0.62, p) }
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

type NodeKind = 'core' | 'dhcp' | 'device' | 'server' | 'sprawl'

interface NetNode {
  id: string
  kind: NodeKind
  label: string
  x: number
  y: number
  r: number
  color: string
  appear: number
  sprawl?: boolean
}

const PY = 740

const NODES: NetNode[] = [
  { id: 'core', kind: 'core', label: 'ROUTEUR CŒUR', x: 1300, y: PY, r: 38, color: PALETTE.gold, appear: 0 },
  { id: 'dhcp', kind: 'dhcp', label: 'SERVEUR DHCP', x: 2070, y: 470, r: 32, color: PALETTE.cyan, appear: 0.8 },
  { id: 'cli', kind: 'device', label: 'NOUVEL APPAREIL', x: 430, y: 790, r: 28, color: PALETTE.white, appear: 0.5 },
  { id: 'sw', kind: 'device', label: 'SWITCH PÉRIPHÉRIE', x: 1990, y: 1290, r: 20, color: PALETTE.blueSoft, appear: 0.9 },
  { id: 'ap', kind: 'device', label: 'BORNE WIFI', x: 980, y: 1510, r: 18, color: PALETTE.blueSoft, appear: 0.7 },
  { id: 'gw', kind: 'server', label: 'PASSERELLE', x: 880, y: 340, r: 22, color: PALETTE.violetSoft, appear: 0.9 },
  { id: 'srv1', kind: 'server', label: 'SERVEUR BDD', x: 2390, y: 590, r: 24, color: PALETTE.blueSoft, appear: 1.1 },
  { id: 'srv2', kind: 'server', label: 'SERVEUR APP', x: 2370, y: 1010, r: 24, color: PALETTE.blueSoft, appear: 1.2 },
  { id: 'lap1', kind: 'device', label: 'LAPTOP 01', x: 700, y: 1040, r: 20, color: PALETTE.white, appear: 1.3 },
  { id: 'lap2', kind: 'device', label: 'LAPTOP 02', x: 920, y: 1230, r: 20, color: PALETTE.white, appear: 1.4 },
  { id: 'ph1', kind: 'device', label: 'PHONE 01', x: 1180, y: 1300, r: 16, color: PALETTE.white, appear: 1.5 },
  { id: 'ph2', kind: 'device', label: 'PHONE 02', x: 1190, y: 240, r: 16, color: PALETTE.white, appear: 1.6 },
  { id: 'tab', kind: 'device', label: 'TABLET 01', x: 1590, y: 1310, r: 18, color: PALETTE.white, appear: 1.7 },
  { id: 'lap3', kind: 'device', label: 'LAPTOP 03', x: 2080, y: 960, r: 20, color: PALETTE.white, appear: 1.8 },
  { id: 'prn', kind: 'device', label: 'IMPRIMANTE', x: 2290, y: 780, r: 20, color: PALETTE.white, appear: 1.9 },
  { id: 'pc', kind: 'device', label: 'POSTE TRAVAIL', x: 1700, y: 250, r: 20, color: PALETTE.white, appear: 2.0 },
  { id: 'iot', kind: 'device', label: 'HUB IOT', x: 760, y: 460, r: 18, color: PALETTE.white, appear: 2.1 },
  { id: 'cam', kind: 'device', label: 'CAM 05', x: 560, y: 1130, r: 18, color: PALETTE.white, appear: 2.2 },
]

const SPRAWL_COUNT = 26
for (let k = 0; k < SPRAWL_COUNT; k++) {
  const ang = (k / SPRAWL_COUNT) * Math.PI * 2
  NODES.push({
    id: `sp${k}`,
    kind: 'sprawl',
    label: '',
    x: 1300 + Math.cos(ang) * 1310,
    y: PY + Math.sin(ang) * 780,
    r: 11,
    color: k % 3 === 0 ? PALETTE.violetSoft : k % 3 === 1 ? PALETTE.cyan : PALETTE.blueSoft,
    appear: 12.6 + k * 0.018,
    sprawl: true,
  })
}

const idx = (id: string) => NODES.findIndex((n) => n.id === id)

const EDGES: [number, number][] = []
for (const n of NODES) {
  if (n.id === 'core') continue
  if (n.sprawl) EDGES.push([idx('core'), idx(n.id)])
}
for (const id of ['cli', 'lap1', 'lap2', 'ph1', 'lap3', 'iot', 'ap', 'tab', 'pc', 'prn', 'cam', 'lap2']) {
  if (!EDGES.some(([a, b]) => (a === idx('core') && NODES[b]?.id === id) || (b === idx('core') && NODES[a]?.id === id))) {
    EDGES.push([idx('core'), idx(id)])
  }
}
EDGES.push([idx('core'), idx('dhcp')])
EDGES.push([idx('dhcp'), idx('srv1')])
EDGES.push([idx('dhcp'), idx('srv2')])
EDGES.push([idx('core'), idx('gw')])
EDGES.push([idx('core'), idx('ph2')])
EDGES.push([idx('core'), idx('sw')])

interface Vec {
  x: number
  y: number
}

const CLIENT_TO_SERVER: Vec[] = [
  { x: NODES[idx('cli')].x, y: NODES[idx('cli')].y },
  { x: NODES[idx('core')].x, y: NODES[idx('core')].y },
  { x: NODES[idx('dhcp')].x, y: NODES[idx('dhcp')].y },
]

function pointAt(path: Vec[], frac: number) {
  let total = 0
  const segs: number[] = []
  for (let i = 0; i < path.length - 1; i++) {
    const d = Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y)
    segs.push(d)
    total += d
  }
  let target = clamp(frac, 0, 1) * total
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const a = path[i]
      const b = path[i + 1]
      const f = segs[i] === 0 ? 0 : target / segs[i]
      return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f) }
    }
    target -= segs[i]
  }
  const last = path[path.length - 1]
  return { x: last.x, y: last.y }
}

interface Packet {
  path: Vec[]
  t0: number
  dur: number
  color: string
  label?: string
  loop?: boolean
  r?: number
  mask: number
}

interface Burst {
  x: number
  y: number
  t0: number
  dur: number
  r0: number
  r1: number
  color: string
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

class IntroAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private muted = false

  async ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume()
        } catch {
          /* ignored */
        }
      }
      return
    }
    try {
      const Ctor: typeof AudioContext | undefined =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.45
      this.master.connect(this.ctx.destination)
      this.buildDrone()
    } catch {
      this.ctx = null
    }
  }

  private buildDrone() {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const g = ctx.createGain()
    g.gain.value = 0.0
    g.connect(master)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 200
    filter.Q.value = 0.7
    filter.connect(g)

    const freqs = [55, 82.4, 110, 164.8]
    for (const f of freqs) {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const og = ctx.createGain()
      og.gain.value = f === 55 ? 0.28 : f === 82.4 ? 0.14 : 0.1
      o.connect(og)
      og.connect(filter)
      o.start()
    }

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const lfoG = ctx.createGain()
    lfoG.gain.value = 0.05
    lfo.connect(lfoG)
    lfoG.connect(g.gain)
    lfo.start()

    const lfoF = ctx.createOscillator()
    lfoF.frequency.value = 0.11
    const lfoFG = ctx.createGain()
    lfoFG.gain.value = 55
    lfoF.connect(lfoFG)
    lfoFG.connect(filter.frequency)
    lfoF.start()

    const t = ctx.currentTime + 0.05
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(1, t + 5)
  }

  private tone(freq: number, dur: number, peak: number, type: OscillatorType = 'sine') {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  tick() {
    this.tone(720, 0.16, 0.12, 'square')
  }

  swell() {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const t = ctx.currentTime
    for (const f of [110, 164.8, 220]) {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = f
      const flt = ctx.createBiquadFilter()
      flt.type = 'lowpass'
      flt.frequency.value = 420
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.05, t + 1.1)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 4.2)
      o.connect(flt)
      flt.connect(g)
      g.connect(master)
      o.start(t)
      o.stop(t + 4.4)
    }
  }

  riser() {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const t = ctx.currentTime
    const dur = 2.6
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const flt = ctx.createBiquadFilter()
    flt.type = 'bandpass'
    flt.frequency.setValueAtTime(120, t)
    flt.frequency.exponentialRampToValueAtTime(3200, t + dur)
    flt.Q.value = 1.1
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.16, t + dur * 0.85)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(flt)
    flt.connect(g)
    g.connect(master)
    src.start(t)
  }

  boom() {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(120, t)
    o.frequency.exponentialRampToValueAtTime(28, t + 1.6)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + 1.85)

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const flt = ctx.createBiquadFilter()
    flt.type = 'lowpass'
    flt.frequency.value = 900
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.0001, t)
    ng.gain.exponentialRampToValueAtTime(0.22, t + 0.02)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.7)
    src.connect(flt)
    flt.connect(ng)
    ng.connect(master)
    src.start(t)
  }

  setMuted(m: boolean) {
    this.muted = m
    const ctx = this.ctx
    if (!ctx || !this.master) return
    this.master.gain.setTargetAtTime(m ? 0 : 0.5, ctx.currentTime, 0.05)
  }

  dispose() {
    const ctx = this.ctx
    if (ctx) {
      try {
        void ctx.close()
      } catch {
        /* ignored */
      }
    }
    this.ctx = null
    this.master = null
  }
}

function drawGlyph(
  ctx: CanvasRenderingContext2D,
  kind: NodeKind,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha: number,
  time: number,
) {
  if (kind === 'sprawl') {
    ctx.strokeStyle = color
    ctx.globalAlpha = alpha * 0.9
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, r * 0.45, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, 1.6, 0, Math.PI * 2)
    ctx.fill()
    return
  }

  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.fillStyle = 'rgba(8,6,18,0.85)'
  const lw = 2

  if (kind === 'core') {
    ctx.lineWidth = lw
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + time * 0.25
      const px = x + Math.cos(a) * r
      const py = y + Math.sin(a) * r
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, r * 0.42, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = color
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.arc(x, y, r * 0.14, 0, Math.PI * 2)
    ctx.fill()
  } else if (kind === 'dhcp') {
    const w = r * 1.9
    const h = r * 1.15
    ctx.lineWidth = lw
    roundedRectPath(ctx, x - w / 2, y - h / 2, w, h, r * 0.28)
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.beginPath()
    ctx.rect(x - w / 2, y - h / 2, w, h)
    ctx.clip()
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = color
      ctx.globalAlpha = alpha * 0.4
      ctx.beginPath()
      ctx.arc(x - w / 2 + w * (0.2 + i * 0.3), y + h * 0.02, r * 0.07, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.moveTo(x - w * 0.28, y + h * 0.32)
    ctx.lineTo(x - w * 0.28, y + h * 0.55)
    ctx.lineTo(x + w * 0.28, y + h * 0.55)
    ctx.lineTo(x + w * 0.28, y + h * 0.32)
    ctx.stroke()
  } else if (kind === 'server') {
    const w = r * 1.2
    const h = r * 2
    ctx.lineWidth = lw
    roundedRectPath(ctx, x - w / 2, y - h / 2, w, h, r * 0.3)
    ctx.fill()
    ctx.stroke()
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(x - w * 0.3, y - h * 0.3 + i * h * 0.24)
      ctx.lineTo(x + w * 0.3, y - h * 0.3 + i * h * 0.24)
      ctx.stroke()
    }
    ctx.fillStyle = color
    for (let i = 0; i < 2; i++) {
      ctx.beginPath()
      ctx.arc(x - w * 0.3 + i * w * 0.6, y + h * 0.42, r * 0.07, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    const w = r * 1.7
    const h = r * 1.1
    ctx.lineWidth = lw
    roundedRectPath(ctx, x - w / 2, y - h / 2, w, h, r * 0.3)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = color
    ctx.globalAlpha = alpha * 0.7
    roundedRectPath(ctx, x - w * 0.34, y - h * 0.22, w * 0.68, h * 0.28, 1.5)
    ctx.fill()
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.moveTo(x - w * 0.24, y + h * 0.5)
    ctx.lineTo(x + w * 0.24, y + h * 0.5)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function NetworkBackdrop({ elapsedRef }: { elapsedRef: { current: number } }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const packetsRef = useRef<Packet[]>([])
  const burstsRef = useRef<Burst[]>([])
  const lastPulseRef = useRef(0)
  const lastBurstRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let disposed = false
    let prevT = -1
    const smooth = { cx: 0, cy: 0, zoom: 0 }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const stars: { x: number; y: number; p: number; s: number; ph: number }[] = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * 3600 - 800,
        y: Math.random() * 2200 - 500,
        p: 0.18 + Math.random() * 0.3,
        s: Math.random() * 1.6 + 0.4,
        ph: Math.random() * Math.PI * 2,
      })
    }

    for (let i = 0; i < 4; i++) {
      const a = NODES[idx('core')]
      const b = NODES[Math.floor(Math.random() * 30) % NODES.length]
      if (!b || b.id === 'core') continue
      const p: Packet = {
        path: [{ x: a.x, y: a.y }, { x: b.x, y: b.y }],
        t0: Math.random() * 3,
        dur: 2.1 + Math.random() * 1.6,
        color: PALETTE.cyan,
        r: 3.6,
        loop: true,
        mask: (1 << 0) | (1 << 1) | (1 << 4) | (1 << 5),
      }
      packetsRef.current.push(p)
    }
    for (let k = 0; k < 3; k++) {
      const a = NODES[idx('core')]
      const b = NODES.find((n) => n.sprawl && k === parseInt(n.id.slice(2), 10))
      if (!b) continue
      packetsRef.current.push({
        path: [{ x: a.x, y: a.y }, { x: b.x, y: b.y }],
        t0: Math.random() * 3,
        dur: 2.6 + Math.random() * 1.4,
        color: k % 2 ? PALETTE.violet : PALETTE.blueSoft,
        r: 3.2,
        loop: true,
        mask: (1 << 4) | (1 << 5),
      })
    }

    const drawnLabels: { text: string; screenX: number; screenY: number; color: string }[] = []

    const render = () => {
      if (disposed) return
      const time = elapsedRef.current
      const scene = clamp(Math.floor(time / 4), 0, 5)
      const raw = cameraFor(time)
      if (prevT < 0) {
        smooth.cx = raw.cx
        smooth.cy = raw.cy
        smooth.zoom = raw.zoom
      } else {
        const dt = Math.max(0.001, time - prevT)
        const k = 1 - Math.exp(-dt / 0.9)
        smooth.cx = lerp(smooth.cx, raw.cx, k)
        smooth.cy = lerp(smooth.cy, raw.cy, k)
        smooth.zoom = lerp(smooth.zoom, raw.zoom, k)
      }
      prevT = time
      const cam = smooth
      const zoom = cam.zoom

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, Math.max(w, h) * 0.9)
      bgGrad.addColorStop(0, '#0B0820')
      bgGrad.addColorStop(0.55, PALETTE.bg)
      bgGrad.addColorStop(1, '#02020A')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      for (const st of stars) {
        const sx = (st.x - cam.cx * st.p) * (zoom * (1 - st.p) + 0.35 * st.p) + w / 2
        const sy = (st.y - cam.cy * st.p) * (zoom * (1 - st.p) + 0.35 * st.p) + h / 2
        if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(time * 0.7 + st.ph))
        ctx.fillStyle = `rgba(167,139,250,${0.13 * tw})`
        ctx.beginPath()
        ctx.arc(sx, sy, st.s * 0.7, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.save()
      const sx = (wx: number) => (wx - cam.cx) * zoom + w / 2
      const sy = (wy: number) => (wy - cam.cy) * zoom + h / 2
      ctx.scale(zoom, zoom)
      ctx.translate(-cam.cx, -cam.cy)

      ctx.lineWidth = 1 / zoom
      ctx.strokeStyle = 'rgba(70,110,190,0.05)'
      for (let gx = -400; gx <= 3000; gx += 160) {
        ctx.beginPath()
        ctx.moveTo(gx, -300)
        ctx.lineTo(gx, 1900)
        ctx.stroke()
      }
      for (let gy = -300; gy <= 1900; gy += 160) {
        ctx.beginPath()
        ctx.moveTo(-400, gy)
        ctx.lineTo(3000, gy)
        ctx.stroke()
      }

      drawnLabels.length = 0

      const drawEdge = (a: NetNode, b: NetNode) => {
        const ta = a.appear
        const tb = b.appear
        const alphaA = smoothstep(ta, ta + 0.8, time)
        const alphaB = smoothstep(tb, tb + 0.8, time)
        const eAlpha = Math.min(alphaA, alphaB)
        if (eAlpha <= 0.01) return
        const hot =
          (a.id === 'dhcp' && scene === 2) ||
          (b.id === 'dhcp' && scene === 2) ||
          (a.id === 'cli' && scene === 1) ||
          (b.id === 'cli' && scene === 1)
        const isSprawl = Boolean(a.sprawl && b.sprawl) || Boolean(a.sprawl && b.id === 'core')
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.lineWidth = isSprawl ? 0.8 / zoom : 1.4 / zoom
        if (hot) {
          ctx.strokeStyle = `rgba(190,160,255,${0.6 * eAlpha})`
          ctx.lineWidth = 2.4 / zoom
        } else if (isSprawl) {
          const c = a.sprawl ? a : b
          ctx.strokeStyle = hexA(c.color, 0.16 * eAlpha)
        } else if (a.id === 'core' || b.id === 'core') {
          ctx.strokeStyle = `rgba(139,92,246,${0.32 * eAlpha})`
        } else {
          ctx.strokeStyle = `rgba(120,100,210,${0.16 * eAlpha})`
        }
        ctx.stroke()
      }

      for (const [ai, bi] of EDGES) {
        const a = NODES[ai]
        const b = NODES[bi]
        if (!a || !b) continue
        drawEdge(a, b)
      }

      ctx.globalCompositeOperation = 'lighter'

      const drawBursts = (list: Burst[]) => {
        if (scene !== 1 && scene !== 2 && scene !== 3) return
        for (const bu of list) {
          if (time < bu.t0 || time > bu.t0 + bu.dur) continue
          const f = (time - bu.t0) / bu.dur
          const r = lerp(bu.r0, bu.r1, easeOut(f))
          ctx.strokeStyle = hexA(bu.color, 0.5 * (1 - f))
          ctx.lineWidth = 1.6 / zoom
          ctx.beginPath()
          ctx.arc(bu.x, bu.y, r, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      drawBursts(burstsRef.current)

      if (scene === 1) {
        if (time - lastBurstRef.current > 1.05 && time > 4.35 && time < 7.6) {
          lastBurstRef.current = time
          burstsRef.current.push({ x: NODES[idx('cli')].x, y: NODES[idx('cli')].y, t0: time, dur: 1.5, r0: 30, r1: 330, color: PALETTE.amber })
        }
      }
      if (scene === 2 && time - lastPulseRef.current > 0.52 && time > 8.4) {
        lastPulseRef.current = time
        const p: Packet = {
          path: [CLIENT_TO_SERVER[2], CLIENT_TO_SERVER[1], CLIENT_TO_SERVER[0]],
          t0: time,
          dur: 1,
          color: time % 2 < 0.5 ? PALETTE.cyan : PALETTE.green,
          r: 4.6,
          mask: 1 << 2,
        }
        packetsRef.current = [...packetsRef.current, p]
      }

      const drawPacket = (p: Packet) => {
        const rel = p.loop ? ((time - p.t0) % p.dur) / p.dur : (time - p.t0) / p.dur
        if (p.loop) {
          if ((p.mask & (1 << scene)) === 0) return
        } else {
          if ((p.mask & (1 << scene)) === 0 || time < p.t0 || time > p.t0 + p.dur) return
        }
        const f = clamp(rel, 0, 1)
        const pos = pointAt(p.path, f)
        const pr = (p.r ?? 4) * 1
        for (let t = 0; t < 5; t++) {
          const bf = clamp(f - t * 0.028, 0, 1)
          const bp = pointAt(p.path, bf)
          ctx.fillStyle = hexA(p.color, (0.5 - t * 0.09) * (1 - f * 0.3))
          ctx.beginPath()
          ctx.arc(bp.x, bp.y, pr * (1 - t * 0.16), 0, Math.PI * 2)
          ctx.fill()
        }
        const gr = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pr * 4)
        gr.addColorStop(0, hexA(p.color, 0.5))
        gr.addColorStop(1, hexA(p.color, 0))
        ctx.fillStyle = gr
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, pr * 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, pr * 1.15, 0, Math.PI * 2)
        ctx.fill()

        if (p.label && f > 0.06 && f < 0.94) {
          ctx.fillStyle = hexA(p.color, 0.92)
          ctx.font = `600 ${11 / zoom}px "JetBrains Mono", monospace`
          ctx.textAlign = 'center'
          ctx.fillText(p.label, pos.x, pos.y - pr * 4 - 4 / zoom)
        }
      }

      for (const p of packetsRef.current) drawPacket(p)

      const drawNode = (n: NetNode) => {
        const a = smoothstep(n.appear, n.appear + 0.9, time)
        if (a <= 0.01) return
        let emp = 1
        if (n.id === 'dhcp' && scene === 2) emp = 1.55
        else if (n.id === 'dhcp' && scene === 1) emp = 1.16
        else if (n.id === 'cli' && scene === 1) emp = 1.4
        else if (n.sprawl && scene === 3) emp = 1.25
        const r = n.r * emp

        const rr = r * 4
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr)
        glow.addColorStop(0, hexA(n.color, 0.2 * a))
        glow.addColorStop(1, hexA(n.color, 0))
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, rr, 0, Math.PI * 2)
        ctx.fill()

        if (n.id === 'dhcp' && scene === 2) {
          const pulse = (time % 1.2) / 1.2
          ctx.strokeStyle = hexA(PALETTE.cyan, 0.5 * (1 - pulse))
          ctx.lineWidth = 2 / zoom
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * (1 + pulse * 1.8), 0, Math.PI * 2)
          ctx.stroke()
          const beam = ctx.createLinearGradient(n.x, n.y - r * 6, n.x, n.y - r * 1.2)
          beam.addColorStop(0, 'rgba(34,211,238,0)')
          beam.addColorStop(1, 'rgba(34,211,238,0.5)')
          ctx.fillStyle = beam
          ctx.beginPath()
          ctx.moveTo(n.x - r * 0.3, n.y - r * 1.2)
          ctx.lineTo(n.x + r * 0.3, n.y - r * 1.2)
          ctx.lineTo(n.x + r * 0.9, n.y - r * 6)
          ctx.lineTo(n.x - r * 0.9, n.y - r * 6)
          ctx.closePath()
          ctx.fill()
        }

        drawGlyph(ctx, n.kind, n.x, n.y, r, n.color, a, time)

        if (!n.sprawl) {
          drawnLabels.push({ text: n.label, screenX: sx(n.x), screenY: sy(n.y) + r * zoom + 16, color: n.color })
        }
      }

      for (const n of NODES) drawNode(n)

      if (scene === 3) {
        const pulse = (time % 1.6) / 1.6
        const ringR = 600 + pulse * 2900
        ctx.strokeStyle = `rgba(139,92,246,${0.3 * (1 - pulse)})`
        ctx.lineWidth = 5 / zoom
        ctx.beginPath()
        ctx.arc(1300, PY, ringR, 0, Math.PI * 2)
        ctx.stroke()
        ctx.strokeStyle = `rgba(34,211,238,${0.18 * (1 - pulse)})`
        ctx.beginPath()
        ctx.arc(1300, PY, ringR * 0.72, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (scene === 4) {
        const tSq = (time - 16) / 4.6
        const rot = time * 0.22
        const R = 560
        ctx.lineWidth = 1.1 / zoom
        ctx.strokeStyle = `rgba(60,130,246,${0.5 * smoothstep(0, 1, tSq)})`
        for (let i = 0; i < 3; i++) {
          const ry = 0.38 * R
          ctx.save()
          ctx.translate(sx(1300), sy(PY))
          ctx.rotate(rot + i * 0.5)
          ctx.beginPath()
          ctx.ellipse(0, 0, R, ry, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        for (let i = 0; i < 6; i++) {
          ctx.save()
          ctx.translate(sx(1300), sy(PY))
          ctx.rotate(rot + i * 0.65)
          ctx.beginPath()
          ctx.ellipse(0, 0, R * 0.72, R * 0.72, 0.6, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        const dots = 120
        for (let j = 0; j < dots; j++) {
          const seed = j * 2654435761
          const u = ((seed % 10000) / 10000) * Math.PI * 2
          const v = (((seed >> 3) % 10000) / 10000) * Math.PI * 2
          const px = Math.cos(u) * Math.sin(v)
          const py = Math.cos(v)
          const pz = Math.sin(u) * Math.sin(v)
          const rx = px * Math.cos(rot) - pz * Math.sin(rot)
          const rz = px * Math.sin(rot) + pz * Math.cos(rot)
          const depth = (rz + 1) / 2
          ctx.fillStyle = `rgba(167,139,250,${(0.12 + depth * 0.5) * smoothstep(0, 1, tSq)})`
          ctx.beginPath()
          ctx.arc(sx(1300 + rx * R), sy(PY - py * R), (1 + depth * 1.6), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()

      if (drawnLabels.length > 0) {
        ctx.textAlign = 'center'
        for (const l of drawnLabels) {
          if (l.screenX < -40 || l.screenX > w + 40 || l.screenY < -20 || l.screenY > h + 20) continue
          const alpha = clamp(1 - Math.abs(time - 0) * 0.002, 0.35, 1)
          ctx.fillStyle = hexA(l.color, 0.85 * alpha)
          ctx.font = '600 11px "JetBrains Mono", monospace'
          ctx.fillText(l.text, l.screenX, l.screenY)
          ctx.fillStyle = hexA(l.color, 0.28 * alpha)
          ctx.fillRect(l.screenX - 28, l.screenY + 3, 56, 1)
        }
      }

      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.78)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.55)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [elapsedRef])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

function hexA(hex: string, a: number) {
  const v = hex.replace('#', '')
  const r = parseInt(v.substring(0, 2), 16)
  const g = parseInt(v.substring(2, 4), 16)
  const b = parseInt(v.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

const DORA_S = DORA_STEPS

function useElapsedNow(ref: { current: number }) {
  const [now, setNow] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setNow(ref.current), 150)
    return () => window.clearInterval(id)
  }, [ref])
  return now
}

const chipCls =
  'inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-md'

const DoraTimeline = ({ now }: { now: number }) => {
  const stepIndex = now < DORA_TIMES[0] ? -1 : now < DORA_TIMES[1] ? 0 : now < DORA_TIMES[2] ? 1 : now < DORA_TIMES[3] ? 2 : 3
  return (
    <div className="flex items-center gap-3">
      {DORA_S.map((s, i) => {
        const active = stepIndex === i
        const done = stepIndex > i
        const visible = now > 4.35
        const opacity = now >= 8.3 ? 0.12 : 0.6
        return (
          <div key={s.key} className="flex items-center gap-3">
            {i > 0 && <ArrowRight className="w-4 h-4 text-white/25" />}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: visible ? opacity : 0, y: visible ? 0 : 12 }}
              transition={{ delay: DORA_TIMES[i] - 0.15 }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-md"
              style={{
                borderColor: hexA(s.color, active ? 0.6 : done ? 0.4 : 0.18),
                background: hexA(s.color, active ? 0.08 : 0.03),
                boxShadow: active ? `0 0 20px ${hexA(s.color, 0.2)}` : 'none',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: hexA(s.color, active ? 1 : done ? 0.7 : 0.35), boxShadow: active ? `0 0 10px ${s.color}` : 'none' }}
              />
              <span
                className="font-mono text-xs font-bold tracking-widest transition-colors"
                style={{ color: active || done ? s.color : 'rgba(255,255,255,0.4)' }}
              >
                {s.key}
              </span>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

const MorphIP = ({ start }: { start: number }) => {
  const ipv4 = '192.168.1.25'
  const ipv6 = '2001:db8:1234::25'
  return (
    <div className="flex items-center justify-center gap-6 flex-wrap px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, -30], scale: [1, 1, 1, 0.92] }}
        transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1], delay: start }}
        className="font-mono font-bold text-5xl md:text-6xl"
        style={{ color: PALETTE.blueSoft, textShadow: `0 0 34px ${hexA(PALETTE.blue, 0.55)}` }}
      >
        {ipv4.split('').map((c, i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror', delay: start + (i % 7) * 0.04 }}
          >
            {c}
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: 180 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ duration: 0.9, delay: start + 0.35 }}
        className="flex items-center justify-center w-14 h-14 rounded-full border-2"
        style={{ borderColor: hexA(PALETTE.violet, 0.6), boxShadow: `0 0 30px ${hexA(PALETTE.violet, 0.4)}` }}
      >
        <ArrowLeftRight className="w-6 h-6" style={{ color: PALETTE.violet }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: start + 0.7 }}
        className="font-mono font-black text-5xl md:text-6xl"
        style={{ color: PALETTE.violetSoft, textShadow: `0 0 34px ${hexA(PALETTE.violet, 0.6)}` }}
      >
        {ipv6.split('').map((c, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: start + 0.7 + i * 0.045 }}
          >
            {c}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

interface SceneWrapProps {
  active: boolean
  children: ReactNode
  z?: number
  interactive?: boolean
}

const SceneWrap: FC<SceneWrapProps> = ({ active, children, z = 10, interactive = false }) => (
  <motion.div
    className={`absolute inset-0 ${interactive ? '' : 'pointer-events-none'}`}
    style={{ zIndex: z }}
    initial={{ opacity: 0 }}
    animate={{ opacity: active ? 1 : 0 }}
    transition={{ duration: 1.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
)

const HUDCorners = () => (
  <div className="absolute inset-0 pointer-events-none z-[60]">
    <div className="absolute top-6 left-6 w-6 h-6 border-l border-t border-white/5" />
    <div className="absolute top-6 right-6 w-6 h-6 border-r border-t border-white/5" />
    <div className="absolute bottom-6 left-6 w-6 h-6 border-l border-b border-white/5" />
    <div className="absolute bottom-6 right-6 w-6 h-6 border-r border-b border-white/5" />
  </div>
)

const AmbientGlows = () => (
  <div className="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
    <motion.div
      animate={{ x: [0, 70, 0], y: [0, -50, 0], opacity: [0.14, 0.26, 0.14] }}
      transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[12%] left-[8%] w-[46vw] h-[46vw] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.32), transparent 66%)' }}
    />
    <motion.div
      animate={{ x: [0, -80, 0], y: [0, 60, 0], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      className="absolute bottom-[8%] right-[6%] w-[42vw] h-[42vw] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.28), transparent 66%)' }}
    />
    <motion.div
      animate={{ y: [0, 40, 0], opacity: [0.08, 0.16, 0.08] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      className="absolute top-[42%] left-[40%] w-[30vw] h-[30vw] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22), transparent 66%)' }}
    />
  </div>
)

const MagicDust = () => {
  const motes = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: `${(i * 6.9 + Math.random() * 5) % 100}%`,
        delay: Math.random() * 20,
        dur: 16 + Math.random() * 14,
        s: 2 + Math.random() * 3.2,
        o: 0.1 + Math.random() * 0.2,
        sway: (Math.random() * 2 - 1) * 46,
        c: i % 3 === 0 ? '#C4B5FD' : i % 3 === 1 ? '#B794F6' : '#FDFBF7',
      })),
    []
  )
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {motes.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: m.left, bottom: -14, width: m.s, height: m.s, background: m.c, boxShadow: `0 0 ${m.s * 4}px ${m.c}`, opacity: m.o }}
          animate={{ y: [0, -1400] }}
          transition={{ duration: m.dur, delay: -m.delay, ease: 'linear', repeat: Infinity }}
        >
          <motion.div
            className="w-full h-full"
            animate={{ x: [0, m.sway, 0, -m.sway], opacity: [1, 0.5, 1, 0.4] }}
            transition={{ duration: m.dur * 0.33, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      ))}
    </div>
  )
}

const GodRays = () => (
  <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
    <motion.div
      animate={{ x: ['-120vw', '220vw'] }}
      transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0"
    >
      <div
        className="absolute inset-0"
        style={{
          transform: 'rotate(14deg) scaleX(1.8)',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent)',
        }}
      />
    </motion.div>
    <motion.div
      animate={{ x: ['220vw', '-120vw'] }}
      transition={{ duration: 52, repeat: Infinity, ease: 'linear', delay: 6 }}
      className="absolute inset-0"
    >
      <div
        className="absolute inset-0"
        style={{
          transform: 'rotate(-12deg) scaleX(2.2)',
          background: 'linear-gradient(90deg, transparent, rgba(196,181,253,0.07) 50%, transparent)',
        }}
      />
    </motion.div>
  </div>
)

const Scene1Overlay = ({ now }: { now: number }) => (
  <div className="h-full w-full flex flex-col items-center justify-center relative">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: now > 0.5 && now < 2.5 ? 1 : 0,
        scale: now > 0.5 && now < 2.5 ? 1 : 0.9
      }}
      transition={{ duration: 0.8 }}
      className="text-center z-20"
    >
      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.3em] text-white opacity-80">
        NETWORK CONFIGURATION
      </h2>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: now > 2.5 && now < 4.2 ? 1 : 0,
        scale: now > 2.5 && now < 4.2 ? 1 : 0.9
      }}
      transition={{ duration: 0.8 }}
      className="text-center z-20"
    >
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400"
          style={{ filter: 'drop-shadow(0 0 20px rgba(34,211,238,0.4))' }}>
        DHCPv4 &amp; DHCPv6
      </h2>
    </motion.div>
  </div>
)

const Scene2Overlay = ({ now }: { now: number }) => (
  <div className="h-full w-full relative">
    <div className="absolute left-12 top-14 flex flex-col gap-3 z-20">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: now > 4.2 ? 1 : 0, x: now > 4.2 ? 0 : -24 }}
        transition={{ duration: 0.5 }}
        className={chipCls}
        style={{ borderColor: hexA(PALETTE.amber, 0.5), background: hexA(PALETTE.amber, 0.07), color: PALETTE.amber }}
      >
        <RadioTower className="w-3 h-3" />
        NOUVEL APPAREIL DÉTECTÉ
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: now > 6.5 ? 1 : 0, x: now > 6.5 ? 0 : -24 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1.5 rounded-xl border px-4 py-3 backdrop-blur-md bg-black/10"
        style={{ borderColor: hexA(PALETTE.blue, 0.3) }}
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Pile IPv4</span>
        <span className="font-mono font-bold text-lg text-white" style={{ color: PALETTE.blueSoft }}>
          IPv4 · 192.168.x.x
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: now > 7.2 ? 1 : 0, x: now > 7.2 ? 0 : -24 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1.5 rounded-xl border px-4 py-3 backdrop-blur-md bg-black/10"
        style={{ borderColor: hexA(PALETTE.violet, 0.35) }}
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Pile IPv6</span>
        <span className="font-mono font-bold text-lg" style={{ color: PALETTE.violetSoft }}>
          IPv6 · 2001:db8::/32
        </span>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: now > 4.15 ? 1 : 0, y: now > 4.15 ? 0 : 18 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-x-0 bottom-14 flex justify-center z-20"
    >
      <DoraTimeline now={now} />
    </motion.div>
  </div>
)

const CONFIG_ITEMS: { label: string; value: string; color: string }[] = [
  { label: 'ADRESSE IP', value: '192.168.1.25', color: PALETTE.blueSoft },
  { label: 'MASQUE / PRÉFIXE', value: '255.255.255.0 · /64', color: PALETTE.cyan },
  { label: 'PASSERELLE', value: '192.168.1.1', color: PALETTE.gold },
  { label: 'SERVEUR DNS', value: '8.8.8.8 · 2001:db8::1', color: PALETTE.cyan },
  { label: 'INFORMATION DU BAIL', value: '86400s · RENEW 43200s', color: PALETTE.violetSoft },
]

const Scene3Overlay = () => (
  <div className="h-full w-full flex flex-col items-center justify-center relative">
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 8.5, duration: 0.7 }}
      className="text-center mb-8 z-20"
    >
      <div
        className="inline-flex items-center gap-3 rounded-2xl border px-5 py-3 backdrop-blur-md bg-black/15"
        style={{ borderColor: hexA(PALETTE.cyan, 0.4), boxShadow: `0 0 36px ${hexA(PALETTE.cyan, 0.15)}` }}
      >
        <Server className="w-5 h-5" style={{ color: PALETTE.cyan }} />
        <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: PALETTE.cyan }}>
          SERVEUR DHCP
        </span>
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ color: PALETTE.green }} />
      </div>
    </motion.div>

    <div className="flex flex-col gap-3 z-20 w-[560px]">
      {CONFIG_ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 9 + i * 0.42, duration: 0.55 }}
          className="flex items-center justify-between gap-6 rounded-xl border px-5 py-3 backdrop-blur-md bg-black/10"
          style={{ borderColor: hexA(item.color, 0.4), transform: `translateX(${i * 2}px)` }}
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 9 + i * 0.42 }}
              className="flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background: hexA(item.color, 0.18) }}
            >
              <Check className="w-3 h-3" style={{ color: item.color }} />
            </motion.span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{item.label}</span>
          </div>
          <span className="font-mono text-sm font-bold" style={{ color: item.color }}>
            {item.value}
          </span>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 11.1 }}
      className="mt-7 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35"
    >
      <span className="animate-pulse" style={{ color: PALETTE.gold }}>
        ●
      </span>
      configuration en cours d'envoi vers le client
    </motion.div>
  </div>
)

const Scene4Overlay = () => (
  <div className="h-full w-full flex flex-col items-center justify-center relative">
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 12.3, duration: 0.6 }}
      className="font-mono text-[11px] uppercase tracking-[0.28em] mb-6 z-20 text-white/45"
    >
      ESPACE D'ADRESSES IPv4 · 32 BITS
    </motion.div>

    <div className="z-20">
      <MorphIP start={12.6} />
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 14.2, duration: 0.8 }}
      className="mt-8 text-center z-20"
    >
      <h2
        className="font-black uppercase text-4xl md:text-5xl tracking-wide text-white"
        style={{ textShadow: `0 0 40px ${hexA(PALETTE.gold, 0.45)}` }}
      >
        DE IPv4 À IPv6
      </h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 15 }}
        className="mt-3 font-medium uppercase tracking-[0.3em] text-lg"
        style={{ color: PALETTE.violetSoft }}
      >
        UN RÉSEAU · DEUX GÉNÉRATIONS
      </motion.p>
    </motion.div>
  </div>
)

const LeaseScene = () => (
  <div className="h-full w-full flex flex-col items-center justify-center relative">
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 16.3, duration: 0.9 }}
      className="relative flex items-center justify-center mb-10 z-20 w-44 h-44"
    >
      <motion.span
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: hexA(PALETTE.green, 0.5) }}
        animate={{ scale: [0.7, 1.9], opacity: [0.8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: 16.3 }}
      />
      <motion.span
        className="absolute inset-2 rounded-full border"
        style={{ borderColor: hexA(PALETTE.violet, 0.4) }}
        animate={{ scale: [0.7, 1.7], opacity: [0.7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeOut', delay: 16.6 }}
      />
      <motion.span
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: hexA(PALETTE.green, 0.18) }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: hexA(PALETTE.green, 0.15), border: `1px solid ${hexA(PALETTE.green, 0.5)}` }}
        animate={{ boxShadow: [`0 0 20px ${hexA(PALETTE.green, 0.3)}`, `0 0 46px ${hexA(PALETTE.green, 0.6)}`, `0 0 20px ${hexA(PALETTE.green, 0.3)}`] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShieldCheck className="w-10 h-10" style={{ color: PALETTE.green }} />
      </motion.div>
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 16.8, type: 'spring', stiffness: 70, damping: 22 }}
      className="font-black uppercase tracking-wide text-4xl md:text-5xl z-20"
      style={{ color: PALETTE.white, textShadow: `0 0 40px ${hexA(PALETTE.green, 0.45)}` }}
    >
      Bail Sécurisé
    </motion.h2>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 17.4, duration: 0.8 }}
      className="mt-5 flex flex-wrap items-center justify-center gap-4 z-20"
    >
      <span className="font-mono text-lg font-bold px-5 py-2 rounded-xl border backdrop-blur-md bg-black/10" style={{ borderColor: hexA(PALETTE.violetSoft, 0.5), color: PALETTE.violetSoft }}>
        2001:db8:1234::25
      </span>
      <span className="font-mono text-lg font-bold px-5 py-2 rounded-xl border backdrop-blur-md bg-black/10" style={{ borderColor: hexA(PALETTE.blueSoft, 0.5), color: PALETTE.blueSoft }}>
        192.168.1.25
      </span>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 18.1, duration: 0.8 }}
      className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 z-20"
    >
      TTL 86400s · RENEW 43200s · REBIND 75600s
    </motion.div>
  </div>
)

const Scene5Overlay = () => (
  <div className="h-full w-full flex flex-col items-center justify-center relative pb-6">
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72vw] max-w-4xl h-[52vh] rounded-full pointer-events-none"
      animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.95, 1.06, 0.95] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 21 }}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.4), rgba(11,8,32,0.12) 55%, transparent 72%)',
        filter: 'blur(34px)',
      }}
    />
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 20.5, duration: 0.8 }}
      className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/40 z-20 flex items-center gap-2"
    >
      <Globe className="w-4 h-4" style={{ color: hexA(PALETTE.blueSoft, 0.8) }} />
      AUTOMATISATION RÉSEAU
    </motion.span>

    <motion.h1
      initial={{ opacity: 0, scale: 0.82, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 21, type: 'spring', stiffness: 55, damping: 20 }}
      className="mt-5 text-7xl md:text-[6.5rem] font-black uppercase tracking-tight leading-none text-center z-20"
      style={{ color: PALETTE.white, textShadow: `0 0 60px ${hexA(PALETTE.gold, 0.5)}, 0 0 20px ${hexA(PALETTE.blue, 0.3)}` }}
    >
      DHCPv4 <span style={{ color: PALETTE.gold }}>&amp;</span> DHCPv6
    </motion.h1>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 22, duration: 0.8 }}
      className="mt-6 text-center z-20"
    >
      <p className="text-2xl md:text-3xl font-medium tracking-wide text-white/90">
        Dynamic Host Configuration Protocol
      </p>
      <p className="mt-3 text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
        Comment les appareils rejoignent et communiquent automatiquement sur un réseau
      </p>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 23.2, duration: 0.7 }}
      className="mt-10 z-20 group relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-black uppercase tracking-[0.2em] text-sm"
      style={{
        background: 'linear-gradient(120deg, #B794F6, #8B5CF6 55%, #C4B5FD)',
        color: '#05040B',
        boxShadow: '0 0 50px rgba(167,139,250,0.45)',
      }}
    >
      <Network className="w-4 h-4" />
      Entrer dans la présentation
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </motion.button>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 23.6 }}
      className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 z-20"
    >
      F11 pour le plein écran · R pour rejouer
    </motion.div>
  </div>
)

export const CinematicIntro: FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(false)
  const [audioOn, setAudioOn] = useState(false)
  const elapsedRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const audioRef = useRef<IntroAudio | null>(null)

  useEffect(() => {
    const audio = new IntroAudio()
    audioRef.current = audio
    const wake = () => {
      void audio.ensure()
    }
    wake()
    const handler = () => wake()
    window.addEventListener('pointerdown', handler)
    window.addEventListener('keydown', handler)
    const t0 = performance.now()
    let raf = 0
    const tick = () => {
      elapsedRef.current = (performance.now() - t0) / 1000
      setActive(clamp(Math.floor(elapsedRef.current / 4), 0, 5))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const timeouts: number[] = []
    const at = (sec: number, fn: () => void) => timeouts.push(window.setTimeout(fn, sec * 1000))
    DORA_TIMES.forEach((t) => at(t, () => audio.ensure().then(() => audio.tick())))
    at(8, () => audio.ensure().then(() => audio.swell()))
    at(12, () => audio.ensure().then(() => audio.swell()))
    at(15.4, () => audio.ensure().then(() => audio.riser()))
    at(16.2, () => audio.ensure().then(() => audio.boom()))
    at(17.1, () => audio.ensure().then(() => audio.tick()))
    at(19.6, () => audio.ensure().then(() => audio.riser()))
    at(20.3, () => audio.ensure().then(() => audio.boom()))
    at(21.1, () => audio.ensure().then(() => audio.tick()))
    at(END_TIME, () => onCompleteRef.current())

    const firstSoundTimer = window.setTimeout(() => setAudioOn(true), 2000)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('keydown', handler)
      timeouts.forEach((t) => window.clearTimeout(t))
      window.clearTimeout(firstSoundTimer)
      audio.dispose()
      audioRef.current = null
    }
  }, [])

  const now = useElapsedNow(elapsedRef)
  const toggleMute = () => {
    setMuted((m) => {
      const nm = !m
      audioRef.current?.setMuted(nm)
      return nm
    })
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" style={{ background: PALETTE.bg }}>
      <NetworkBackdrop elapsedRef={elapsedRef} />
      <motion.div
        className="absolute inset-0 z-0 mix-blend-screen"
        initial={{ scale: 1.02 }}
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}runway/bg-05.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <AmbientGlows />
      <GodRays />
      <MagicDust />
      <HUDCorners />


      <SceneWrap active={active === 0}>
        <Scene1Overlay now={now} />
      </SceneWrap>
      <SceneWrap active={active === 1}>
        <Scene2Overlay now={now} />
      </SceneWrap>
      <SceneWrap active={active === 2}>
        <Scene3Overlay />
      </SceneWrap>
      <SceneWrap active={active === 3}>
        <Scene4Overlay />
      </SceneWrap>
      <SceneWrap active={active === 4}>
        <LeaseScene />
      </SceneWrap>
      <SceneWrap active={active === 5} interactive>
        <Scene5Overlay />
      </SceneWrap>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: active === 5 ? 1 : 0 }}
        transition={{ delay: 23.5, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[70] w-40"
      >
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #B794F6, #8B5CF6, #C4B5FD)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: END_TIME, ease: 'linear' }}
          />
        </div>
      </motion.div>

      <div className="absolute top-5 right-9 z-[80] flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/70 backdrop-blur-md hover:border-white/30 transition-colors"
        >
          {muted || !audioOn ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{muted ? 'OFF' : 'SON'}</span>
        </button>
        <button
          onClick={() => onCompleteRef.current()}
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/70 backdrop-blur-md hover:border-white/30 hover:text-white transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Skip</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.7, delay: 8, times: [0, 0.4, 1] }}
        className="absolute inset-0 pointer-events-none z-[55]"
        style={{ background: `radial-gradient(circle at 60% 40%, ${hexA(PALETTE.cyan, 0.16)}, transparent 70%)` }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.7, delay: 12, times: [0, 0.4, 1] }}
        className="absolute inset-0 pointer-events-none z-[55]"
        style={{ background: `radial-gradient(circle at 55% 45%, ${hexA(PALETTE.violet, 0.2)}, transparent 70%)` }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.6, delay: 16.1, times: [0, 0.4, 1] }}
        className="absolute inset-0 pointer-events-none z-[55]"
        style={{ background: `radial-gradient(circle at 50% 50%, ${hexA(PALETTE.gold, 0.22)}, transparent 72%)` }}
      />
    </div>
  )
}