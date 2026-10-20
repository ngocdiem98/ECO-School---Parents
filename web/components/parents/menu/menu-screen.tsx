'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { getStudent, MOCK_STUDENTS } from '@/lib/mock-data'
import { StudentPickerSheet, getStudentDsAvatar } from '@/components/parents/shared/student-picker-sheet'
import { WeekPickerSheet } from '@/components/parents/shared/week-picker-sheet'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import {
  MENU_WEEKS,
  DEFAULT_INGREDIENT,
  getWeekDaysList,
  type WeekMenu,
  type DayMenu,
  type MealItem,
  type MealIngredient,
} from './menu-data'

export interface MenuScreenProps {
  studentId: string
  onBack: () => void
  onSelectStudent?: (studentId: string) => void
  onOpenTransparencyDetail: () => void
  onOpenTraceabilityDetail: (ingredient?: MealIngredient) => void
}

const MEAL_ICON_SRC: Record<MealItem['iconType'], string> = {
  breakfast: '/ds/menu/meal-breakfast.svg',
  snack_morning: '/ds/menu/meal-snack.svg',
  afternoon: '/ds/menu/meal-afternoon.svg',
  dinner: '/ds/menu/meal-dinner.svg',
}

export function MenuScreen({
  studentId,
  onBack,
  onSelectStudent,
  onOpenTransparencyDetail,
  onOpenTraceabilityDetail,
}: MenuScreenProps) {
  const student = getStudent(studentId) || MOCK_STUDENTS[0]
  const [selectedWeek, setSelectedWeek] = useState<WeekMenu>(MENU_WEEKS[0])
  const [selectedDayKey, setSelectedDayKey] = useState<string>('T2')
  const [showPicker, setShowPicker] = useState(false)
  const [showWeekPicker, setShowWeekPicker] = useState(false)
  const [showGreenTickModal, setShowGreenTickModal] = useState(false)
  const [showIngredientsSheet, setShowIngredientsSheet] = useState(false)
  const [selectedMealForIngredients, setSelectedMealForIngredients] = useState<MealItem | null>(null)
  const [fullscreenPhoto, setFullscreenPhoto] = useState<{
    url: string
    title: string
    caption?: string
  } | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 2500)
  }

  const handleDownloadPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerToast('Đã tải ảnh về máy')
    if (fullscreenPhoto) {
      const link = document.createElement('a')
      link.href = fullscreenPhoto.url
      link.download = `thuc-don-${selectedDayKey}.png`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const currentWeekDays =
    selectedWeek.days && Object.keys(selectedWeek.days).length > 0
      ? selectedWeek.days
      : MENU_WEEKS[0].days
  const currentDayMenu: DayMenu =
    currentWeekDays[selectedDayKey] ||
    MENU_WEEKS[0].days[selectedDayKey] ||
    MENU_WEEKS[0].days.T2

  const daysList = getWeekDaysList(selectedWeek)

  return (
    <div className="menu-screen-root" style={{ background: '#FFFDF8' }}>
      {/* Part 1 of 3-Part White Header Standard: ECO.NavBar */}
      <header
        className="eco-navbar"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}
      >
        <div className="eco-navbar__side">
          <button
            type="button"
            className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost"
            onClick={onBack}
            aria-label="Quay lại"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
        <div
          className="eco-navbar__title"
          style={{ font: 'var(--text-subtitle-l)', fontWeight: 500, color: '#141414' }}
        >
          Thực đơn
        </div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </header>

      <div className="menu-scrollable-content">
        {/* Part 2 of 3-Part White Header Standard: ECO.StudentProfileHeader */}
        <section
          className="eco-stuhead"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}
        >
          <span className="eco-avatar eco-avatar--xl">
            <img
              src={getStudentDsAvatar(student)}
              alt={student.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </span>
          <div className="eco-stuhead__text">
            <strong
              className="eco-stuhead__name"
              style={{ font: 'var(--text-body-l)', fontWeight: 700, color: '#141414' }}
            >
              {student.name}
            </strong>
            <span className="eco-stuhead__line" style={{ font: 'var(--text-body-s)', color: '#232628' }}>
              {student.code}
            </span>
            <span className="eco-stuhead__line" style={{ font: 'var(--text-body-s)', color: '#232628' }}>
              {student.className}
            </span>
            <span className="eco-stuhead__line" style={{ font: 'var(--text-body-s)', color: '#232628' }}>
              {student.school}
            </span>
          </div>
          <button
            type="button"
            className="eco-stuhead__action"
            onClick={() => setShowPicker(true)}
            aria-label="Đổi học sinh"
          >
            <span style={{ width: 20, height: 20, display: 'inline-flex', flexShrink: 0 }}>
              <img
                src="/ds/payment/student-switch.svg"
                alt=""
                width={20}
                height={20}
                style={{ display: 'block' }}
              />
            </span>
            <span style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>Đổi</span>
          </button>
        </section>

        {/* Part 3 of 3-Part White Header Standard: ECO.WeekBar (size='s') */}
        <div
          className="eco-weekbar-s"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}
        >
          <button
            type="button"
            className="eco-weekbar"
            style={{ background: '#FFFFFF' }}
            onClick={() => setShowWeekPicker(true)}
            aria-label="Chọn tuần khác"
          >
            <img
              src="/ds/menu/week-book.svg"
              alt=""
              width={24}
              height={24}
              style={{ display: 'block', flexShrink: 0 }}
            />
            <span
              className="eco-weekbar__text"
              style={{ font: 'var(--text-body-s)', color: '#232628' }}
            >
              <strong style={{ fontWeight: 700 }}>Tuần :</strong> {selectedWeek.dateRange}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#232628" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Patterned Canvas: ECO.DayStrip + ECO.MealCard List + ECO.AttachedImagesCard */}
        <div className="menu-cards-canvas" style={{ padding: 0 }}>
          <div
            className="eco-daystrip"
            role="tablist"
            aria-label="Chọn thứ trong tuần"
            style={{ padding: '12px 12px 4px' }}
          >
            {daysList.map((d) => {
              const isActive = d.key === selectedDayKey
              return (
                <button
                  key={d.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`eco-daystrip__day ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedDayKey(d.key)}
                >
                  <span
                    className="eco-daystrip__dow"
                    style={{ fontSize: 12, lineHeight: '16px', fontWeight: isActive ? 600 : 400 }}
                  >
                    {d.key}
                  </span>
                  <span
                    className="eco-daystrip__date"
                    style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700 }}
                  >
                    {d.dateNum}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '8px 12px 24px',
            }}
          >
            {currentDayMenu.meals.map((meal) => (
              <section key={meal.id} className="eco-mealcard">
                <div className="eco-mealcard__head">
                  <span className="eco-meallabel">
                    <img
                      src={MEAL_ICON_SRC[meal.iconType] || '/ds/menu/meal-breakfast.svg'}
                      alt=""
                      width={24}
                      height={24}
                      style={{ display: 'block', flexShrink: 0 }}
                    />
                    <span style={{ font: 'var(--text-body-m)', fontWeight: 600, color: '#141414' }}>
                      {meal.label}
                    </span>
                  </span>

                  {/* Tick-Xanh Icon + "1 món" */}
                  <button
                    type="button"
                    className="eco-mealcard__badge menu-tick-badge-btn"
                    onClick={() => setShowGreenTickModal(true)}
                    title="Xem chứng nhận Suất ăn minh bạch"
                  >
                    <Image
                      src="/menu/tick-badge.png"
                      alt="Tick xanh"
                      width={20}
                      height={20}
                      className="menu-tick-badge-img"
                    />
                    <span
                      className="eco-mealcard__count"
                      style={{ font: 'var(--text-body-xs)', fontWeight: 500 }}
                    >
                      {meal.itemCount} món
                    </span>
                  </button>
                </div>

                <div className="eco-mealcard__list">
                  <div className="eco-dishrow">
                    <span
                      className="eco-dishrow__name"
                      style={{ font: 'var(--text-body-m)', color: '#141414' }}
                    >
                      {meal.dish}
                    </span>

                    {meal.hasIngredientsPill && (
                      <button
                        type="button"
                        className="eco-dishrow__btn"
                        onClick={() => {
                          setSelectedMealForIngredients(meal)
                          setShowIngredientsSheet(true)
                        }}
                        title="Xem danh sách nguyên liệu"
                      >
                        <span style={{ font: 'var(--text-body-xs)', fontWeight: 600 }}>
                          {meal.ingredientsCount} nguyên liệu
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </section>
            ))}

            {/* ECO.AttachedImagesCard: Ảnh đính kèm */}
            <section className="eco-attimgs" style={{ paddingTop: 4 }}>
              <h4 style={{ font: 'var(--text-body-m)', fontWeight: 700, color: '#374151' }}>
                Ảnh đính kèm
              </h4>
              <div className="eco-attimgs__grid">
                {(() => {
                  const currentPhoto = currentDayMenu.attachments?.[0] || {
                    id: 'default',
                    url: '/menu/meal-photo.png',
                    title: currentDayMenu.meals[0]?.dish ? `Ảnh suất ăn: ${currentDayMenu.meals[0].dish}` : 'Ảnh suất ăn thực tế',
                  }
                  return (
                    <span
                      className="eco-attimgs__tile"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setFullscreenPhoto({
                          url: currentPhoto.url,
                          title: currentPhoto.title,
                          caption: `${currentDayMenu.dayKey} · ${currentDayMenu.fullDate} — ${currentPhoto.title}`,
                        })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setFullscreenPhoto({
                            url: currentPhoto.url,
                            title: currentPhoto.title,
                            caption: `${currentDayMenu.dayKey} · ${currentDayMenu.fullDate} — ${currentPhoto.title}`,
                          })
                        }
                      }}
                      title="Bấm để xem ảnh toàn màn hình"
                    >
                      <img
                        src={currentPhoto.url}
                        alt={currentPhoto.title}
                        loading="lazy"
                      />
                    </span>
                  )
                })()}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Student Picker Sheet */}
      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={student.id}
          onSelect={(s) => {
            setShowPicker(false)
            if (onSelectStudent) onSelectStudent(s.id)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* "Thuc don 2": Standard WeekPickerSheet "Chọn tuần" */}
      {showWeekPicker && (
        <WeekPickerSheet
          title="Chọn tuần"
          selectedId={selectedWeek.id}
          weeks={MENU_WEEKS}
          onSelect={(w) => setSelectedWeek(w as WeekMenu)}
          onClose={() => setShowWeekPicker(false)}
        />
      )}

      {/* "Thuc don 4": Bottom Sheet "Suất ăn minh bạch - Tick Xanh Trách Nhiệm" */}
      {showGreenTickModal && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowGreenTickModal(false)} />
          <div className="sheet menu-greentick-sheet">
            <div className="menu-sheet-handle-bar" />
            <button
              className="menu-sheet-close-x"
              onClick={() => setShowGreenTickModal(false)}
              aria-label="Đóng"
            >
              ✕
            </button>

            <div className="menu-greentick-body">
              <div className="menu-greentick-logo-wrap">
                <Image
                  src="/menu/tick-xanh-logo.png"
                  alt="Tick Xanh Trách Nhiệm"
                  width={90}
                  height={90}
                  style={{ width: 'auto', height: 'auto' }}
                  className="menu-greentick-logo"
                />
              </div>

              <h2 className="menu-greentick-title">Suất ăn minh bạch</h2>
              <div className="menu-greentick-sub">Tick Xanh Trách Nhiệm</div>

              <p className="menu-greentick-desc">
                Chương trình <strong>&quot;Suất ăn minh bạch - Tick Xanh Trách Nhiệm&quot;</strong> do Sở Công Thương TP.HCM chủ trì nhằm tăng cường kiểm soát, giám sát chuỗi cung ứng thực phẩm an toàn và minh bạch cho học đường.
              </p>

              <button
                type="button"
                className="menu-greentick-cta-btn"
                onClick={() => {
                  setShowGreenTickModal(false)
                  onOpenTransparencyDetail()
                }}
              >
                <span>Xem chi tiết</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </OverlayPortal>
      )}

      {/* "Thuc don 6": ECO.DishDetailSheet + ECO.IngredientCard ("X nguyên liệu") */}
      {showIngredientsSheet && (
        <OverlayPortal>
          <div className="eco-sheet-root eco-dishsheet">
            <div className="eco-sheet-scrim" onClick={() => setShowIngredientsSheet(false)} />
            <div
              className="eco-sheet"
              style={{ height: 'auto', maxHeight: '82%' }}
              role="dialog"
              aria-label={selectedMealForIngredients?.dish || 'Cháo'}
            >
              <span className="eco-sheet__grabber" />
              <div className="eco-dishsheet__head">
                <div className="eco-dishsheet__titles">
                  <h3 style={{ font: 'var(--text-body-l)', fontWeight: 500 }}>
                    {selectedMealForIngredients?.dish || 'Cháo'}
                  </h3>
                  <p style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>
                    {selectedMealForIngredients?.ingredientsCount || 1} nguyên liệu
                  </p>
                </div>
                <button
                  type="button"
                  className="eco-dishsheet__close"
                  aria-label="Đóng"
                  onClick={() => setShowIngredientsSheet(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="eco-dishsheet__body">
                {(selectedMealForIngredients?.ingredients && selectedMealForIngredients.ingredients.length > 0
                  ? selectedMealForIngredients.ingredients
                  : [DEFAULT_INGREDIENT]
                ).map((ing) => (
                  <article key={ing.id} className="eco-ingcard">
                    <div className="eco-ingcard__top">
                      <span
                        className="eco-ingcard__name"
                        style={{ font: 'var(--text-body-m)', fontWeight: 500 }}
                      >
                        {ing.name}
                      </span>
                      <span
                        className="eco-certtag eco-certtag--certified"
                        style={{ font: 'var(--text-body-s)' }}
                      >
                        Tick xanh
                      </span>
                    </div>

                    <div className="eco-ingcard__row">
                      <span className="eco-ingcard__label" style={{ font: 'var(--text-body-s)' }}>
                        Cơ sở sản xuất
                      </span>
                      <span className="eco-ingcard__value" style={{ font: 'var(--text-body-s)' }}>
                        {ing.producer}
                      </span>
                    </div>

                    <div className="eco-ingcard__row">
                      <span className="eco-ingcard__label" style={{ font: 'var(--text-body-s)' }}>
                        Mã nguyên liệu
                      </span>
                      <span className="eco-ingcard__value" style={{ font: 'var(--text-body-s)' }}>
                        {ing.ingredientCode}
                      </span>
                    </div>

                    <div className="eco-ingcard__foot">
                      <button
                        type="button"
                        className="eco-ingcard__link"
                        onClick={() => {
                          setShowIngredientsSheet(false)
                          onOpenTraceabilityDetail(ing)
                        }}
                      >
                        <span style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>
                          Xem chi tiết
                        </span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0070CE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="eco-home-indicator">
                <span className="eco-home-indicator__pill" />
              </div>
            </div>
          </div>
        </OverlayPortal>
      )}

      {/* Fullscreen Photo Viewer Lightbox Modal (ECO.ImageViewer) */}
      {fullscreenPhoto && (
        <OverlayPortal>
          <div
            className="menu-imgviewer-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh toàn màn hình"
            onClick={() => setFullscreenPhoto(null)}
          >
            {/* Top Bar: Close Button + Title + Download Button */}
            <div className="menu-imgviewer-head" onClick={(e) => e.stopPropagation()}>
              <div className="menu-imgviewer-bar">
                <button
                  type="button"
                  className="menu-imgviewer-btn"
                  onClick={() => setFullscreenPhoto(null)}
                  aria-label="Đóng"
                  title="Đóng (✕)"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <span className="menu-imgviewer-title">
                  {fullscreenPhoto.title || 'Ảnh suất ăn'}
                </span>

                <button
                  type="button"
                  className="menu-imgviewer-btn"
                  onClick={handleDownloadPhoto}
                  aria-label="Tải xuống"
                  title="Tải ảnh về máy"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stage: Centered Photo */}
            <div
              className="menu-imgviewer-stage"
              onClick={() => setFullscreenPhoto(null)}
            >
              <img
                src={fullscreenPhoto.url}
                alt={fullscreenPhoto.title || 'Ảnh thực đơn'}
                onClick={(e) => e.stopPropagation()}
                className="menu-imgviewer-img"
              />
            </div>

            {/* Bottom Bar: Caption + Home Indicator */}
            <div className="menu-imgviewer-bottom" onClick={(e) => e.stopPropagation()}>
              {fullscreenPhoto.caption && (
                <div className="menu-imgviewer-caption">
                  {fullscreenPhoto.caption}
                </div>
              )}
              <div className="eco-home-indicator" style={{ width: 140, padding: '4px 0' }}>
                <span className="eco-home-indicator__pill" style={{ background: '#FFFFFF' }} />
              </div>
            </div>
          </div>
        </OverlayPortal>
      )}

      {/* Toast Notice */}
      {toastMessage && (
        <div className="eco-toast-notice" style={{ zIndex: 11000 }}>
          <div className="eco-toast-dot" />
          <div className="eco-toast-text">{toastMessage}</div>
        </div>
      )}
    </div>
  )
}

