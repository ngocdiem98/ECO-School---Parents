'use client'

import { useEffect, useRef, useState } from 'react'
import { EcoHomeScreen } from '@/components/parents/eco-me/eco-home-screen'
import { EcoServicesScreen } from '@/components/parents/eco-me/eco-services-screen'
import { StudentScreen } from '@/components/parents/student-screen'
import { ProfileApp } from '@/components/parents/profile'
import { CardDetailApp } from '@/components/parents/card-detail'
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
import { MOCK_INVITES, pendingInvites, type NotificationTarget } from '@/lib/mock-data'
import { LinkStudentApp } from '@/components/parents/link-student'
import { LinkInviteApp, type InviteView } from '@/components/parents/link-invite'
import { LinkManageApp } from '@/components/parents/link-manage'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { HelpApp } from '@/components/parents/help'
import { PostpaidFeeApp } from '@/components/parents/postpaid-fee'
import { ChildDevelopmentScreen } from '@/components/parents/development'
import { PickupApp } from '@/components/parents/pickup'
import { SurveyScreen } from '@/components/parents/survey'
import { DigitalReportApp } from '@/components/parents/digital-report'
import { HealthAdviceScreen } from '@/components/parents/health-advice'
import { TransferMoneyFlow } from '@/components/parents/transfer'
import { TopupWalletFlow } from '@/components/parents/topup-wallet'
import { MOCK_STUDENTS } from '@/lib/mock-data'

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
  | 'student'
  | 'profile'
  | 'card-detail'
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
  | 'postpaid-fee'
  | 'development'
  | 'pickup'
  | 'survey'
  | 'digital-report'
  | 'health-advice'
  | 'transfer'
  | 'topup-wallet'
  | 'link-student'
  | 'link-invite'
  | 'link-manage'
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
  postpaid: 'postpaid-fee',
  development: 'development',
  pickup: 'pickup',
  healthadvice: 'health-advice',
  survey: 'survey',
  digitalreport: 'digital-report',
  linkmanage: 'link-manage',
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>('eco-home')
  const [returnScreen, setReturnScreen] = useState<Screen>('eco-home')
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)
  // Tab Hồ sơ học sinh opens on (Hồ sơ học sinh tile → Thông tin chung, Sức khoẻ tile → Sức khoẻ).
  const [profileTab, setProfileTab] = useState<'info' | 'health'>('info')
  // Deep links: Dặn thuốc opened on a given order (notification, chat order
  // card), Trao đổi on a given conversation, Báo vắng straight on its form.
  const [medicineOrderId, setMedicineOrderId] = useState<string | null>(null)
  const [chatThreadId, setChatThreadId] = useState<string | null>(null)
  const [galleryAlbumId, setGalleryAlbumId] = useState<string | null>(null)
  const [absenceOnCreate, setAbsenceOnCreate] = useState(false)
  // Shortcuts between features (Điểm danh → Báo vắng, Trao đổi → đơn): back
  // returns to the feature that opened it without losing `returnScreen`.
  const [subReturn, setSubReturn] = useState<Screen | null>(null)
  // The QR scanner takes the whole screen; the link intro and ECO Me home draw their hero under the status bar.
  const [isLinkScanning, setIsLinkScanning] = useState(false)
  // Lời mời liên kết của trường (PRD 4.6): which invite screen is open, and whether the
  // floating widget on the ECO Me home was dismissed (for this session only).
  const [inviteNav, setInviteNav] = useState<{ view: InviteView; inviteId?: string }>({ view: 'list' })
  const [inviteWidgetHidden, setInviteWidgetHidden] = useState(false)
  const { toast, toastSuccess, show: showToast } = useToast()
  // After a link (EDU-1953): a manual link opens the new student's page; an invite returns to the
  // ECO Me home.
  const afterLinked = (studentId: string, to: 'student' | 'home') => {
    setActiveStudentId(studentId)
    if (to === 'student') {
      setStudentOrigin('eco-home')
      setScreen('student')
    } else {
      setScreen('eco-home')
    }
  }
  // On a real phone (or ?mobile=1) the iPhone frame is dropped and the app fills the screen.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const update = () => {
      const params = new URLSearchParams(window.location.search)
      if (params.get('simulator') === '0' || params.get('frame') === '0' || params.get('mobile') === '1') return setIsMobile(true)
      if (params.get('simulator') === '1' || params.get('frame') === '1' || params.get('desktop') === '1') return setIsMobile(false)
      // Only a real phone drops the frame; a narrow desktop window keeps the 390px iPhone frame.
      setIsMobile(
        /Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          (/iPad/i.test(navigator.userAgent) && window.innerWidth <= 768),
      )
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  // Every screen opens at the top (the scroll container is shared by all of them).
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [screen, activeStudentId])

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
    returnScreen === 'student' || returnScreen === 'card-detail' || returnScreen === 'profile' ? studentOrigin : returnScreen === 'eco-services' ||
        returnScreen === 'notifications' ||
        returnScreen === 'transfer' ||
        returnScreen === 'topup-wallet'
      ? 'eco-home' : returnScreen

  // One pending invite opens its detail, two or more open the list (floating widget and notifications).
  const openInvites = (from: Screen, inviteId?: string) => {
    const pending = pendingInvites()
    const target = inviteId ? MOCK_INVITES.find((i) => i.id === inviteId) : undefined
    if (inviteId && (!target || target.status !== 'pending')) setInviteNav({ view: 'expired' })
    else if (pending.length === 0) return
    else if (pending.length === 1) setInviteNav({ view: 'detail', inviteId: pending[0].id })
    else setInviteNav({ view: 'list' })
    setReturnScreen(from)
    setScreen('link-invite')
  }

  return (
    <div className={`desktop-backdrop ${isMobile ? 'desktop-backdrop--mobile' : ''}`}>
      <div className={`device-frame ${isMobile ? 'device-frame--mobile' : ''}`}>
        {!isMobile && <div className="device-notch" />}
        {!isMobile && <span className="device-side-button power" />}
        {!isMobile && <span className="device-side-button vol-up" />}
        {!isMobile && <span className="device-side-button vol-down" />}
        <div className={`device-screen ${isMobile ? 'device-screen--mobile' : ''}`}>
          <div
            className={`app-shell ${
              screen === 'eco-home' || (screen === 'link-student' && !isLinkScanning) ? 'app-shell--fullbleed' : ''
            } ${isMobile ? 'app-shell--mobile' : ''}`}
          >
            {!isMobile && <div className="status-bar">
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
            </div>}

            <main className="screen-root" ref={mainRef}>
              {screen === 'eco-home' && (
                <EcoHomeScreen
                  {...serviceNav('eco-home')}
                  onOpenServices={() => setScreen('eco-services')}
                  onOpenNotifications={() => setScreen('notifications')}
                  onOpenTransfer={() => setScreen('transfer')}
                  onOpenWalletTopup={() => setScreen('topup-wallet')}
                  onNavigateToStudent={openStudent('eco-home')}
                  onNavigateToLinkStudent={() => {
                    setReturnScreen('eco-home')
                    setScreen('link-student')
                  }}
                  inviteCount={inviteWidgetHidden ? 0 : pendingInvites().length}
                  onOpenInvites={() => openInvites('eco-home')}
                  onDismissInvites={() => setInviteWidgetHidden(true)}
                />
              )}

              {screen === 'notifications' && (
                <NotificationsApp
                  onBack={() => setScreen('eco-home')}
                  onOpenTarget={(target: NotificationTarget) => {
                    if (target.type === 'invite') return openInvites('notifications', target.inviteId)
                    if (target.type === 'invite-expired') {
                      setInviteNav({ view: 'expired' })
                      setReturnScreen('notifications')
                      return setScreen('link-invite')
                    }
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
                />
              )}

              {screen === 'student' && activeStudentId && (
                <StudentScreen
                  studentId={activeStudentId}
                  onBack={() => setScreen(studentOrigin)}
                  onSelectStudent={setActiveStudentId}
                  onOpenProfile={(studentId, tab) => {
                    setActiveStudentId(studentId)
                    setProfileTab(tab)
                    setScreen('profile')
                  }}
                  onOpenCard={(studentId) => {
                    setActiveStudentId(studentId)
                    setScreen('card-detail')
                  }}
                  onOpenHelp={() => {
                    setReturnScreen('student')
                    setScreen('help')
                  }}
                  onOpenService={(intent, studentId) => openService(intent, studentId, 'student')}
                />
              )}

              {screen === 'card-detail' && activeStudentId && (
                <CardDetailApp
                  studentId={activeStudentId}
                  onBack={() => setScreen('student')}
                  onSelectStudent={setActiveStudentId}
                  onOpenHelp={() => {
                    setReturnScreen('card-detail')
                    setScreen('help')
                  }}
                  onOpenService={(intent, studentId) => openService(intent, studentId, 'card-detail')}
                />
              )}

              {screen === 'profile' && activeStudentId && (
                <ProfileApp
                  studentId={activeStudentId}
                  initialTab={profileTab}
                  key={activeStudentId + profileTab}
                  onBack={() => setScreen('student')}
                  onSelectStudent={setActiveStudentId}
                  onOpenLinkManage={(studentId) => openService('linkmanage', studentId, 'profile')}
                  onOpenService={(intent, studentId) => {
                    setProfileTab('health') // back from Gợi ý cho ba mẹ returns to the Sức khoẻ tab
                    openService(intent, studentId, 'profile')
                  }}
                />
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

              {screen === 'postpaid-fee' && activeStudentId && (
                <PostpaidFeeApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'development' && activeStudentId && (
                <ChildDevelopmentScreen
                  studentId={activeStudentId}
                  onBack={() => setScreen(returnScreen)}
                  onSelectStudent={setActiveStudentId}
                  onNavigateToResults={(studentId) => {
                    setActiveStudentId(studentId)
                    setReturnScreen('development')
                    setScreen('results')
                  }}
                />
              )}

              {screen === 'pickup' && activeStudentId && (
                <PickupApp
                  studentId={activeStudentId}
                  onBack={() => setScreen(returnScreen)}
                  onSelectStudent={setActiveStudentId}
                />
              )}

              {screen === 'digital-report' && activeStudentId && (
                <DigitalReportApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'survey' && (
                <SurveyScreen onBack={() => setScreen(returnScreen)} onSuccess={() => setScreen(returnScreen)} />
              )}

              {screen === 'health-advice' && activeStudentId && (
                <HealthAdviceScreen studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
              )}

              {screen === 'transfer' && (
                <TransferMoneyFlow
                  onBack={() => setScreen('eco-home')}
                  onNavigateToFee={() => openService('fee', activeStudentId ?? MOCK_STUDENTS[0].id, 'transfer' as Screen)}
                  onNavigateToPostpaid={() => openService('postpaid', activeStudentId ?? MOCK_STUDENTS[0].id, 'transfer' as Screen)}
                />
              )}

              {screen === 'topup-wallet' && (
                <TopupWalletFlow
                  onBack={() => setScreen('eco-home')}
                  onNavigateToFee={() => openService('fee', activeStudentId ?? MOCK_STUDENTS[0].id, 'topup-wallet' as Screen)}
                  onNavigateToPostpaid={() => openService('postpaid', activeStudentId ?? MOCK_STUDENTS[0].id, 'topup-wallet' as Screen)}
                />
              )}

              {screen === 'link-student' && (
                <LinkStudentApp
                  onBack={() => setScreen(returnScreen)}
                  onScanModeChange={setIsLinkScanning}
                  onLinked={(studentId) => afterLinked(studentId, 'student')}
                />
              )}

              {screen === 'link-invite' && (
                <LinkInviteApp
                  initial={inviteNav}
                  onBack={() => setScreen(returnScreen)}
                  onGoEcoMe={() => setScreen('eco-home')}
                  onLinked={(studentId) => afterLinked(studentId, 'home')}
                  onToast={showToast}
                />
              )}

              {screen === 'link-manage' && activeStudentId && (
                <LinkManageApp
                  studentId={activeStudentId}
                  onBack={() => setScreen(returnScreen)}
                  onSelectStudent={setActiveStudentId}
                  onLeft={(studentId) => {
                    const i = MOCK_STUDENTS.findIndex((x) => x.id === studentId)
                    if (i >= 0) MOCK_STUDENTS.splice(i, 1)
                    setActiveStudentId(null)
                    setScreen('eco-home')
                    showToast('Đã huỷ liên kết với học sinh')
                  }}
                />
              )}

              {screen === 'help' && <HelpApp onBack={() => setScreen(returnScreen)} />}
            </main>

            {toast && <Toast message={toast} success={toastSuccess} />}

            <div className="overlay-root" id="overlay-root" />
          </div>
        </div>
        {!isMobile && <div className="device-home-indicator" />}
      </div>
    </div>
  )
}
