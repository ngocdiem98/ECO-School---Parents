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

const MAX_SEGMENTS = 4
// A category under this share of the total is folded into "Khác".
const MIN_SEGMENT_SHARE = 0.05
const OTHER_ID = '__other'
// Brand palette (blue, yellow, dark blue); "Khác" always takes the last,
// lightest shade.
const SEGMENT_COLORS = ['#0070ce', '#ffcc33', '#002c54', '#b8d4ee']

interface Segment {
  id: string
  label: string
  color: string
  amount: number
  pct: number
  // Only on the grouped "Khác" segment: the categories folded into it.
  children?: { label: string; amount: number }[]
}

// Categories under MIN_SEGMENT_SHARE of the total are folded into one "Khác"
// (its own total may exceed that share). At most MAX_SEGMENTS segments: if more
// remain, the smallest ones are folded into "Khác" as well.
function buildSegments(items: BillItem[]): Segment[] {
  const byCat = new Map<string, number>()
  items.forEach((it) => byCat.set(categoryOf(it), (byCat.get(categoryOf(it)) ?? 0) + it.amount))
  const cats = [...byCat.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
  const total = sumOf(cats)

  let head = cats.filter((c) => c.amount / total >= MIN_SEGMENT_SHARE)
  let rest = cats.filter((c) => c.amount / total < MIN_SEGMENT_SHARE)
  if (head.length + (rest.length ? 1 : 0) > MAX_SEGMENTS) {
    const keep = MAX_SEGMENTS - 1
    rest = [...head.slice(keep), ...rest]
    head = head.slice(0, keep)
  }
  const raw = head.map((c) => ({ id: c.label, label: c.label, amount: c.amount, children: undefined as Segment['children'] }))
  if (rest.length) raw.push({ id: OTHER_ID, label: 'Khác', amount: sumOf(rest), children: rest })

  const pcts = toPercents(raw.map((r) => r.amount))
  return raw.map((r, i) => ({
    ...r,
    pct: pcts[i],
    color: i === raw.length - 1 && raw.length > 1 ? SEGMENT_COLORS[3] : SEGMENT_COLORS[i],
  }))
}

const sumOf = (xs: { amount: number }[]) => xs.reduce((n, x) => n + x.amount, 0)

const pctLabel = (s: Segment) => (s.pct === 0 && s.amount > 0 ? '<1%' : `${s.pct}%`)

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
const LABEL_H = 52 // chip + name
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

function DonutChart({
  segments,
  selected,
  onSelect,
}: {
  segments: Segment[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  const total = segments.reduce((n, s) => n + s.amount, 0)
  const placed = placeLabels(segments)
  let offset = 0
  return (
    <div className="ov-donut-wrap" role="group" aria-label="Phân bổ danh mục">
      <svg className="ov-donut" viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--c-blue-50)" strokeWidth={RING + 12} />
        {placed.map(({ seg, side, edge, top }) => {
          const endX = side === 'left' ? LEFT_EDGE : RIGHT_EDGE
          const endY = top + 15
          return (
            <line
              key={seg.id}
              x1={edge[0]}
              y1={edge[1]}
              x2={endX}
              y2={endY}
              stroke="var(--c-gray-300)"
              strokeWidth="1"
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
                className={`ov-donut-seg ${selected === s.id ? 'active' : ''}`}
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={selected === s.id ? RING + 8 : RING}
                strokeDasharray={`${dash} ${CIRC - dash}`}
                strokeDashoffset={-(offset + gap / 2)}
                role="button"
                tabIndex={0}
                aria-label={`${s.label} ${pctLabel(s)}`}
                aria-pressed={selected === s.id}
                onClick={() => onSelect(s.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(s.id)
                  }
                }}
              />
            )
            offset += len
            return el
          })}
        </g>
      </svg>
      {placed.map(({ seg, side, top }) => (
        <button
          key={seg.id}
          className={`ov-donut-label ov-donut-label--${side} ${selected === seg.id ? 'active' : ''}`}
          style={{ top: `${(top / VB_H) * 100}%` }}
          aria-pressed={selected === seg.id}
          onClick={() => onSelect(seg.id)}
        >
          <span className="ov-pct">
            <span className="ov-dot" style={{ background: seg.color }} />
            {pctLabel(seg)}
          </span>
          <span className="ov-name">{seg.label}</span>
        </button>
      ))}
    </div>
  )
}

// "Phân bổ danh mục": donut + selected-category callout + the "Khác" sheet.
// Shared by the Tổng quan screen and the summary card on the Hóa đơn list.
// `paidItems` are the paid items of the current school year; `showHint` toggles
// the "Chạm vào biểu đồ…" line shown while nothing is selected.
export function CategoryDonut({ paidItems, showHint = true }: { paidItems: BillItem[]; showHint?: boolean }) {
  const [category, setCategory] = useState<string | null>(null)
  const [showOther, setShowOther] = useState(false)

  const segments = buildSegments(paidItems)
  const selectedSeg = segments.find((s) => s.id === category) ?? null
  const otherSeg = segments.find((s) => s.id === OTHER_ID)

  // Tapping the selected segment again clears it. The "Khác" sheet is opened
  // only from the "Xem chi tiết ›" link in the callout.
  const pickSegment = (id: string) => setCategory(category === id ? null : id)

  if (!segments.length) return <div className="ov-hint">Chưa có hóa đơn trong năm học này</div>

  return (
    <>
      <DonutChart segments={segments} selected={category} onSelect={pickSegment} />
      {selectedSeg ? (
        <div className="ov-callout">
          Tổng số tiền ({selectedSeg.label}): <b>{fmtDong(selectedSeg.amount)}</b>
          {selectedSeg.children && (
            <button className="ov-callout-link" onClick={() => setShowOther(true)}>
              Xem chi tiết ›
            </button>
          )}
        </div>
      ) : (
        showHint && <div className="ov-hint">Chạm vào biểu đồ để xem số tiền theo danh mục</div>
      )}

      {showOther && otherSeg?.children && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowOther(false)} />
          <div className="sheet">
            <div className="sheet-head">
              <span className="t">Khác · {fmtDong(otherSeg.amount)}</span>
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
