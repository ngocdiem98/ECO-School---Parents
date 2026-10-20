'use client'

import React from 'react'
import { SpendingHistoryScreen } from './spending-history-screen'

interface SpendingAppProps {
  studentId?: string
  onBack: () => void
}

export function SpendingApp({
  studentId = 'vy',
  onBack,
}: SpendingAppProps) {
  return <SpendingHistoryScreen initialStudentId={studentId} onBack={onBack} />
}

export { SpendingHistoryScreen }
export * from './spending-data'
