'use client'

import React from 'react'
import { TimetableScreen } from './timetable-screen'

interface TimetableAppProps {
  studentId?: string
  onBack: () => void
}

export function TimetableApp({
  studentId = 'nhu',
  onBack,
}: TimetableAppProps) {
  return <TimetableScreen initialStudentId={studentId} onBack={onBack} />
}

export { TimetableScreen }
export * from './timetable-data'
