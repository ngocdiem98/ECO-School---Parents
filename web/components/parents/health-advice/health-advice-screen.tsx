'use client'

import { useState, useRef, useEffect } from 'react'
import { getStudent } from '@/lib/mock-data'
import {
  getActionableHealthAdvice,
  LAST_6_WEEKS,
  DEFAULT_WEEK_ACTIVITIES,
  getRecommendedActivitiesByAge,
  getStudentAgeCategory,
  type HabitWeek,
  type DailyActivity,
} from '@/lib/health-advice-data'
import { WeekPickerSheet } from '@/components/parents/shared/week-picker-sheet'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

export interface HealthAdviceScreenProps {
  studentId: string
  onBack: () => void
  initialTab?: 'targets' | 'habits'
  initialWeekId?: string
  initialShowWeekPicker?: boolean
  initialShowEditModal?: boolean
  initialActiveDropdownIndex?: number | null
}

export function HealthAdviceScreen({
  studentId,
  onBack,
  initialTab = 'targets',
  initialWeekId,
  initialShowWeekPicker = false,
  initialShowEditModal = false,
  initialActiveDropdownIndex = null,
}: HealthAdviceScreenProps) {
  const student = getStudent(studentId)
  const [activeTab, setActiveTab] = useState<'targets' | 'habits'>(initialTab)

  // Week & Day selection in 'habits'
  const [selectedWeek, setSelectedWeek] = useState<HabitWeek>(() => {
    if (initialWeekId) {
      const found = LAST_6_WEEKS.find((w) => w.id === initialWeekId)
      if (found) return found
    }
    return LAST_6_WEEKS[0]
  })
  const [selectedDayKey, setSelectedDayKey] = useState<string>('T2')

  // Modals & Sheets
  const [showWeekPicker, setShowWeekPicker] = useState(initialShowWeekPicker)
  const [showEditHabitsModal, setShowEditHabitsModal] = useState(initialShowEditModal)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(initialActiveDropdownIndex)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])

  // Close dropdown when clicking anywhere outside or pressing Escape
  useEffect(() => {
    if (activeDropdownIndex === null) return

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      const activeFieldEl = dropdownRefs.current[activeDropdownIndex]
      if (activeFieldEl && !activeFieldEl.contains(target)) {
        setActiveDropdownIndex(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdownIndex(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeDropdownIndex])

  const ageCategory = student
    ? getStudentAgeCategory(student.dob)
    : { key: 'age_4_6' as const, label: '4–6 tuổi (Chồi & Lá)', ageYears: 6 }
  const recommendedActivities = student ? getRecommendedActivitiesByAge(student.dob) : []

  // 3 Activities configured per week (defaults to DEFAULT_WEEK_ACTIVITIES)
  const [weekActivities, setWeekActivities] = useState<Record<string, DailyActivity[]>>(() => {
    const map: Record<string, DailyActivity[]> = {}
    LAST_6_WEEKS.forEach((w) => {
      map[w.id] = [...DEFAULT_WEEK_ACTIVITIES]
    })
    return map
  })

  // Habits checked state: weekId -> dayKey -> Record<activityId, boolean>
  const [habitChecks, setHabitChecks] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
    return {
      // hw1: Current week (active day-by-day: 12/18)
      hw1: {
        T2: { act1: true, act2: true, act3: true },  // 3/3 -> Green
        T3: { act1: true, act2: true, act3: true },  // 3/3 -> Green
        T4: { act1: true, act2: true, act3: false }, // 2/3 -> Orange
        T5: { act1: true, act2: true, act3: true },  // 3/3 -> Green
        T6: { act1: true, act2: false, act3: false },// 1/3 -> Orange
        T7: { act1: false, act2: false, act3: false },// 0/3 -> Orange
      },
      // hw2: Past week (15/18 completed - matches "Bé đã hoàn thành 15/18 hoạt động trong tuần")
      hw2: {
        T2: { act1: true, act2: true, act3: true },  // 3/3
        T3: { act1: true, act2: true, act3: true },  // 3/3
        T4: { act1: true, act2: true, act3: true },  // 3/3
        T5: { act1: true, act2: true, act3: true },  // 3/3
        T6: { act1: true, act2: true, act3: false }, // 2/3
        T7: { act1: true, act2: false, act3: false },// 1/3 -> Total 15/18
      },
      // hw3: Past week (16/18 completed)
      hw3: {
        T2: { act1: true, act2: true, act3: true },  // 3/3
        T3: { act1: true, act2: true, act3: true },  // 3/3
        T4: { act1: true, act2: true, act3: true },  // 3/3
        T5: { act1: true, act2: true, act3: true },  // 3/3
        T6: { act1: true, act2: true, act3: true },  // 3/3
        T7: { act1: true, act2: false, act3: false },// 1/3 -> Total 16/18
      },
      // hw4: Past week (14/18 completed)
      hw4: {
        T2: { act1: true, act2: true, act3: true },  // 3/3
        T3: { act1: true, act2: false, act3: true }, // 2/3
        T4: { act1: true, act2: true, act3: true },  // 3/3
        T5: { act1: true, act2: false, act3: true }, // 2/3
        T6: { act1: true, act2: true, act3: true },  // 3/3
        T7: { act1: false, act2: true, act3: false },// 1/3 -> Total 14/18
      },
      // hw5: Past week (15/18 completed)
      hw5: {
        T2: { act1: true, act2: true, act3: true },  // 3/3
        T3: { act1: true, act2: true, act3: true },  // 3/3
        T4: { act1: true, act2: false, act3: true }, // 2/3
        T5: { act1: true, act2: true, act3: true },  // 3/3
        T6: { act1: true, act2: true, act3: true },  // 3/3
        T7: { act1: true, act2: false, act3: false },// 1/3 -> Total 15/18
      },
      // hw6: Past week (13/18 completed)
      hw6: {
        T2: { act1: true, act2: true, act3: true },  // 3/3
        T3: { act1: true, act2: false, act3: false },// 1/3
        T4: { act1: true, act2: true, act3: true },  // 3/3
        T5: { act1: true, act2: false, act3: true }, // 2/3
        T6: { act1: true, act2: true, act3: true },  // 3/3
        T7: { act1: false, act2: true, act3: false },// 1/3 -> Total 13/18
      },
    }
  })

  // Temporary editing state for EditHabitsSheet
  const currentWeekActivities = weekActivities[selectedWeek.id] || DEFAULT_WEEK_ACTIVITIES
  const [editList, setEditList] = useState<DailyActivity[]>(currentWeekActivities)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  if (!student) {
    return (
      <div className="screen health-advice-screen">
        <div className="topbar">
          <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="topbar-title">Gợi ý cho ba mẹ</div>
          <span className="icon-btn-ghost" />
        </div>
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--c-gray-500)' }}>
          Không tìm thấy thông tin học sinh.
        </div>
      </div>
    )
  }

  const advice = getActionableHealthAdvice(student, student.healthHistory)

  // Check if a day has all activities checked
  const isDayAllAchieved = (weekId: string, dayKey: string): boolean => {
    const acts = weekActivities[weekId] || DEFAULT_WEEK_ACTIVITIES
    const dayChecks = habitChecks[weekId]?.[dayKey] || {}
    if (acts.length === 0) return false
    return acts.every((act) => !!dayChecks[act.id])
  }

  // Count checked activities for a day
  const getDayCheckedCount = (weekId: string, dayKey: string): number => {
    const acts = weekActivities[weekId] || DEFAULT_WEEK_ACTIVITIES
    const dayChecks = habitChecks[weekId]?.[dayKey] || {}
    return acts.filter((act) => !!dayChecks[act.id]).length
  }

  // Toggle activity checkbox
  const toggleActivityCheck = (actId: string) => {
    setHabitChecks((prev) => {
      const weekData = prev[selectedWeek.id] || {}
      const dayData = weekData[selectedDayKey] || {}
      const newVal = !dayData[actId]
      return {
        ...prev,
        [selectedWeek.id]: {
          ...weekData,
          [selectedDayKey]: {
            ...dayData,
            [actId]: newVal,
          },
        },
      }
    })
  }

  // Save week activities from edit sheet (filters out empty/skipped activities)
  const handleSaveWeekActivities = () => {
    const validActivities = editList
      .filter((it) => it.title.trim().length > 0)
      .map((it, i) => ({
        ...it,
        id: it.id || `act${i + 1}`,
      }))

    if (validActivities.length === 0) {
      showToast('Vui lòng nhập hoặc chọn ít nhất 1 thói quen cho bé!')
      return
    }

    setWeekActivities((prev) => ({
      ...prev,
      [selectedWeek.id]: validActivities,
    }))
    setShowEditHabitsModal(false)
    showToast(`Đã lưu & áp dụng ${validActivities.length} thói quen cho cả tuần!`)
  }

  // Clear / skip a specific habit slot in the edit modal
  const handleClearSlot = (idx: number) => {
    setEditList((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, title: '', subtitle: '', icon: '🎯' } : it
      )
    )
    if (activeDropdownIndex === idx) {
      setActiveDropdownIndex(null)
    }
  }

  // Open edit modal with 3 slots available
  const handleOpenEditModal = () => {
    const currentActs = weekActivities[selectedWeek.id] || DEFAULT_WEEK_ACTIVITIES
    const paddedList: DailyActivity[] = [
      currentActs[0] ? { ...currentActs[0] } : { id: 'act1', title: '', subtitle: '', icon: '🎯' },
      currentActs[1] ? { ...currentActs[1] } : { id: 'act2', title: '', subtitle: '', icon: '🎯' },
      currentActs[2] ? { ...currentActs[2] } : { id: 'act3', title: '', subtitle: '', icon: '🎯' },
    ]
    setEditList(paddedList)
    setActiveDropdownIndex(null)
    setShowEditHabitsModal(true)
  }

  // When editing habit title in edit sheet
  const handleTitleChange = (idx: number, newTitle: string) => {
    const matchedRec = recommendedActivities.find(
      (r) => r.title.toLowerCase().trim() === newTitle.toLowerCase().trim()
    )
    setEditList((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it
        if (matchedRec) {
          return {
            ...it,
            title: newTitle,
            subtitle: matchedRec.subtitle,
            icon: matchedRec.icon,
          }
        }
        // Custom activity typed by parents: subtitle is EMPTY per user requirement
        return {
          ...it,
          title: newTitle,
          subtitle: '',
        }
      })
    )
  }

  // When selecting a recommended activity from the dropdown
  const handleSelectRecommended = (
    idx: number,
    rec: { title: string; subtitle: string; icon: string }
  ) => {
    setEditList((prev) =>
      prev.map((it, i) =>
        i === idx
          ? { ...it, title: rec.title, subtitle: rec.subtitle, icon: rec.icon }
          : it
      )
    )
    setActiveDropdownIndex(null)
    showToast(`Đã chọn "${rec.title}"`)
  }

  // When parents choose to enter their own custom activity
  const handleCustomActivity = (idx: number) => {
    setEditList((prev) =>
      prev.map((it, i) =>
        i === idx
          ? { ...it, title: '', subtitle: '', icon: '🎯' }
          : it
      )
    )
    setActiveDropdownIndex(null)
  }

  const isCurrentWeek = Boolean(selectedWeek.isCurrent)

  // Total completed activities in a week (out of 18: 3 acts/day x 6 days)
  const getWeekCompletedCount = (weekId: string): number => {
    const weekData = habitChecks[weekId] || {}
    const acts = weekActivities[weekId] || DEFAULT_WEEK_ACTIVITIES
    let count = 0
    selectedWeek.daysList.forEach((d) => {
      const dayData = weekData[d.key] || {}
      acts.forEach((act) => {
        if (dayData[act.id]) count++
      })
    })
    return count
  }

  // Delivery date & measurement comparison metrics
  const currentRecord = student.healthHistory?.[0] || {
    heightCm: student.heightCm,
    weightKg: student.weightKg,
    zScore: student.zScore,
    recordedAt: '15/08/2026',
  }
  const prevRecord = student.healthHistory?.[1] || {
    heightCm: Math.max(80, student.heightCm - 1),
    weightKg: Math.max(10, +(student.weightKg - 0.5).toFixed(1)),
    zScore: student.zScore,
    recordedAt: '15/06/2026',
  }

  const weightDiff = +(currentRecord.weightKg - prevRecord.weightKg).toFixed(1)
  const heightDiff = +(currentRecord.heightCm - prevRecord.heightCm).toFixed(1)
  const zScoreDiff = +(currentRecord.zScore - prevRecord.zScore).toFixed(1)

  // Selected day object
  const currentDayInfo =
    selectedWeek.daysList.find((d) => d.key === selectedDayKey) || selectedWeek.daysList[0]

  return (
    <div className="screen health-advice-screen">
      {/* 1. ECO.NavBar */}
      <div
        className="eco-navbar"
        style={{
          background: 'var(--bg-surface, #ffffff)',
          borderBottom: '1px solid var(--border-subtle, #f0f0f0)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="eco-navbar__side">
          <button
            type="button"
            className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost"
            onClick={onBack}
            aria-label="Quay lại hồ sơ học sinh"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" />
            </svg>
          </button>
        </div>
        <div className="eco-navbar__title">Gợi ý cho ba mẹ</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </div>

      {/* White Header Section for Segmented Tabs */}
      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          padding: '10px 16px 12px',
          borderBottom: '1px solid var(--border-subtle, #f0f0f0)',
        }}
      >
        <div className="advice-tabs" style={{ margin: 0 }}>
          <button
            type="button"
            className={`advice-tab-btn ${activeTab === 'targets' ? 'active' : ''}`}
            onClick={() => setActiveTab('targets')}
          >
            🎯 Mục tiêu
          </button>
          <button
            type="button"
            className={`advice-tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            ✅ Thói quen
          </button>
        </div>
      </div>

      <div className="health-advice-scroll">
        {/* Tab 1: Mục tiêu */}
        {activeTab === 'targets' && (
          <div className="advice-section-wrap pb-20" style={{ paddingTop: 12 }}>
            {/* Headline Card */}
            <div className="advice-headline-box">
              <div className="advice-headline-title">{advice.target.adviceHeadline}</div>
              <div className="advice-headline-desc">{advice.target.adviceSubtext}</div>
              {advice.trendSummary && (
                <div style={{ fontSize: '12px', color: 'var(--eco-blue, #0070CE)', fontWeight: 700, marginTop: '8px' }}>
                  📈 {advice.trendSummary}
                </div>
              )}
            </div>

            {/* Dedicated Z-Score Card */}
            <div className="advice-zscore-hero-card">
              <div className="metric-card-top-row">
                <div className="metric-card-title-group">
                  <span
                    className="eco-tile__icon eco-tile__icon--blue"
                    style={{ width: 32, height: 32, borderRadius: 10, color: '#ffffff' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 17V13M12 17V7M17 17V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2.5 12C2.5 7.522 2.5 5.282 3.891 3.891C5.282 2.5 7.522 2.5 12 2.5C16.478 2.5 18.718 2.5 20.109 3.891C21.5 5.282 21.5 7.522 21.5 12C21.5 16.478 21.5 18.718 20.109 20.109C18.718 21.5 16.478 21.5 12 21.5C7.522 21.5 5.282 21.5 3.891 20.109C2.5 18.718 2.5 16.478 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="metric-card-name">Chỉ số Z-score</span>
                </div>
              </div>

              {/* Comparison flow between previous measurement and current measurement */}
              <div className="metric-card-compare-flow">
                <div className="compare-flow-col prev">
                  <span className="flow-col-label">Kỳ trước ({prevRecord.recordedAt})</span>
                  <span className="flow-col-value">
                    {prevRecord.zScore > 0 ? '+' : ''}{prevRecord.zScore.toFixed(1)} <small>SD</small>
                  </span>
                </div>
                <div className="compare-flow-arrow">
                  <span>→</span>
                </div>
                <div className="compare-flow-col curr">
                  <span className="flow-col-label">Gần nhất ({currentRecord.recordedAt})</span>
                  <div className="compare-flow-val-group">
                    <span className="flow-col-value highlight">
                      {currentRecord.zScore > 0 ? '+' : ''}{currentRecord.zScore.toFixed(1)} <small>SD</small>
                    </span>
                    {zScoreDiff > 0 && (
                      <span className="zscore-gap-badge positive">+ {zScoreDiff.toFixed(1)}</span>
                    )}
                    {zScoreDiff < 0 && (
                      <span className="zscore-gap-badge negative">- {Math.abs(zScoreDiff).toFixed(1)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual WHO Z-Score Gauge Bar */}
              <div className="zscore-who-gauge-box">
                <div className="zscore-gauge-legend">
                  <span className="legend-item under">&lt; -2 (Thiếu cân)</span>
                  <span className="legend-item normal">[-2 đến +2] Vùng chuẩn WHO</span>
                  <span className="legend-item over">&gt; +2 (Thừa cân)</span>
                </div>
                <div className="zscore-gauge-bar">
                  <div className="gauge-zone under" title="Thiếu cân (< -2)" />
                  <div className="gauge-zone normal" title="Chuẩn WHO: [-2 đến +2]">
                    <div
                      className="gauge-child-marker"
                      style={{
                        left: `${Math.min(94, Math.max(6, ((currentRecord.zScore + 3) / 6) * 100))}%`,
                      }}
                    >
                      <span className="marker-pin" />
                      <span className="marker-bubble">
                        Bé: {currentRecord.zScore > 0 ? '+' : ''}{currentRecord.zScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="gauge-zone over" title="Thừa cân (> +2)" />
                </div>
              </div>

              {/* Target Footer: Always [-2] to [2] per WHO Standard */}
              <div className="metric-card-target-footer">
                <div className="target-left">
                  <span className="target-lbl">🎯 Mục tiêu Z-score:</span>
                  <span className="target-val">[-2] đến [2]</span>
                </div>
                <span className="eco-badge eco-badge--sm eco-badge--info">Chuẩn WHO</span>
              </div>
            </div>

            {/* Risk Alert if any */}
            {advice.target.riskAlert && (
              <div className="advice-risk-alert">
                <span className="icon">⚠️</span>
                <div>{advice.target.riskAlert}</div>
              </div>
            )}

            {/* Principles Card with 5 Foundational Elements */}
            <div className="advice-principles-card">
              <div className="advice-principles-head">
                <span className="advice-principles-head-icon">📌</span>
                <span className="advice-principles-head-title">Nguyên tắc đồng hành cùng con</span>
              </div>

              <div className="advice-principles-list">
                {(advice.target.principles && advice.target.principles.length > 0
                  ? advice.target.principles
                  : [
                      {
                        icon: '🥗',
                        lead: '1. Dinh dưỡng cân đối & đủ chất',
                        desc: 'Ăn đa dạng các nhóm chất (đạm, tinh bột, chất béo lành mạnh, vitamin), tăng cường rau củ quả tươi; tuyệt đối không áp dụng ăn kiêng hà khắc hay ép ăn.',
                      },
                      {
                        icon: '😊',
                        lead: '2. Tâm lý tích cực & thoải mái',
                        desc: 'Xây dựng không khí gia đình vui vẻ, không dán nhãn ngoại hình hay so sánh chỉ số cân nặng, khuyến khích sự tự giác và hào hứng trong mỗi bữa ăn.',
                      },
                      {
                        icon: '🏃',
                        lead: '3. Rèn luyện thể chất mỗi ngày',
                        desc: 'Khuyến khích vận động ngoài trời tối thiểu 30–45 phút mỗi ngày (chạy bộ, nhảy dây, đạp xe, bơi lội) để tăng cường chuyển hóa và hấp thụ Vitamin D tự nhiên.',
                      },
                      {
                        icon: '🌙',
                        lead: '4. Tối ưu giấc ngủ sâu & đúng giờ',
                        desc: 'Đảm bảo trẻ ngủ đủ giấc trước 21h30 để hormone tăng trưởng GH tiết ra tối đa.',
                      },
                      {
                        icon: '📵',
                        lead: '5. Cân bằng thời gian số & nếp sống lành mạnh',
                        desc: 'Giới hạn thời gian dùng thiết bị điện tử dưới 1–2 giờ/ngày; tránh xa màn hình trước giờ ngủ để bảo vệ thị lực và nhịp sinh học tự nhiên.',
                      },
                    ]
                ).map((pr, idx) => (
                  <div key={idx} className="advice-principle-item">
                    <div className="advice-bullet-icon-wrap">
                      <span className="advice-bullet-icon">{pr.icon}</span>
                    </div>
                    <div className="advice-principle-content">
                      <div className="advice-principle-lead">{pr.lead}</div>
                      <div className="advice-principle-desc">{pr.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Thói quen (Tracking day-by-day by Week) */}
        {activeTab === 'habits' && (
          <div className="pb-20">
            {/* White Header Block: ECO.WeekBar + ECO.DayStrip (Matching Thực đơn) */}
            <div style={{ background: '#ffffff', marginBottom: 12 }}>
              <button
                type="button"
                className="eco-weekbar"
                onClick={() => setShowWeekPicker(true)}
                aria-label="Chọn tuần theo dõi thói quen"
              >
                <span className="eco-weekbar__ico" aria-hidden="true">
                  <img src="/ds/menu/week-book.svg" alt="" width={24} height={24} style={{ display: 'block' }} />
                </span>
                <span className="eco-weekbar__text" style={{ font: 'var(--text-body-s)' }}>
                  <b>Tuần:</b> {selectedWeek.dateRange}
                </span>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#85888E" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" />
                </svg>
              </button>

              <div className="eco-daystrip">
                {selectedWeek.daysList.map((d) => {
                  const isActive = d.key === selectedDayKey
                  const allAchieved = isDayAllAchieved(selectedWeek.id, d.key)
                  return (
                    <button
                      key={d.key}
                      type="button"
                      className={`eco-daystrip__day${isActive ? ' is-active' : ''}`}
                      onClick={() => setSelectedDayKey(d.key)}
                      style={{ height: 68, paddingBottom: 6 }}
                    >
                      <span className="eco-daystrip__dow" style={{ font: 'var(--text-body-xs)' }}>
                        {d.key}
                      </span>
                      <span
                        className="eco-daystrip__date"
                        style={{ font: 'var(--text-body-s)', fontWeight: isActive ? 700 : 500 }}
                      >
                        {d.dateNum}
                      </span>
                      <span
                        className={`habit-tab-dot ${allAchieved ? 'achieved' : 'pending'}`}
                        title={
                          allAchieved
                            ? `Đã đạt tất cả ${currentWeekActivities.length} thói quen`
                            : `Chưa đạt đủ ${currentWeekActivities.length} thói quen`
                        }
                      />
                    </button>
                  )
                })}
              </div>

              {/* Dot Status Legend */}
              <div className="habit-dot-legend" style={{ paddingBottom: 12 }}>
                <div className="habit-legend-item">
                  <span className="habit-tab-dot achieved" />
                  <span>Đạt tất cả thói quen</span>
                </div>
                <div className="habit-legend-item">
                  <span className="habit-tab-dot pending" />
                  <span>Chưa hoàn thành đủ</span>
                </div>
              </div>
            </div>

            <div className="advice-section-wrap">
              {/* Weekly Summary for past weeks */}
              {!isCurrentWeek && (
                <div className="habit-past-summary-banner">
                  <div className="past-summary-icon-wrap">📊</div>
                  <div className="past-summary-content">
                    <div className="past-summary-title">Tổng kết tuần đã qua</div>
                    <div className="past-summary-text">
                      Bé đã hoàn thành <strong>{getWeekCompletedCount(selectedWeek.id)}/{(weekActivities[selectedWeek.id]?.length || 3) * 6}</strong> hoạt động trong tuần.
                    </div>
                  </div>
                  <span className="past-summary-badge">
                    {Math.round((getWeekCompletedCount(selectedWeek.id) / (((weekActivities[selectedWeek.id]?.length || 3) * 6) || 1)) * 100)}%
                  </span>
                </div>
              )}

              {/* Main Daily Activities Card */}
              <div className="habit-card-box">
                <div className="habit-card-head-row">
                  <div className="habit-card-head-left">
                    <div className="habit-card-title">{currentWeekActivities.length} Thói quen cốt lõi</div>
                    <div className="habit-card-sub">
                      Ngày {currentDayInfo.fullDate} ({currentDayInfo.key})
                    </div>
                  </div>
                  {/* Only current week can edit the habits */}
                  {isCurrentWeek && (
                    <button
                      type="button"
                      className="habit-edit-trigger-btn"
                      onClick={handleOpenEditModal}
                      title="Chỉnh sửa thói quen cho cả tuần"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>Chỉnh sửa tuần</span>
                    </button>
                  )}
                </div>

              {/* Day completion status indicator banner */}
              <div className={`habit-day-banner ${isDayAllAchieved(selectedWeek.id, selectedDayKey) ? 'achieved' : 'pending'}`}>
                {isDayAllAchieved(selectedWeek.id, selectedDayKey) ? (
                  <>
                    <span className="banner-dot green" />
                    <span className="banner-text">
                      <strong>Xuất sắc!</strong> Bé đã hoàn thành trọn vẹn cả {currentWeekActivities.length} thói quen hôm nay ({currentWeekActivities.length}/{currentWeekActivities.length}).
                    </span>
                  </>
                ) : (
                  <>
                    <span className="banner-dot orange" />
                    <span className="banner-text">
                      Đã hoàn thành <strong>{getDayCheckedCount(selectedWeek.id, selectedDayKey)}/{currentWeekActivities.length}</strong> thói quen. {isCurrentWeek ? 'Hãy cùng bé tích cực hoàn thành nốt nhé!' : ''}
                    </span>
                  </>
                )}
              </div>

              {/* 3 Activities Checklist */}
              <div className="habit-activities-checklist">
                {currentWeekActivities.map((act, idx) => {
                  const isChecked = !!habitChecks[selectedWeek.id]?.[selectedDayKey]?.[act.id]
                  return (
                    <div
                      key={act.id}
                      className={`habit-activity-card ${isChecked ? 'checked' : ''} ${!isCurrentWeek ? 'readonly' : ''}`}
                      onClick={() => {
                        if (isCurrentWeek) {
                          toggleActivityCheck(act.id)
                        }
                      }}
                      style={{ cursor: isCurrentWeek ? 'pointer' : 'default' }}
                    >
                      <button
                        type="button"
                        className={`habit-activity-checkbox ${isChecked ? 'checked' : ''}`}
                        disabled={!isCurrentWeek}
                        style={{ cursor: isCurrentWeek ? 'pointer' : 'default' }}
                        aria-label={`Đánh dấu ${act.title}`}
                      >
                        {isChecked ? '✓' : ''}
                      </button>
                      <span className="habit-activity-icon-bubble">{act.icon}</span>
                      <div className="habit-activity-info">
                        <div className="habit-activity-title">
                          <span className="habit-activity-order">#{idx + 1}</span> {act.title}
                        </div>
                        <div className="habit-activity-subtitle">{act.subtitle}</div>
                      </div>
                      {!isCurrentWeek && (
                        <span className={`habit-activity-past-tag ${isChecked ? 'done' : 'missed'}`}>
                          {isChecked ? '✓ Đã đạt' : '✕ Chưa đạt'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Parent advice tip - only in current week */}
              {isCurrentWeek && (
                <div className="habit-card-tip">
                  <div>
                    💡 <strong>Lưu ý:</strong> Ba mẹ có thể bấm <strong>&quot;Chỉnh sửa tuần&quot;</strong> để tùy chỉnh số lượng và nội dung thói quen (chọn 1, 2 hoặc 3 thói quen). Thói quen được chỉnh sửa sẽ tự động áp dụng đồng bộ cho cả tuần!
                  </div>
                  <div style={{ marginTop: '6px', color: 'var(--text-secondary, #595959)' }}>
                    Qua tuần mới, các hoạt động sẽ được sao chép, và Ba mẹ có thể điều chỉnh sau đó.
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        )}

        {/* Medical Disclaimer Note */}
        <div style={{ padding: '0 16px 16px' }}>
          <div className="zscore-advice-note">
            Gợi ý được xây dựng dựa trên hướng dẫn dinh dưỡng của Viện Dinh Dưỡng Quốc Gia và WHO. Để có phác đồ điều trị chuyên biệt, ba mẹ vui lòng tham vấn bác sĩ nhi khoa.
          </div>
        </div>
      </div>

      {/* ECO.ActionFooter Sticky Bottom CTA */}
      <div
        className="eco-actionfooter"
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 25,
          paddingBottom: 'var(--space-16, 16px)',
        }}
      >
        <div className="eco-actionfooter__bar">
          <button
            type="button"
            className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
            onClick={onBack}
          >
            Quay lại hồ sơ học sinh
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="habit-toast-alert">
          <span className="habit-toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ECO.WeekPickerSheet (Last 6 weeks max - matching Thực đơn) */}
      {showWeekPicker && (
        <WeekPickerSheet
          title="Chọn tuần"
          selectedId={selectedWeek.id}
          weeks={LAST_6_WEEKS}
          onSelect={(w) => setSelectedWeek(w as HabitWeek)}
          onClose={() => setShowWeekPicker(false)}
        />
      )}

      {/* Edit Habits Sheet (Edit activities applied to the whole week) */}
      {showEditHabitsModal && (
        <OverlayPortal>
          <div className="eco-sheet-root" style={{ zIndex: 100 }}>
            <div className="eco-sheet-scrim" onClick={() => setShowEditHabitsModal(false)} />
            <div
              className="eco-sheet habit-edit-sheet"
              style={{ height: 'auto', maxHeight: '86%' }}
              role="dialog"
              aria-label="Chỉnh sửa thói quen tuần"
            >
              <span className="eco-sheet__grabber" />
              <div className="eco-sheet__head">
                <h3>Chỉnh sửa thói quen tuần</h3>
                <button
                  type="button"
                  className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost"
                  onClick={() => setShowEditHabitsModal(false)}
                  aria-label="Đóng"
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="eco-sheet__body eco-vscroll habit-edit-sheet-body">
                {/* Notice callout */}
                <div className="habit-edit-scope-alert">
                  <span className="alert-icon">ℹ️</span>
                  <div className="alert-text">
                    <strong>Áp dụng cho cả tuần:</strong> Các thói quen bạn tùy chỉnh sẽ được áp dụng đồng bộ cho tất cả các ngày (Thứ 2 – Thứ 7) trong tuần <strong>{selectedWeek.dateRange}</strong>. Ba mẹ có thể để trống thói quen nếu muốn bỏ qua.
                  </div>
                </div>

                {/* Instruction banner right above Habit card 1 */}
                <div className="habit-above-cards-instruction">
                  <span>💡 Ba mẹ bấm vào trường thông tin &quot;Tên thói quen&quot; để xem gợi ý. Có thể để trống hoặc bấm &quot;Bỏ qua&quot; nếu chỉ muốn áp dụng 1 hoặc 2 thói quen.</span>
                </div>

                {/* Form Fields */}
                <div className="habit-edit-forms-list">
                  {editList.map((item, idx) => {
                    const isDropdownOpen = activeDropdownIndex === idx
                    const isSkipped = !item.title.trim()
                    return (
                      <div key={item.id || `slot-${idx}`} className={`habit-edit-item-box ${isSkipped ? 'skipped' : ''}`}>
                        <div className="habit-edit-box-head">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="habit-edit-badge">Thói quen {idx + 1}</span>
                            {isSkipped && (
                              <span className="habit-slot-skipped-tag">Bỏ qua (Để trống)</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {!isSkipped && (
                              <button
                                type="button"
                                className="habit-slot-clear-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleClearSlot(idx)
                                }}
                                title="Bỏ qua thói quen này"
                              >
                                ✕ Bỏ qua
                              </button>
                            )}
                            <span className="habit-edit-icon-display">{item.icon || '🎯'}</span>
                          </div>
                        </div>

                        <div
                          className="habit-edit-field"
                          ref={(el) => {
                            dropdownRefs.current[idx] = el
                          }}
                        >
                          <div className="habit-field-lbl-row">
                            <label className="habit-field-lbl">Tên thói quen</label>
                            {isDropdownOpen && (
                              <button
                                type="button"
                                className="habit-field-close-rec-btn"
                                onClick={() => setActiveDropdownIndex(null)}
                              >
                                Đóng gợi ý ✕
                              </button>
                            )}
                          </div>
                          <div className="habit-input-wrapper">
                            <input
                              type="text"
                              className="habit-field-input"
                              value={item.title}
                              onFocus={() => setActiveDropdownIndex(idx)}
                              onClick={() => setActiveDropdownIndex(idx)}
                              onChange={(e) => handleTitleChange(idx, e.target.value)}
                              placeholder="Nhập tên thói quen hoặc để trống nếu bỏ qua..."
                            />
                            <button
                              type="button"
                              className={`habit-dropdown-toggle-icon ${isDropdownOpen ? 'open' : ''}`}
                              onClick={() => setActiveDropdownIndex(isDropdownOpen ? null : idx)}
                              title="Bấm để xem danh sách gợi ý"
                              aria-label="Xem gợi ý thói quen"
                            >
                              ▾
                            </button>
                          </div>

                          {/* Dropdown displaying 15 recommended activities */}
                          {isDropdownOpen && (
                            <div className="habit-dropdown-panel">
                              <div className="habit-dropdown-list">
                                {recommendedActivities.map((rec) => (
                                  <button
                                    key={rec.id}
                                    type="button"
                                    className="habit-dropdown-item"
                                    onClick={() => handleSelectRecommended(idx, rec)}
                                  >
                                    <span className="habit-dropdown-icon">{rec.icon}</span>
                                    <div className="habit-dropdown-content">
                                      <div className="habit-dropdown-title">{rec.title}</div>
                                      <div className="habit-dropdown-sub">{rec.subtitle}</div>
                                    </div>
                                    <span className="habit-dropdown-apply-tag">Chọn</span>
                                  </button>
                                ))}

                                {/* Custom activity option */}
                                <button
                                  type="button"
                                  className="habit-dropdown-item habit-dropdown-custom-option"
                                  onClick={() => handleCustomActivity(idx)}
                                >
                                  <span className="habit-dropdown-icon">✏️</span>
                                  <div className="habit-dropdown-content">
                                    <div className="habit-dropdown-title">Tự nhập hoạt động khác...</div>
                                    <div className="habit-dropdown-sub">Mục tiêu / lợi ích sẽ để trống để ba mẹ tự điền</div>
                                  </div>
                                  <span className="habit-dropdown-apply-tag custom">Nhập</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="habit-edit-field">
                          <label className="habit-field-lbl">Mục tiêu / Lợi ích cho bé</label>
                          <input
                            type="text"
                            className="habit-field-input"
                            value={item.subtitle}
                            onFocus={() => setActiveDropdownIndex(null)}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditList((prev) =>
                                prev.map((it, i) => (i === idx ? { ...it, subtitle: val } : it))
                              )
                            }}
                            placeholder="Để trống hoặc tự nhập mục tiêu..."
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="habit-edit-sheet-foot">
                <button
                  type="button"
                  className="eco-btn eco-btn--outline eco-btn--lg"
                  style={{ flex: 1 }}
                  onClick={() => setShowEditHabitsModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="eco-btn eco-btn--brand eco-btn--lg"
                  style={{ flex: 2 }}
                  onClick={handleSaveWeekActivities}
                >
                  Lưu &amp; Áp dụng cả tuần
                </button>
              </div>
            </div>
          </div>
        </OverlayPortal>
      )}
    </div>
  )
}
