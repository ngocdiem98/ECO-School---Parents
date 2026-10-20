'use client'

import React, { useState } from 'react'
import { PostpaidFeeScreen } from './postpaid-fee-screen'
import { FeeApp } from '../fee'

interface PostpaidFeeAppProps {
  studentId: string
  onBack: () => void
}

export function PostpaidFeeApp({ studentId, onBack }: PostpaidFeeAppProps) {
  const [currentStep, setCurrentStep] = useState<'landing' | 'fee-payment'>('landing')

  if (currentStep === 'fee-payment') {
    // Hoc phi tra sau 3: Transitions directly into the Fee Payment flow
    return <FeeApp studentId={studentId} onBack={() => setCurrentStep('landing')} />
  }

  return (
    <PostpaidFeeScreen
      onBack={onBack}
      onOpenFeePayment={() => setCurrentStep('fee-payment')}
    />
  )
}

export { PostpaidFeeScreen }
