'use client'

import { useState } from 'react'
import { getStudent } from '@/lib/mock-data'
import { AmountScreen } from './amount-screen'
import { ConfirmScreen } from './confirm-screen'
import { ResultScreen } from './result-screen'

interface TopupAppProps {
  studentId: string
  onBack: () => void
  onGoHome: () => void
}

type TopupScreen = 'amount' | 'confirm' | 'result'

// Mirrors App.formState['topup-amount-'+studentId] in the vanilla app: the
// chosen amount is only initialized once (here, via useState) and is NOT
// reset when returning to this screen via "Giao dịch mới" — same as vanilla,
// where formState persists across re-entries into topup-amount.
export function TopupApp({ studentId, onBack, onGoHome }: TopupAppProps) {
  const student = getStudent(studentId)
  const [screen, setScreen] = useState<TopupScreen>('amount')
  const [amount, setAmount] = useState(50000)
  const [showCustom, setShowCustom] = useState(false)
  const [txId, setTxId] = useState('')
  const [timeStr, setTimeStr] = useState('')

  if (!student) return null

  if (screen === 'confirm') {
    return (
      <ConfirmScreen
        student={student}
        amount={amount}
        onBack={() => setScreen('amount')}
        onContinue={() => {
          setTxId('2859' + Math.floor(86000 + Math.random() * 900))
          setTimeStr(
            new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
              ' 10/07/2026',
          )
          setScreen('result')
        }}
      />
    )
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        student={student}
        amount={amount}
        txId={txId}
        timeStr={timeStr}
        onGoHome={onGoHome}
        onNewTransaction={() => setScreen('amount')}
      />
    )
  }

  return (
    <AmountScreen
      student={student}
      amount={amount}
      showCustom={showCustom}
      onSelectPreset={(v) => {
        setAmount(v)
        setShowCustom(false)
      }}
      onCustomAmountChange={setAmount}
      onShowCustom={() => setShowCustom(true)}
      onConfirm={() => setScreen('confirm')}
      onBack={onBack}
    />
  )
}
