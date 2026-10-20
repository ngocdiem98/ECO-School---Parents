'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MOCK_STUDENTS, type Student } from '@/lib/mock-data'
import { StudentPickerSheet } from '../shared/student-picker-sheet'
import {
  BULLETIN_TABS,
  BULLETIN_STUDENT_PROFILES,
  MOCK_BULLETIN_POSTS,
  type BulletinCategory,
  type BulletinPost,
} from './bulletin-data'

interface BulletinScreenProps {
  initialStudentId?: string
  onBack: () => void
}

function renderRichParagraph(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} style={{ fontWeight: 700, color: '#374151' }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>
  })
}

export function BulletinScreen({
  initialStudentId = 'duong',
  onBack,
}: BulletinScreenProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || 'duong'
  )
  const [activeCategory, setActiveCategory] = useState<BulletinCategory>('all')
  const [showStudentPicker, setShowStudentPicker] = useState(false)
  const [activePost, setActivePost] = useState<BulletinPost | null>(null)

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const scroller = document.querySelector('.screen-root')
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [activePost])

  // Resolve student profile matching mockups (default Tạ Thái Dương - 340000000002 - Lớp 1A - Trường FINVIET)
  // Header data comes from the app's own student.
  const appStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId)
  const studentProfile = appStudent
    ? {
        id: appStudent.id,
        name: appStudent.name,
        code: appStudent.code,
        className: appStudent.className,
        school: appStudent.school,
      }
    : BULLETIN_STUDENT_PROFILES[selectedStudentId] || BULLETIN_STUDENT_PROFILES.duong

  // Filter posts by selected tab
  const filteredPosts =
    activeCategory === 'all'
      ? MOCK_BULLETIN_POSTS
      : MOCK_BULLETIN_POSTS.filter((p) => p.category === activeCategory)

  const handleSelectTab = (catId: BulletinCategory) => {
    setActiveCategory(catId)
    const btn = tabRefs.current[catId]
    if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }

  const handlePickStudent = (student: Student) => {
    setSelectedStudentId(student.id)
    setShowStudentPicker(false)
  }

  const matchedStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId)

  // Dedicated Full Screen: "Chi tiết bài viết" (ECO.ArticleDetailScreen)
  if (activePost) {
    const paragraphs = activePost.fullContent.split(/\n\n+/)
    const bottomImg = activePost.detailImage || activePost.thumbnail

    return (
      <div className="eco-articledetail-screen">
        {/* ECO.NavBar */}
        <header className="topbar absence-topbar bulletin-topbar eco-navbar eco-navbar--white">
          <button
            type="button"
            className="icon-btn bulletin-back-btn"
            onClick={() => setActivePost(null)}
            aria-label="Quay lại"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="topbar-title bulletin-topbar-title">Chi tiết bài viết</div>
          <span className="icon-btn-ghost" />
        </header>

        {/* White Article Content Card */}
        <article className="eco-articledetail__card">
          <div className="eco-articlehdr">
            <div className="eco-articlehdr__meta">
              <span className="eco-newstag eco-newstag--m">
                {activePost.categoryLabel}
              </span>
              <time className="eco-articledetail__time">
                {activePost.timestamp}
              </time>
            </div>
            <h1 className="eco-articledetail__title">{activePost.title}</h1>
          </div>

          <div className="eco-articledetail__body">
            {paragraphs.map((para, i) => (
              <p key={i} className="eco-articledetail__p">
                {renderRichParagraph(para)}
              </p>
            ))}
          </div>

          {/* Optional Attached PDF Preview (e.g. Thời khóa biểu) */}
          {activePost.pdfPreviewImage && (
            <div className="eco-articlepdf">
              <div className="eco-articlepdf__preview">
                <img
                  src={activePost.pdfPreviewImage}
                  alt={activePost.title}
                  className="eco-articlepdf__img"
                />
              </div>
              <div className="eco-articlepdf__bar">
                <span className="eco-articlepdf__badge">PDF</span>
              </div>
            </div>
          )}

          {/* Optional Attached Bottom Image (e.g. Thông báo ngày tựu trường) */}
          {!activePost.pdfPreviewImage && bottomImg && (
            <div className="eco-articledetail__media">
              <img
                src={bottomImg}
                alt={activePost.title}
                className="eco-articledetail__img"
              />
            </div>
          )}

          <p className="eco-listend eco-articledetail__end">
            Bạn đã đọc hết tin
          </p>
        </article>
      </div>
    )
  }

  return (
    <div className="bulletin-screen-container">
      {/* Top Header Bar */}
      <header className="topbar absence-topbar bulletin-topbar eco-navbar eco-navbar--white">
        <button
          type="button"
          className="icon-btn bulletin-back-btn"
          onClick={onBack}
          aria-label="Quay lại"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="topbar-title bulletin-topbar-title">Bảng tin</div>
        <span className="icon-btn-ghost" />
      </header>

      {/* Student Profile Header (Tạ Thái Dương - 340000000002 - Lớp 1A - Trường FINVIET) */}
      <div className="absence-student-header-card bulletin-student-header eco-stuhead">
        <div
          className="absence-student-header-main bulletin-student-main"
          onClick={() => setShowStudentPicker(true)}
          role="button"
          tabIndex={0}
          aria-label="Đổi học sinh"
        >
          <div className="bulletin-avatar-circle">
            {matchedStudent?.avatar?.startsWith('/') ? (
              <img
                src={matchedStudent.avatar}
                alt={studentProfile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <svg width="48" height="48" viewBox="0 0 46 46" fill="none">
                <circle cx="23" cy="23" r="23" fill="#E5E7EB" />
                <circle cx="23" cy="17" r="7.5" fill="#9CA3AF" />
                <path
                  d="M9 39.5C11.5 32.5 16.8 29 23 29C29.2 29 34.5 32.5 37 39.5"
                  fill="#9CA3AF"
                />
              </svg>
            )}
          </div>
          <div className="absence-student-info-col bulletin-student-meta">
            <div className="absence-student-name bulletin-student-name">
              {studentProfile.name}
            </div>
            <div className="absence-student-code bulletin-student-line">
              {studentProfile.code}
            </div>
            <div className="absence-student-meta bulletin-student-line">
              {studentProfile.className}
            </div>
            <div className="absence-student-meta bulletin-student-line">
              {studentProfile.school}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="eco-stuhead__action bulletin-change-btn"
          onClick={() => setShowStudentPicker(true)}
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
          <span>Đổi</span>
        </button>
      </div>

      {/* Horizontal Filter Tabs Bar */}
      <div className="bulletin-tabs-bar">
        {BULLETIN_TABS.map((tab) => {
          const isActive = activeCategory === tab.id
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el
              }}
              type="button"
              className={`bulletin-tab-pill ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectTab(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Scrollable Feed Body with Graph Paper Doodle Background */}
      <div className="bulletin-feed-body">
        <div className="bulletin-posts-list">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bulletin-post-card"
              onClick={() => setActivePost(post)}
              role="button"
              tabIndex={0}
            >
              {/* Card Top Meta Row */}
              <div className="bulletin-card-top">
                <span className="bulletin-cat-badge">{post.categoryLabel}</span>
                <span className="bulletin-timestamp">{post.timestamp}</span>
              </div>

              {/* Card Body Row: Text + Optional Right Thumbnail */}
              <div className="bulletin-card-main">
                <div className="bulletin-card-text-col">
                  <h3 className="bulletin-card-title">{post.title}</h3>
                  <p className="bulletin-card-excerpt">{post.excerpt}</p>
                </div>

                {post.thumbnail && (
                  <div className="bulletin-card-thumb-wrap">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="bulletin-card-thumb-img"
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* End of Feed Text */}
        <div className="bulletin-end-text">Đã xem hết tin</div>
      </div>

      {/* Student Switcher Bottom Sheet */}
      {showStudentPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedStudentId}
          onSelect={handlePickStudent}
          onClose={() => setShowStudentPicker(false)}
        />
      )}
    </div>
  )
}
