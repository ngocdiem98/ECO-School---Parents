'use client'

import { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { fmtMoney, type BillItem } from '@/lib/mock-data'
import { fmtDong } from './bill-year'

// BillItem has no category field; the mock data names items consistently, so
// derive it: học phí / tiền ăn collapse across months, anything else is its
// own category (Cơ sở vật chất, Tiếng Anh, Ngoại khóa, …).
function categoryOf(item: BillItem): string {
  const name = item.name
  if (/^học phí/i.test(name)) return 'Học phí'
  if (/^tiền ăn/i.test(name)) return 'Tiền ăn'
  return name
}

// Up to 5 categories are shown as they are. With more, the 4 largest stay and
// the rest fold into one "Còn lại" segment (opened from its legend row).
const MAX_CATEGORIES = 5
const OTHER_ID = '__other'
const OTHER_LABEL = 'Còn lại'
// Brand palette; "Còn lại" always takes the last (grey) shade.
const SEGMENT_COLORS = ['#0070ce', '#e36301', '#00305e', '#2dc26d', '#595959']

export interface Segment {
  id: string
  label: string
  color: string
  amount: number
  pct: number
  // Only on the grouped "Còn lại" segment: the categories folded into it.
  children?: { label: string; amount: number }[]
}

export function buildSegments(items: BillItem[]): Segment[] {
  const byCat = new Map<string, number>()
  items.forEach((it) => byCat.set(categoryOf(it), (byCat.get(categoryOf(it)) ?? 0) + it.amount))
  const cats = [...byCat.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const raw: { id: string; label: string; amount: number; children?: Segment['children'] }[] = []
  if (cats.length > MAX_CATEGORIES) {
    cats.slice(0, MAX_CATEGORIES - 1).forEach((c) => raw.push({ id: c.label, ...c }))
    const rest = cats.slice(MAX_CATEGORIES - 1)
    raw.push({ id: OTHER_ID, label: OTHER_LABEL, amount: sumOf(rest), children: rest })
  } else {
    cats.forEach((c) => raw.push({ id: c.label, ...c }))
  }

  const pcts = toPercents(raw.map((r) => r.amount))
  return raw.map((r, i) => ({
    ...r,
    pct: pcts[i],
    color: r.id === OTHER_ID ? SEGMENT_COLORS[SEGMENT_COLORS.length - 1] : SEGMENT_COLORS[i],
  }))
}

const sumOf = (xs: { amount: number }[]) => xs.reduce((n, x) => n + x.amount, 0)

// Largest-remainder rounding so the legend percentages always add up to 100.
function toPercents(values: number[]): number[] {
  const total = values.reduce((a, b) => a + b, 0)
  if (!total) return values.map(() => 0)
  const raw = values.map((v) => (v / total) * 100)
  const floors = raw.map(Math.floor)
  let left = 100 - floors.reduce((a, b) => a + b, 0)
  const order = raw.map((r, i) => ({ i, rem: r - floors[i] })).sort((a, b) => b.rem - a.rem)
  for (const { i } of order) {
    if (left <= 0) break
    floors[i] += 1
    left -= 1
  }
  return floors
}

const pctLabel = (s: Segment) => (s.pct === 0 && s.amount > 0 ? '<1%' : `${s.pct}%`)

// --- Donut ----------------------------------------------------------------

// Geometry in a 346 x 206 box (the phone's content width). The ring sits in
// the middle; labels (% chip + name) are spread over the left and right
// columns and joined to their slice by a straight leader line.
const VB_W = 346
const VB_H = 206
const CX = VB_W / 2
const CY = VB_H / 2
const R = 62 // ring centre radius
const RING = 28 // ring thickness
const CIRC = 2 * Math.PI * R
const LABEL_H = 30 // % chip
const LABEL_GAP = 6
const LEFT_EDGE = 76 // x where a left label's chip ends / its leader starts
const RIGHT_EDGE = VB_W - 76

interface Placed {
  seg: Segment
  side: 'left' | 'right'
  // Point on the ring edge (leader line start) and the radial point that
  // decides the label's height.
  edge: [number, number]
  elbow: [number, number]
  top: number // label top (px in the 346 x 206 box)
}

// Slice mid-angles decide the side; each side stacks its labels top to bottom
// in slice order, nudged apart so they never overlap.
function placeLabels(segments: Segment[]): Placed[] {
  const total = segments.reduce((n, x) => n + x.amount, 0)
  let acc = 0
  const raw = segments.map((seg) => {
    const mid = (acc + seg.amount / 2) / total
    acc += seg.amount
    const th = mid * 2 * Math.PI // from 12 o'clock, clockwise
    const dx = Math.sin(th)
    const dy = -Math.cos(th)
    const edge: [number, number] = [CX + (R + RING / 2 + 2) * dx, CY + (R + RING / 2 + 2) * dy]
    const elbow: [number, number] = [CX + (R + RING / 2 + 12) * dx, CY + (R + RING / 2 + 12) * dy]
    return { seg, side: (dx >= 0 ? 'right' : 'left') as 'left' | 'right', edge, elbow, top: elbow[1] - LABEL_H / 2 }
  })
  for (const side of ['left', 'right'] as const) {
    const group = raw.filter((r) => r.side === side).sort((a, b) => a.top - b.top)
    group.forEach((r, i) => {
      if (i > 0) r.top = Math.max(r.top, group[i - 1].top + LABEL_H + LABEL_GAP)
    })
    // Shift the whole stack up if it runs past the bottom edge.
    const overflow = group.length ? group[group.length - 1].top + LABEL_H - VB_H : 0
    if (overflow > 0) group.forEach((r) => (r.top -= overflow))
    group.forEach((r) => (r.top = Math.max(r.top, 0)))
  }
  return raw
}

// Ring with a % chip per slice, joined by a dotted leader line. Not
// interactive; the amounts are in the legend below.
function DonutChart({ segments }: { segments: Segment[] }) {
  const total = sumOf(segments)
  const placed = placeLabels(segments)
  let offset = 0
  return (
    <div className="ov-donut-wrap" role="img" aria-label="Phân bổ danh mục">
      <svg className="ov-donut" viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--c-blue-50)" strokeWidth={RING + 12} />
        {placed.map(({ seg, side, edge, top }) => {
          const endX = side === 'left' ? LEFT_EDGE : RIGHT_EDGE
          const endY = top + LABEL_H / 2
          return (
            <line
              key={seg.id}
              x1={edge[0]}
              y1={edge[1]}
              x2={endX}
              y2={endY}
              stroke="var(--c-gray-400)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="0.1 4"
            />
          )
        })}
        <g transform={`rotate(-90 ${CX} ${CY})`}>
          {segments.map((s) => {
            const len = (s.amount / total) * CIRC
            const gap = segments.length > 1 ? 2.5 : 0
            const dash = Math.max(len - gap, 0.8)
            const el = (
              <circle
                key={s.id}
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={RING}
                strokeDasharray={`${dash} ${CIRC - dash}`}
                strokeDashoffset={-(offset + gap / 2)}
              />
            )
            offset += len
            return el
          })}
        </g>
      </svg>
      {placed.map(({ seg, side, top }) => (
        <div
          key={seg.id}
          className={`ov-donut-label ov-donut-label--${side}`}
          style={{ top: `${(top / VB_H) * 100}%` }}
        >
          <span className="ov-pct">
            <span className="ov-dot" style={{ background: seg.color }} />
            {pctLabel(seg)}
          </span>
        </div>
      ))}
    </div>
  )
}

// "Phân bổ danh mục": the ring (with a % chip per slice), then one row per
// category (colour, name, amount). The "Còn lại" row opens a bottom sheet with the folded categories.
// Used by the Tổng quan screen; `paidItems` are the paid items of the school year.
export function CategoryDonut({ paidItems }: { paidItems: BillItem[] }) {
  const [showOther, setShowOther] = useState(false)
  const segments = buildSegments(paidItems)
  const otherSeg = segments.find((s) => s.id === OTHER_ID)

  if (!segments.length) return <div className="ov-hint">Chưa có hóa đơn trong năm học này</div>

  return (
    <>
      <DonutChart segments={segments} />
      <ul className="ov-legend">
        {segments.map((s) => {
          const body = (
            <>
              <span className="ov-dot" style={{ background: s.color }} />
              <span className="ov-legend-name">{s.label}</span>
              <span className="ov-legend-amt">{fmtMoney(s.amount)}</span>
              {s.children && <span className="ov-legend-chev">›</span>}
            </>
          )
          return (
            <li key={s.id}>
              {s.children ? (
                <button type="button" className="ov-legend-row is-link" onClick={() => setShowOther(true)}>
                  {body}
                </button>
              ) : (
                <div className="ov-legend-row">{body}</div>
              )}
            </li>
          )
        })}
      </ul>

      {showOther && otherSeg?.children && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowOther(false)} />
          <div className="sheet">
            <div className="sheet-head">
              <span className="t">
                {OTHER_LABEL} · {fmtDong(otherSeg.amount)}
              </span>
              <button className="icon-btn" onClick={() => setShowOther(false)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <div className="sheet-body">
              {otherSeg.children.map((c) => (
                <div className="invoice-line" key={c.label}>
                  <span>{c.label}</span>
                  <span className="amt">{fmtMoney(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </OverlayPortal>
      )}
    </>
  )
}
