'use client'

import React, { useRef } from 'react'
import {
  CAP23_TABS,
  type Cap23CaNamData,
  type Cap23HocKyData,
  type Cap23TongKetRow,
} from './results-data'

interface Cap23ScreenProps {
  activeTabIndex: number
  onSelectTab: (index: number) => void
  hocKyData?: Cap23HocKyData
  caNamData?: Cap23CaNamData
  hocKyLabel: string
}

function TongKetTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: Cap23TongKetRow[]
}) {
  const isSingleCol = columns.length === 1
  return (
    <div className="eco-gradetbl">
      <div className="eco-gradetbl__head">
        <div
          className="eco-gradetbl__cell eco-gradetbl__cell--center"
          style={{
            flex: isSingleCol ? 1 : 1.2,
            borderRight: '1px solid #F3E0A8',
          }}
        >
          Danh mục
        </div>
        {columns.map((col, idx) => (
          <div
            key={col}
            className="eco-gradetbl__cell eco-gradetbl__cell--center"
            style={{
              flex: 1,
              borderLeft: idx > 0 ? '1px solid #F3E0A8' : undefined,
            }}
          >
            {col}
          </div>
        ))}
      </div>
      <div>
        {rows.map((row) => (
          <div
            key={row.danhMuc}
            className="eco-gradetbl__row eco-gradetbl__row--tinted"
          >
            <div
              className="eco-gradetbl__cell eco-gradetbl__cell--tinted"
              style={{
                flex: isSingleCol ? 1 : 1.2,
                padding: '14px 12px',
              }}
            >
              {row.danhMuc}
            </div>
            {row.values.map((v, i) => (
              <div
                key={i}
                className="eco-gradetbl__cell eco-gradetbl__cell--center"
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  fontWeight: v !== '—' ? 700 : 400,
                  borderLeft: i > 0 ? '1px solid #F0F0F0' : undefined,
                }}
              >
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const MON_HOC_W = 120
const SUB_W = 44
const RESULT_W = 64
const GRID_COLS = `${MON_HOC_W}px repeat(5, ${SUB_W}px) ${RESULT_W}px ${RESULT_W}px ${RESULT_W}px`

function BangDiemHeader() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: GRID_COLS,
        background: '#FFF0C2',
        color: '#3B3E40',
        fontSize: 14,
        fontWeight: 700,
        borderBottom: '1px solid #F3E0A8',
      }}
    >
      <div
        style={{
          gridColumn: '1 / 2',
          position: 'sticky',
          left: 0,
          zIndex: 10,
          background: '#FFF0C2',
          borderRight: '1px solid #F3E0A8',
          padding: '14px 12px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Môn học
      </div>
      <div
        style={{
          gridColumn: '2 / 7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 8px',
          borderRight: '1px solid #F3E0A8',
        }}
      >
        ĐĐGTX
      </div>
      <div
        style={{
          gridColumn: '7 / 8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 4px',
          textAlign: 'center',
          lineHeight: '18px',
          borderRight: '1px solid #F3E0A8',
        }}
      >
        ĐĐG
        <br />
        GK
      </div>
      <div
        style={{
          gridColumn: '8 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 4px',
          textAlign: 'center',
          lineHeight: '18px',
          borderRight: '1px solid #F3E0A8',
        }}
      >
        ĐĐG
        <br />
        CK
      </div>
      <div
        style={{
          gridColumn: '9 / 10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 4px',
          textAlign: 'center',
          lineHeight: '18px',
        }}
      >
        TBHK
      </div>
    </div>
  )
}

function BangDiemTable({ hocKyData }: { hocKyData: Cap23HocKyData }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(
    null
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    dragRef.current = { startX: e.clientX, startScrollLeft: el.scrollLeft }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el || !dragRef.current) return
    e.preventDefault()
    el.scrollLeft =
      dragRef.current.startScrollLeft - (e.clientX - dragRef.current.startX)
  }
  const endDrag = () => {
    dragRef.current = null
  }

  return (
    <div
      ref={scrollRef}
      className="eco-gradetbl-scroll"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <div style={{ minWidth: MON_HOC_W + SUB_W * 5 + RESULT_W * 3 }}>
        <BangDiemHeader />
        <div>
          {hocKyData.bangDiem.map((row, rowIdx) => (
            <div
              key={row.name}
              style={{
                display: 'grid',
                gridTemplateColumns: GRID_COLS,
                fontSize: 14,
                color: '#232628',
                borderTop: rowIdx > 0 ? '1px solid #F0F0F0' : undefined,
                background: '#FFFFFF',
              }}
            >
              <div
                style={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  background: '#FFFFFF',
                  borderRight: '1px solid #F0F0F0',
                  padding: '14px 12px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {row.name}
              </div>
              {row.ddgtx.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 4px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid #F0F0F0',
                  }}
                >
                  {v}
                </div>
              ))}
              <div
                style={{
                  padding: '14px 4px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: row.ddggk !== '—' ? 700 : 400,
                  borderRight: '1px solid #F0F0F0',
                }}
              >
                {row.ddggk}
              </div>
              <div
                style={{
                  padding: '14px 4px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: row.ddgck !== '—' ? 700 : 400,
                  borderRight: '1px solid #F0F0F0',
                }}
              >
                {row.ddgck}
              </div>
              <div
                style={{
                  padding: '14px 4px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: row.tbhk !== '—' ? 700 : 400,
                }}
              >
                {row.tbhk}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Cap23Screen({
  activeTabIndex,
  onSelectTab,
  hocKyData,
  caNamData,
  hocKyLabel,
}: Cap23ScreenProps) {
  const isCaNam = activeTabIndex === 2

  return (
    <>
      {/* Period Tabs Bar (Học kỳ I | Học kỳ II | Cả năm) */}
      <div className="eco-periodtabs eco-periodtabs--equal">
        {CAP23_TABS.map((tab, idx) => {
          const isActive = idx === activeTabIndex
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(idx)}
              className={`eco-periodtabs__tab ${isActive ? 'is-active' : ''}`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Scrollable Body over Pattern Background */}
      <div className="kqht-scroll-body eco-pattern-bg">
        {isCaNam && caNamData && (
          <>
            <div className="eco-gradecard">
              <h3 className="eco-gradecard__title" style={{ marginBottom: 12 }}>
                Tổng kết học kỳ, năm học
              </h3>
              <TongKetTable
                columns={['Học kỳ I', 'Học kỳ II', 'Tổng kết']}
                rows={caNamData.tongKet}
              />
              <div className="eco-gradecard__note">
                <p className="eco-gradecard__note-title">Ghi chú</p>
                <p className="eco-gradecard__note-line">
                  T: Tốt, K: Khá, Đ: Đạt, CD: Chưa đạt
                </p>
                <p className="eco-gradecard__note-line">
                  G: Giỏi, TT: Tiên tiến, XS: Xuất sắc
                </p>
              </div>
            </div>

            <div className="eco-gradecard">
              <h3 className="eco-gradecard__title" style={{ marginBottom: 12 }}>
                Kết quả học tập
              </h3>
              <div
                style={{
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  padding: '36px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: '2px dashed #D1D5DB',
                  }}
                />
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>
                  Chưa có dữ liệu kết quả học tập.
                </span>
              </div>
            </div>
          </>
        )}

        {!isCaNam && hocKyData && (
          <>
            {/* Card 1: Tổng kết học kỳ */}
            <div className="eco-gradecard">
              <h3 className="eco-gradecard__title" style={{ marginBottom: 12 }}>
                Tổng kết học kỳ
              </h3>
              <TongKetTable columns={[hocKyLabel]} rows={hocKyData.tongKet} />
              <div className="eco-gradecard__note">
                <p className="eco-gradecard__note-title">Ghi chú</p>
                <p className="eco-gradecard__note-line">
                  T: Tốt, K: Khá, Đ: Đạt, CD: Chưa đạt
                </p>
                <p className="eco-gradecard__note-line">
                  G: Giỏi, TT: Tiên tiến, XS: Xuất sắc
                </p>
              </div>
            </div>

            {/* Card 2: Kết quả học tập */}
            <div className="eco-gradecard">
              <h3 className="eco-gradecard__title" style={{ marginBottom: 12 }}>
                Kết quả học tập
              </h3>
              <BangDiemTable hocKyData={hocKyData} />
              <div className="eco-gradecard__note">
                <p className="eco-gradecard__note-title">Ghi chú</p>
                <p className="eco-gradecard__note-line">
                  ĐĐGTX: Điểm đánh giá thường xuyên
                </p>
                <p className="eco-gradecard__note-line">
                  ĐĐGGK: Điểm đánh giá giữa kỳ
                </p>
                <p className="eco-gradecard__note-line">
                  ĐĐGCK: Điểm đánh giá cuối kỳ
                </p>
                <p className="eco-gradecard__note-line">
                  TBHK: Trung bình học kỳ
                </p>
                <p className="eco-gradecard__note-line">
                  KTĐK: Kiểm tra định kỳ
                </p>
              </div>
            </div>

            {/* Card 3: Nhận xét của giáo viên bộ môn */}
            <div className="eco-gradecard">
              <h3 className="eco-gradecard__title" style={{ marginBottom: 12 }}>
                Nhận xét của giáo viên bộ môn
              </h3>
              {hocKyData.nhanXet.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    padding: '12px 0',
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#9CA3AF',
                  }}
                >
                  Chưa có nhận xét từ giáo viên bộ môn.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {hocKyData.nhanXet.map((nx) => (
                    <div key={nx.subject} className="eco-gradetbl-comment">
                      <p className="eco-gradetbl-comment__subj">{nx.subject}</p>
                      <p className="eco-gradetbl-comment__text">{nx.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
