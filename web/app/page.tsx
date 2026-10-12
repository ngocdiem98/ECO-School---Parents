'use client'

import { useState } from 'react'
import { EcoHomeScreen } from '@/components/parents/eco-me/eco-home-screen'
import { EcoServicesScreen } from '@/components/parents/eco-me/eco-services-screen'
import { ParentsHomeScreen } from '@/components/parents/home-screen'
import { StudentScreen } from '@/components/parents/student-screen'
import { ProfileApp } from '@/components/parents/profile'
import { PhieuBeNgoanApp } from '@/components/parents/phieu-be-ngoan'
import { FeeApp } from '@/components/parents/fee'
import { TopupApp } from '@/components/parents/topup'
import { AbsenceApp } from '@/components/parents/absence'
import { HomeworkApp } from '@/components/parents/homework'
import { ResultsApp } from '@/components/parents/results'
import { HoaDonApp } from '@/components/parents/hoa-don'
import { MedicineApp } from '@/components/parents/medicine'
import { NotificationsApp } from '@/components/parents/notifications'
import { AttendanceApp } from '@/components/parents/attendance'
import { TimetableApp } from '@/components/parents/timetable'
import { SpendingApp } from '@/components/parents/spending'
import { MenuApp } from '@/components/parents/menu'
import { ActivityApp } from '@/components/parents/activity'
import { BulletinApp } from '@/components/parents/bulletin'
import { DiaryApp } from '@/components/parents/diary'
import { ChatApp } from '@/components/parents/chat'
import { GalleryApp } from '@/components/parents/gallery'
import { FeedbackApp } from '@/components/parents/feedback'
import type { ServiceIntent } from '@/components/parents/shared/use-service-launcher'
import type { NotificationTarget } from '@/lib/mock-data'
import { LinkStudentApp } from '@/components/parents/link-student'
import { HelpApp } from '@/components/parents/help'

// Mirrors the single-page phone-frame shell in eduteachers' app/page.tsx —
// one real Next.js route, top-level screen state via useState (no router
// library), each feature is a self-contained component under
// components/parents/<feature>/. The frame chrome itself (notch, side
// buttons, status bar icons) is ported from ../index.html + ../styles/main.css
// (the vanilla app's own iPhone mockup) rather than eduteachers' Dynamic
// Island frame, to keep eduparents' existing visual identity.
//
// `returnScreen` stands in for the vanilla app's navigation stack: features
// entered from a student context (Fee, Topup, Báo vắng, Bài tập, Kết quả
// học tập) can come from Home (via the student picker) or from Học sinh
// Homescreen directly, and their topbar "back" button must return to
// whichever one it came from — same as App.back() popping exactly one level
// in scripts/app.js. Every student-scoped service can also be launched from
// the ECO Me home or its "Danh sách dịch vụ" list, so `returnScreen` can be
// any of those too. "Hướng dẫn sử dụng" and "Liên kết học sinh" are only
// entered from a home screen and return to whichever one opened them.
type Screen =
  | 'eco-home'
  | 'eco-services'
  | 'notifications'
  | 'home'
  | 'student'
  | 'profile'
  | 'phieu-be-ngoan'
  | 'fee'
  | 'topup'
  | 'absence'
  | 'homework'
  | 'results'
  | 'hoa-don'
  | 'medicine'
  | 'attendance'
  | 'timetable'
  | 'spending'
  | 'menu'
  | 'activity'
  | 'bulletin'
  | 'diary'
  | 'chat'
  | 'gallery'
  | 'feedback'
  | 'link-student'
  | 'help'

// Which screen each service intent opens (Phiếu bé ngoan / Hóa đơn keep their
// original screen ids).
const INTENT_SCREEN: Record<ServiceIntent, Screen> = {
  fee: 'fee',
  topup: 'topup',
  goodbehavior: 'phieu-be-ngoan',
  hoadon: 'hoa-don',
  absence: 'absence',
  homework: 'homework',
  results: 'results',
  medicine: 'medicine',
  attendance: 'attendance',
  timetable: 'timetable',
  spending: 'spending',
  menu: 'menu',
  activity: 'activity',
  bulletin: 'bulletin',
  diary: 'diary',
  chat: 'chat',
  gallery: 'gallery',
  feedback: 'feedback',
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>('eco-home')
  const [returnScreen, setReturnScreen] = useState<Screen>('eco-home')
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)
  // Deep links: Dặn thuốc opened on a given order (notification, chat order
  // card), Trao đổi on a given conversation, Báo vắng straight on its form.
  const [medicineOrderId, setMedicineOrderId] = useState<string | null>(null)
  const [chatThreadId, setChatThreadId] = useState<string | null>(null)
  const [galleryAlbumId, setGalleryAlbumId] = useState<string | null>(null)
  const [absenceOnCreate, setAbsenceOnCreate] = useState(false)
  // Shortcuts between features (Điểm danh → Báo vắng, Trao đổi → đơn): back
  // returns to the feature that opened it without losing `returnScreen`.
  const [subReturn, setSubReturn] = useState<Screen | null>(null)

  // Opens a service for a student and remembers which screen it came from, so
  // back returns there. Used by both home screens, the service list and Học sinh.
  const openService = (intent: ServiceIntent, studentId: string, from: Screen) => {
    setMedicineOrderId(null)
    setChatThreadId(null)
    setGalleryAlbumId(null)
    setAbsenceOnCreate(false)
    setSubReturn(null)
    setActiveStudentId(studentId)
    setReturnScreen(from)
    setScreen(INTENT_SCREEN[intent])
  }
  const serviceNav = (from: Screen) => ({
    onOpenService: (intent: ServiceIntent, studentId: string) => openService(intent, studentId, from),
  })
  // Học sinh has its own origin: features opened from it overwrite
  // `returnScreen` with 'student', so back from Học sinh can't use that.
  const [studentOrigin, setStudentOrigin] = useState<Screen>('eco-home')
  const openStudent = (from: Screen) => (studentId: string) => {
    setActiveStudentId(studentId)
    setStudentOrigin(from)
    setScreen('student')
  }
  // Where "Về trang chủ" should land: the home the current flow started from.
  const originHome: Screen =
    returnScreen === 'student' ? studentOrigin : returnScreen === 'eco-services' || returnScreen === 'notifications' ? 'eco-home' : returnScreen

  return (
    <div className="desktop-backdrop">
      <div className="device-frame">
        <div className="device-notch" />
        <span className="device-side-button power" />
        <span className="device-side-button vol-up" />
        <span className="device-side-button vol-down" />
        <div className="device-screen">
          <div className="app-shell">
            <div className="status-bar">
              <span className="status-time">09:41</span>
              <span className="status-icons">
                <span className="status-wifi">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                <span className="status-battery">
                  <span className="status-battery-fill" />
                </span>
              </span>
            </div>

            <main className="screen-root">
              {screen === 'eco-home' && (
                <EcoHomeScreen
                  {...serviceNav('eco-home')}
                  onOpenServices={() => setScreen('eco-services')}
                  onOpenNotifications={() => setScreen('notifications')}
                  onOpenEcoParent={() => setScreen('home')}
                  onNavigateToStudent={openStudent('eco-home')}
                  onNavigateToLinkStudent={() => {
                    setReturnScreen('eco-home')
                    setScreen('link-student')
                  }}
                />
              )}

              {screen === 'notifications' && (
                <NotificationsApp
                  onBack={() => setScreen('eco-home')}
                  onOpenTarget={(target: NotificationTarget) => {
                    openService(target.type === 'medicine' ? 'medicine' : (target.intent as ServiceIntent), target.studentId, 'notifications')
                    if (target.type === 'medicine') setMedicineOrderId(target.orderId)
                    else if (target.threadId) setChatThreadId(target.threadId)
                    else if (target.albumId) setGalleryAlbumId(target.albumId)
                  }}
                />
              )}

              {screen === 'eco-services' && (
                <EcoServicesScreen
                  {...serviceNav('eco-services')}
                  onBack={() => setScreen('eco-home')}
                  onOpenEcoParent={() => setScreen('home')}
                />
              )}

              {screen === 'home' && (
                <ParentsHomeScreen
                  {...serviceNav('home')}
                  onBack={() => setScreen('eco-home')}
                  onNavigateToStudent={openStudent('home')}
                  onNavigateToHelp={() => {
                    setReturnScreen('home')
                    setScreen('help')
                  }}
                  onNavigateToLinkStudent={() => {
                    setReturnScreen('home')
                    setScreen('link-student')
                  }}
                />
              )}

              {screen === 'student' && activeStudentId && (
                <StudentScreen
                  studentId={activeStudentId}
                  onBack={() => setScreen(studentOrigin)}
                  onSelectStudent={setActiveStudentId}
                  onOpenProfile={(studentId) => {
                    setActiveStudentId(studentId)
                    setScreen('profile')
                  }}
                  onOpenService={(intent, studentId) => openService(intent, studentId, 'student')}
                />
              )}

              {screen === 'profile' && activeStudentId && (
                <ProfileApp studentId={activeStudentId} onBack={() => setScreen('student')} />
              )}

              {screen === 'phieu-be-ngoan' && activeStudentId && (
                <PhieuBeNgoanApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'fee' && activeStudentId && (
                <FeeApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'topup' && activeStudentId && (
                <TopupApp
                  studentId={activeStudentId}
                  onBack={() => setScreen(returnScreen)}
                  onGoHome={() => setScreen(originHome)}
                />
              )}

              {screen === 'absence' && activeStudentId && (
                <AbsenceApp
                  studentId={activeStudentId}
                  startOnCreate={absenceOnCreate}
                  onBack={() => setScreen(subReturn ?? returnScreen)}
                />
              )}

              {screen === 'homework' && activeStudentId && (
                <HomeworkApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'results' && activeStudentId && (
                <ResultsApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'hoa-don' && activeStudentId && (
                <HoaDonApp
                  studentId={activeStudentId}
                  onBack={() => setScreen(returnScreen)}
                  onGoHome={() => setScreen(originHome)}
                />
              )}

              {screen === 'medicine' && activeStudentId && (
                <MedicineApp
                  studentId={activeStudentId}
                  openOrderId={medicineOrderId}
                  onBack={() => setScreen(subReturn ?? returnScreen)}
                />
              )}

              {screen === 'attendance' && activeStudentId && (
                <AttendanceApp
                  studentId={activeStudentId}
                  onBack={() => setScreen(returnScreen)}
                  onCreateAbsence={(studentId) => {
                    setActiveStudentId(studentId)
                    setAbsenceOnCreate(true)
                    setSubReturn('attendance')
                    setScreen('absence')
                  }}
                />
              )}

              {screen === 'timetable' && activeStudentId && (
                <TimetableApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'spending' && activeStudentId && (
                <SpendingApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'menu' && activeStudentId && (
                <MenuApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'activity' && activeStudentId && (
                <ActivityApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'bulletin' && activeStudentId && (
                <BulletinApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'diary' && activeStudentId && (
                <DiaryApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'chat' && activeStudentId && (
                <ChatApp
                  studentId={activeStudentId}
                  openThreadId={chatThreadId}
                  onBack={() => setScreen(returnScreen)}
                  onOpenOrder={(card, studentId) => {
                    setActiveStudentId(studentId)
                    setSubReturn('chat')
                    setChatThreadId(null)
                    if (card.kind === 'medicine') {
                      setMedicineOrderId(card.orderId ?? null)
                      setScreen('medicine')
                    } else {
                      setAbsenceOnCreate(false)
                      setScreen('absence')
                    }
                  }}
                />
              )}

              {screen === 'gallery' && activeStudentId && (
                <GalleryApp
                  studentId={activeStudentId}
                  openAlbumId={galleryAlbumId}
                  onBack={() => setScreen(returnScreen)}
                />
              )}

              {screen === 'feedback' && activeStudentId && (
                <FeedbackApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'link-student' && <LinkStudentApp onBack={() => setScreen(returnScreen)} />}

              {screen === 'help' && <HelpApp onBack={() => setScreen(returnScreen)} />}
            </main>

            <div className="overlay-root" id="overlay-root" />
          </div>
        </div>
        <div className="device-home-indicator" />
      </div>
    </div>
  )
}
