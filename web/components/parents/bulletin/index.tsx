'use client'

import React from 'react'
import { BulletinScreen } from './bulletin-screen'

interface BulletinAppProps {
  studentId?: string
  onBack: () => void
}

export function BulletinApp({
  studentId = 'duong',
  onBack,
}: BulletinAppProps) {
  return <BulletinScreen initialStudentId={studentId} onBack={onBack} />
}

export { BulletinScreen }
export * from './bulletin-data'
