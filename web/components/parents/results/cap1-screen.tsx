'use client'

import React from 'react'
import { CAP1_TABS, type Cap1TabData } from './results-data'

interface Cap1ScreenProps {
  activeTabIndex: number
  onSelectTab: (index: number) => void
  data: Cap1TabData
}

function NangLucTable({
  columnLabel,
  rows,
}: {
  columnLabel: string
  rows: { name: string; mucDatDuoc: string }[]
}) {
  return (
    <div className="eco-gradetbl">
      <div className="eco-gradetbl__head">
        <div className="eco-gradetbl__cell eco-gradetbl__cell--grow">
          {columnLabel}
        </div>
        <div
          className="eco-gradetbl__cell eco-gradetbl__cell--center eco-gradetbl__cell--bl"
          style={{ width: 132, flexShrink: 0 }}
        >
          Mức đạt được
        </div>
      </div>
      <div>
        {rows.map((row) => (
          <div key={row.name} className="eco-gradetbl__row">
            <div className="eco-gradetbl__cell eco-gradetbl__cell--grow">
              {row.name}
            </div>
            <div
              className="eco-gradetbl__cell eco-gradetbl__cell--center eco-gradetbl__cell--bl"
              style={{ width: 132, flexShrink: 0, fontWeight: 600 }}
            >
              {row.mucDatDuoc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Cap1Screen({
  activeTabIndex,
  onSelectTab,
  data,
}: Cap1ScreenProps) {
  return (
    <>
      {/* Period Tabs Bar (Giữa học kỳ I | Học kỳ I | Giữa học kỳ II | Cuối năm) */}
      <div className="eco-periodtabs">
        {CAP1_TABS.map((tab, idx) => {
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
        {/* Card 1: Năng lực cốt lõi, phẩm chất chủ yếu */}
        <div className="eco-gradecard">
          <h3 className="eco-gradecard__title eco-gradecard__title--bordered">
            Năng lực cốt lõi, phẩm chất chủ yếu
          </h3>

          <div className="eco-gradecard__section">
            <h4 className="eco-gradecard__subtitle">Năng lực chung</h4>
            <NangLucTable columnLabel="Năng lực" rows={data.nangLucChung} />
          </div>

          <div className="eco-gradecard__section">
            <h4 className="eco-gradecard__subtitle">Năng lực đặc thù</h4>
            <NangLucTable columnLabel="Năng lực" rows={data.nangLucDacThu} />
          </div>

          <div className="eco-gradecard__section--last">
            <h4 className="eco-gradecard__subtitle">Phẩm chất chủ yếu</h4>
            <NangLucTable columnLabel="Phẩm chất" rows={data.phamChat} />
          </div>

          <div className="eco-gradecard__note">
            <p className="eco-gradecard__note-title">Ghi chú</p>
            <p className="eco-gradecard__note-line">
              T: Tốt, Đ: Đạt, C: Cần cố gắng
            </p>
          </div>
        </div>

        {/* Card 2: Kết quả học tập môn học */}
        <div className="eco-gradecard">
          <h3 className="eco-gradecard__title" style={{ marginBottom: 12 }}>
            Kết quả học tập
          </h3>
          <div className="eco-gradetbl">
            <div className="eco-gradetbl__head">
              <div className="eco-gradetbl__cell eco-gradetbl__cell--grow">
                Môn học
              </div>
              <div
                className="eco-gradetbl__cell eco-gradetbl__cell--center eco-gradetbl__cell--bl"
                style={{ width: 68, flexShrink: 0 }}
              >
                KTĐK
              </div>
              <div
                className="eco-gradetbl__cell eco-gradetbl__cell--center eco-gradetbl__cell--bl"
                style={{ width: 116, flexShrink: 0 }}
              >
                Mức đạt được
              </div>
            </div>
            <div>
              {data.monHoc.map((row) => (
                <div key={row.name} className="eco-gradetbl__row">
                  <div className="eco-gradetbl__cell eco-gradetbl__cell--grow">
                    {row.name}
                  </div>
                  <div
                    className="eco-gradetbl__cell eco-gradetbl__cell--center eco-gradetbl__cell--bl"
                    style={{ width: 68, flexShrink: 0, fontWeight: 600 }}
                  >
                    {row.ktdk}
                  </div>
                  <div
                    className="eco-gradetbl__cell eco-gradetbl__cell--center eco-gradetbl__cell--bl"
                    style={{ width: 116, flexShrink: 0, fontWeight: 600 }}
                  >
                    {row.mucDatDuoc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="eco-gradecard__note">
            <p className="eco-gradecard__note-title">Ghi chú</p>
            <p className="eco-gradecard__note-line">
              T: Hoàn thành tốt, H: Hoàn thành, C: Chưa hoàn thành
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
