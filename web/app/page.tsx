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
  | 'link-student'
  | 'help'

export default function Page() {
  const [screen, setScreen] = useState<Screen>('eco-home')
  const [returnScreen, setReturnScreen] = useState<Screen>('eco-home')
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)

  // Opens a service for a student and remembers which screen it came from, so
  // back returns there. Used by both home screens and the service list.
  const openService = (target: Screen, from: Screen) => (studentId: string) => {
    setActiveStudentId(studentId)
    setReturnScreen(from)
    setScreen(target)
  }
  const serviceNav = (from: Screen) => ({
    onNavigateToPhieuBeNgoan: openService('phieu-be-ngoan', from),
    onNavigateToFee: openService('fee', from),
    onNavigateToTopup: openService('topup', from),
    onNavigateToAbsence: openService('absence', from),
    onNavigateToHomework: openService('homework', from),
    onNavigateToResults: openService('results', from),
    onNavigateToHoaDon: openService('hoa-don', from),
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
    returnScreen === 'student' ? studentOrigin : returnScreen === 'eco-services' ? 'eco-home' : returnScreen

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
                  onOpenEcoParent={() => setScreen('home')}
                  onNavigateToStudent={openStudent('eco-home')}
                  onNavigateToLinkStudent={() => {
                    setReturnScreen('eco-home')
                    setScreen('link-student')
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
                  onOpenFee={(studentId) => {
                    setActiveStudentId(studentId)
                    setReturnScreen('student')
                    setScreen('fee')
                  }}
                  onOpenTopup={(studentId) => {
                    setActiveStudentId(studentId)
                    setReturnScreen('student')
                    setScreen('topup')
                  }}
                  onOpenAbsence={(studentId) => {
                    setActiveStudentId(studentId)
                    setReturnScreen('student')
                    setScreen('absence')
                  }}
                  onOpenHomework={(studentId) => {
                    setActiveStudentId(studentId)
                    setReturnScreen('student')
                    setScreen('homework')
                  }}
                  onOpenResults={(studentId) => {
                    setActiveStudentId(studentId)
                    setReturnScreen('student')
                    setScreen('results')
                  }}
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
                <AbsenceApp studentId={activeStudentId} onBack={() => setScreen(returnScreen)} />
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
